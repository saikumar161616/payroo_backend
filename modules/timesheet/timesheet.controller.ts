import { Request, Response } from 'express';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';
import { CustomError } from '../../error-handlers/custom.error';
import timesheetService from './timesheet.service';

class TimesheetController extends Default {
    constructor() {
        super();
    }

    /**
     * @method TimesheetController:addTimesheetController
     * @description Controller to handle adding a new timesheet entry.     
     * @param req 
     * @param res 
     * @returns  
    **/
    async addTimesheetController(req: Request, res: Response) {
        try {
            this.logger.info('Inside TimesheetController - addTimesheetController method');
            const response = await timesheetService.createNewTimesheet(req.body);
            if (!response) throw new CustomError('Failed to create timesheet entry', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.CREATED).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside TimesheetController - addTimesheetController method - Error while adding new timesheet entry: ${error}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message || error,
                    status: false
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error
            });
        }
    };
    
    /**
     * @method TimesheetController:getTimesheetsController
     * @description Controller to handle fetching timesheet entries.     
     * @param req 
     * @param res 
     * @returns  
    **/
    async getTimesheetsController(req: Request, res: Response) {
        try {
            this.logger.info('Inside TimesheetController - getTimesheetsController method');
            const response = await timesheetService.fetchTimesheets(req.query);
            if (!response) throw new CustomError('Failed to fetch timesheet entries', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside TimesheetController - getTimesheetsController method - Error while fetching timesheet entries: ${error}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message || error,
                    status: false
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error
            });
        }
    };

    /**
     * @method TimesheetController:updateTimesheetController
     * @description Controller to handle updating a timesheet entry.     
     * @param req 
     * @param res               
     * @return
     * s
     */ 
    async updateTimesheetController(req: Request, res: Response) {
        try {
            this.logger.info('Inside TimesheetController - updateTimesheetController method');
            const timesheetId = req.params.id;
            if (!timesheetId) throw new CustomError('Timesheet ID is required', HTTP_STATUS.BAD_REQUEST);               
            const response = await timesheetService.updateTimesheet(timesheetId, req.body);
            if (!response) throw new CustomError('Failed to update timesheet entry', HTTP_STATUS.INTERNAL_SERVER_ERROR);
            
            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }       
        catch (error: any) {
            this.logger.error(`Inside TimesheetController - updateTimesheetController method - Error while updating timesheet entry: ${error}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message || error,
                    status: false
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error
            });
        }
    };

}

export default new TimesheetController();