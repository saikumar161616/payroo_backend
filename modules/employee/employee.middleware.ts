import { Request, Response, NextFunction } from 'express';
import { addEmployeeSchemaValidator, updateEmployeeSchemaValidator, employeeIdValidator } from './employee.model';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';


class EmployeeMiddleware extends Default {
    constructor() {
        super();
    }

    /**
     * @method prepareAddEmployee
     * @description Middleware to validate and prepare the request body for adding a new employee.
     * @param req 
     * @param res 
     * @param next 
     * @returns 
    */
    async prepareAddEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside EmployeeMiddleware - prepareAddEmployee method');
            const inputValidation = await addEmployeeSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside EmployeeMiddleware - prepareAddEmployee method - Error while validating add employee request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }

    /**
     * @method prepareUpdateEmployee
     * @description Middleware to validate and prepare the request body for updating an existing employee.
     * @param req 
     * @param res 
     * @param next 
     * @returns 
    */
    async prepareUpdateEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside EmployeeMiddleware - prepareUpdateEmployee method');
            await employeeIdValidator.validateAsync({ id: req.params?.id });
            await updateEmployeeSchemaValidator.validateAsync(req.body);
            next();
        } catch (error) {
            this.logger.error(`Inside EmployeeMiddleware - prepareUpdateEmployee method - Error while validating update employee request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }
}

export default new EmployeeMiddleware();