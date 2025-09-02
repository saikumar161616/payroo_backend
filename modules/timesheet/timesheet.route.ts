import { Request, Response, NextFunction , Router} from 'express';
import TimesheetMiddleware from './timesheet.middleware';
import TimesheetController from './timesheet.controller';
import AuthMiddleware from '../../config/authMiddleware';

const router = Router();

/**
 * @route /timesheets
 * @description Route to handle timesheet-related operations.
*/

router.post('/', 
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => TimesheetMiddleware.prepareAddTimesheet(req, res, next),
    (req: Request, res: Response) => TimesheetController.addTimesheetController(req, res)
);

router.get('/', 
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => TimesheetMiddleware.prepareGetTimesheets(req, res, next),
    (req: Request, res: Response) => TimesheetController.getTimesheetsController(req, res)
);


router.patch('/:id',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => TimesheetMiddleware.prepareUpdateTimesheet(req, res, next),
    (req: Request, res: Response) => TimesheetController.updateTimesheetController(req, res)
);

export default router;