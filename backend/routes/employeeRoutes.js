const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validation');

// Specific routes first to prevent :id param collisions
router.get('/stats', EmployeeController.getEmployeeStats);

// Collection routes
router.get('/', EmployeeController.getAllEmployees);
router.post('/', validateEmployee, EmployeeController.createEmployee);

// Resource by ID routes
router.get('/:id', EmployeeController.getEmployeeById);
router.put('/:id', validateEmployee, EmployeeController.updateEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);

module.exports = router;
