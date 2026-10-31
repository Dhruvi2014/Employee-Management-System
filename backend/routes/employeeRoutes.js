const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const { validateEmployee, validatePatchEmployee } = require('../middleware/validation');

router.get('/stats', EmployeeController.getEmployeeStats);
router.get('/departments', EmployeeController.getDepartments);

router.options('/', EmployeeController.optionsCollection);
router.get('/', EmployeeController.getAllEmployees);
router.post('/', validateEmployee, EmployeeController.createEmployee);

router.options('/:id', EmployeeController.optionsResource);
router.get('/:id', EmployeeController.getEmployeeById);
router.put('/:id', validateEmployee, EmployeeController.updateEmployee);
router.patch('/:id', validatePatchEmployee, EmployeeController.patchEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);

module.exports = router;
