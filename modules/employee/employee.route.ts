import { NextFunction, Request, Response, Router} from 'express';
import EmployeeMiddleware from './employee.middleware'; 
import EmployeeController from './employee.controller';
import AuthMiddleware from '../../config/authMiddleware';

const router = Router();

/**
 * @route /employees
 * @description Route to handle employee-related operations.
*/

router.get('/', 
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response) => EmployeeController.getAllEmployeesController(req, res));

router.post('/', 
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => EmployeeMiddleware.prepareAddEmployee(req, res, next),
    (req: Request, res: Response) => EmployeeController.addEmployeeController(req, res)
);

router.patch('/:id', 
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => EmployeeMiddleware.prepareUpdateEmployee(req, res, next),
    (req: Request, res: Response) => EmployeeController.updateEmployeeController(req, res)
);

router.post('/get-token', 
    (req: Request, res: Response) => EmployeeController.getTokenController(req, res)
);

export default router;