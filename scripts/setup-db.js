const path = require('path');
const fs = require('fs');

const backendDir = path.join(__dirname, '..', 'backend');
const backendNodeModules = path.join(backendDir, 'node_modules');

let pg;
let dotenv;

try {
  pg = require(path.join(backendNodeModules, 'pg'));
} catch (e) {
  try {
    pg = require('pg');
  } catch (err) {
    console.error('Error: PostgreSQL client ("pg") not found. Please run "cd backend && npm install" first.');
    process.exit(1);
  }
}

try {
  dotenv = require(path.join(backendNodeModules, 'dotenv'));
  const envPath = path.join(backendDir, '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
} catch (e) {}

const { Client } = pg;

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME || 'employee_db';

async function setupDatabase() {
  console.log('----------------------------------------------------');
  console.log(' Setting up PostgreSQL Employee Management Database ');
  console.log('----------------------------------------------------');
  console.log(`Host: ${DB_HOST}:${DB_PORT}`);
  console.log(`User: ${DB_USER}`);
  console.log(`Database: ${DB_NAME}`);

  const rootClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await rootClient.connect();
    console.log(' Connected to PostgreSQL server.');

    const checkDb = await rootClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (checkDb.rows.length === 0) {
      console.log(`Creating database "${DB_NAME}"...`);
      await rootClient.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Database "${DB_NAME}" created successfully.`);
    } else {
      console.log(`Database "${DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error(' Error checking/creating database:', err.message);
    process.exit(1);
  } finally {
    await rootClient.end();
  }

  const appClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  try {
    await appClient.connect();
    console.log(` Connected to "${DB_NAME}". Applying schema...`);

    const schemaSqlPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
    await appClient.query(schemaSql);
    console.log(' Schema executed successfully (table and indexes created).');

    console.log(' Applying sample seed data...');
    const seedSqlPath = path.join(__dirname, '..', 'database', 'seed.sql');
    const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
    await appClient.query(seedSql);
    console.log(' Seed data inserted successfully.');

    const countRes = await appClient.query('SELECT COUNT(*) FROM employees');
    console.log(`Total employees in database: ${countRes.rows[0].count}`);
    console.log('----------------------------------------------------');
    console.log(' Database setup completed successfully!');
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error(' Error executing schema/seed:', err.message);
    process.exit(1);
  } finally {
    await appClient.end();
  }
}

setupDatabase();
