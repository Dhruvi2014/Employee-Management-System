const db = require('../config/db');

class EmployeeModel {
  static async findAll({ search, department, sortBy = 'id', sortOrder = 'DESC' } = {}) {
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search && search.trim()) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    if (department && department.trim() && department !== 'All') {
      query += ` AND department = $${paramIndex}`;
      params.push(department.trim());
      paramIndex++;
    }

    const allowedSortColumns = ['id', 'name', 'email', 'department', 'designation', 'created_at'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'id';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    const { rows } = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM employees WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async findByEmail(email, excludeId = null) {
    let query = 'SELECT id, email FROM employees WHERE LOWER(email) = LOWER($1)';
    const params = [email.trim()];

    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }

    const { rows } = await db.query(query, params);
    return rows[0] || null;
  }

  static async create({ name, email, mobile, department, designation }) {
    const query = `
      INSERT INTO employees (name, email, mobile, department, designation, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [name.trim(), email.trim().toLowerCase(), mobile.trim(), department.trim(), designation.trim()];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, { name, email, mobile, department, designation }) {
    const query = `
      UPDATE employees
      SET name = $1,
          email = $2,
          mobile = $3,
          department = $4,
          designation = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
    `;
    const values = [name.trim(), email.trim().toLowerCase(), mobile.trim(), department.trim(), designation.trim(), id];
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  }

  static async delete(id) {
    const query = 'DELETE FROM employees WHERE id = $1 RETURNING *;';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async getStats() {
    const totalCountQuery = 'SELECT COUNT(*)::int AS total FROM employees;';
    const deptStatsQuery = `
      SELECT department, COUNT(*)::int AS count
      FROM employees
      GROUP BY department
      ORDER BY count DESC;
    `;
    const recentQuery = `
      SELECT id, name, designation, department, created_at
      FROM employees
      ORDER BY created_at DESC
      LIMIT 5;
    `;

    const [totalResult, deptResult, recentResult] = await Promise.all([
      db.query(totalCountQuery),
      db.query(deptStatsQuery),
      db.query(recentQuery),
    ]);

    return {
      totalEmployees: totalResult.rows[0]?.total || 0,
      departmentStats: deptResult.rows,
      recentEmployees: recentResult.rows,
    };
  }
}

module.exports = EmployeeModel;
