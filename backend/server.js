const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const employeeRoutes = require('./routes/employeeRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as current_time');
    res.status(200).json({
      status: 'UP',
      timestamp: result.rows[0].current_time,
      database: 'Connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      database: 'Disconnected',
      error: error.message,
    });
  }
});

app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Employee Management System API',
    endpoints: {
      health: '/api/health',
      employees: '/api/employees',
      stats: '/api/employees/stats',
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Employee Management Backend Server Running!`);
  console.log(` Port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`   To free port ${PORT} on Windows PowerShell, run:`);
    console.error(`   Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force`);
    console.error(`   Or configure a different PORT in backend/.env (e.g., PORT=5001)\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

module.exports = app;
