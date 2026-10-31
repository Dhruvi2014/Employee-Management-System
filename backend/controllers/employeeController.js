const EmployeeModel = require('../models/employeeModel');

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

      res.status(200).json({
        success: true,
        count: employees.length,
        data: employees,
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

      res.status(200).json({
        success: true,
        data: employee,
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

      res.status(201).json({
        success: true,
        message: 'Employee created successfully.',
        data: newEmployee,
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
        data: updatedEmployee,
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
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmployeeController;
