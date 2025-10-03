import { Router } from "express";
import { changeStatus, createEmployee, deleteEmployeeById, fetchEmployeeById, getEmployee, loginEmployee, logoutEmployee, updateEmployeeDetails } from "../controllers/Employee.controllers.js";
import { verifyEmployeeToken, verifyNewGeneratedToken } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route('/create').post(verifyNewGeneratedToken, createEmployee)

//For Employee
router.route('/login').post(loginEmployee)

router.route('/all').get(verifyNewGeneratedToken, getEmployee)

router.route('/:employeeId').get(verifyNewGeneratedToken, fetchEmployeeById)

router.route('/:employeeId').delete(verifyNewGeneratedToken, deleteEmployeeById)

//For Employee
router.route('/logout').post(verifyEmployeeToken, logoutEmployee)

//For Employee
router.route('/status').post(verifyEmployeeToken, changeStatus)

router.route('/:id').patch(verifyNewGeneratedToken, updateEmployeeDetails)

export default router