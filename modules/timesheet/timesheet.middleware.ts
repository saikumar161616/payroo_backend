import { Request, Response, NextFunction } from 'express';
import { addtimesheetValidator, gettimesheetValidator } from './timesheet.model';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';

class TimesheetMiddleware extends Default {
    constructor() {
        super();
    }

    /**
     * @method prepareAddTimesheet
     * @description Middleware to validate and prepare the request body for adding a new timesheet entry.
     * @param req 
     * @param res 
     * @param next 
     * @returns 
    */
    async prepareAddTimesheet(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside TimesheetMiddleware - prepareAddTimesheet method');
            const inputValidation = await addtimesheetValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside TimesheetMiddleware - prepareAddTimesheet method - Error while validating add timesheet request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }           

    /**
     * @method prepareGetTimesheets
     * @description Middleware to prepare the request for fetching timesheet entries.
     * @param req 
     * @param res 
     * @param next 
     * @returns 
    */
    async prepareGetTimesheets(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside TimesheetMiddleware - prepareGetTimesheets method');
            console.log("req.query", req.query);
            await gettimesheetValidator.validateAsync(req.query);
            next();
        } catch (error) {
            console.log("error", error);
            this.logger.error(`Inside TimesheetMiddleware - prepareGetTimesheets method - Error while preparing get timesheets request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    };
    
    /**
     * @method prepareUpdateTimesheet
     * @description Middleware to validate and prepare the request body for updating a timesheet entry.
     * @param req 
     * @param res 
     * @param next 
     * @returns 
    */
    async prepareUpdateTimesheet(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside TimesheetMiddleware - prepareUpdateTimesheet method');
            const inputValidation = await addtimesheetValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside TimesheetMiddleware - prepareUpdateTimesheet method - Error while validating update timesheet request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }       

}

export default new TimesheetMiddleware();