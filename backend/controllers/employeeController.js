const EmployeeModel = require('../models/employeeModel');

const withLinks = (employee, req) => {
  if (!employee) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  const base = `${protocol}://${host}/api/employees`;

  return {
    ...employee,
    _links: {
      self: { href: `${base}/${employee.id}`, method: 'GET' },
      update: { href: `${base}/${employee.id}`, method: 'PUT' },
      patch: { href: `${base}/${employee.id}`, method: 'PATCH' },
      delete: { href: `${base}/${employee.id}`, method: 'DELETE' },
      collection: { href: base, method: 'GET' },
    },
  };
};

class EmployeeController {
  static async getAllEmployees(req, res, next) {
    try {
      const { search, department, sortBy, sortOrder } = req.query;
      const employees = await EmployeeModel.findAll({
        search,
        department,
        sortBy,
        sortOrder,
      });

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({
        success: true,
        count: employees.length,
        data: employees.map((emp) => withLinks(emp, req)),
        _links: {
          self: { href: req.originalUrl, method: 'GET' },
          create: { href: '/api/employees', method: 'POST' },
          stats: { href: '/api/employees/stats', method: 'GET' },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeeById(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await EmployeeModel.findById(id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found.`,
        });
      }

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({
        success: true,
        data: withLinks(employee, req),
      });
    } catch (error) {
      next(error);
    }
  }

  static async createEmployee(req, res, next) {
    try {
      const { name, email, mobile, department, designation } = req.body;

      const existing = await EmployeeModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `An employee with email "${email}" already exists.`,
          errors: {
            email: 'Email address is already in use by another employee.',
          },
        });
      }

      const newEmployee = await EmployeeModel.create({
        name,
        email,
        mobile,
        department,
        designation,
      });

      res.location(`/api/employees/${newEmployee.id}`);
      res.status(201).json({
        success: true,
        message: 'Employee created successfully.',
        data: withLinks(newEmployee, req),
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, mobile, department, designation } = req.body;

      const existingEmployee = await EmployeeModel.findById(id);
      if (!existingEmployee) {
        return res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found.`,
        });
      }

      const emailConflict = await EmployeeModel.findByEmail(email, id);
      if (emailConflict) {
        return res.status(409).json({
          success: false,
          message: `Email "${email}" is already used by another employee.`,
          errors: {
            email: 'Email address is already in use by another employee.',
          },
        });
      }

      const updatedEmployee = await EmployeeModel.update(id, {
        name,
        email,
        mobile,
        department,
        designation,
      });

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully.',
        data: withLinks(updatedEmployee, req),
      });
    } catch (error) {
      next(error);
    }
  }

  static async patchEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const existingEmployee = await EmployeeModel.findById(id);
      if (!existingEmployee) {
        return res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found.`,
        });
      }

      if (req.body.email) {
        const emailConflict = await EmployeeModel.findByEmail(req.body.email, id);
        if (emailConflict) {
          return res.status(409).json({
            success: false,
            message: `Email "${req.body.email}" is already used by another employee.`,
            errors: {
              email: 'Email address is already in use by another employee.',
            },
          });
        }
      }

      const patched = await EmployeeModel.patch(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Employee patched successfully.',
        data: withLinks(patched, req),
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const deletedEmployee = await EmployeeModel.delete(id);

      if (!deletedEmployee) {
        return res.status(404).json({
          success: false,
          message: `Employee with ID ${id} not found.`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Employee "${deletedEmployee.name}" deleted successfully.`,
        data: deletedEmployee,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeeStats(req, res, next) {
    try {
      const stats = await EmployeeModel.getStats();
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDepartments(req, res, next) {
    try {
      const departments = await EmployeeModel.getDepartments();
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({
        success: true,
        data: departments,
      });
    } catch (error) {
      next(error);
    }
  }

  static optionsCollection(req, res) {
    res.setHeader('Allow', 'GET, POST, HEAD, OPTIONS');
    res.status(204).end();
  }

  static optionsResource(req, res) {
    res.setHeader('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.status(204).end();
  }
}

module.exports = EmployeeController;
