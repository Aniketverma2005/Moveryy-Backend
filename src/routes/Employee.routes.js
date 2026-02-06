import { Router } from "express";
import { changeStatus, countEmployee, createEmployee, deleteEmployeeById, fetchEmployeeById, getEmployee, getEmployeeBookings, loginEmployee, logoutEmployee, resetEmployeePassword, updateEmployeeDetails } from "../controllers/Employee/Employee.controllers.js";
import { verifyEmployeeToken, verifyNewGeneratedToken, verifyToken } from "../middlewares/Auth.middleware.js";

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

router.route('').get(verifyNewGeneratedToken, countEmployee)

router.route('/reset-password').post(verifyNewGeneratedToken, resetEmployeePassword)

router.route('/bookings').get(verifyEmployeeToken, getEmployeeBookings)

export default router