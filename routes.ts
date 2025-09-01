import { Router, Request, Response, NextFunction } from "express";

import EmployeeRoutes from "./modules/employee/employee.route";

const router = Router();

router.use('/employee', EmployeeRoutes);

export default router;