import { Router, Request, Response, NextFunction } from "express";

import EmployeeRoutes from "./modules/employee/employee.route";
import TimesheetRoutes from "./modules/timesheet/timesheet.route";

const router = Router();

router.use('/employee', EmployeeRoutes);
router.use('/timesheet', TimesheetRoutes);

export default router;