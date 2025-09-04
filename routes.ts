import { Router, Request, Response, NextFunction } from "express";

import EmployeeRoutes from "./modules/employee/employee.route";
import TimesheetRoutes from "./modules/timesheet/timesheet.route";
import PayrunRoutes from "./modules/payrun/payrun.route";

const router = Router();

router.use('/employee', EmployeeRoutes);
router.use('/timesheet', TimesheetRoutes);
router.use('/payrun', PayrunRoutes);

export default router;