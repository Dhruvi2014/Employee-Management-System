const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validation');

router.get('/stats', EmployeeController.getEmployeeStats);
router.get('/', EmployeeController.getAllEmployees);
router.post('/', validateEmployee, EmployeeController.createEmployee);
router.get('/:id', EmployeeController.getEmployeeById);
router.put('/:id', validateEmployee, EmployeeController.updateEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);

module.exports = router;
