import { Request, Response } from "express";
import HTTP_STATUS from "../../constants/http.constants";
import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import employeeService from "./employee.service";


class EmployeeController extends Default {
    constructor() {
        super();
    }

    /**
     * @method EmployeeController:addEmployeeController
     * @description Controller to handle adding a new employee.     
     * @param req 
     * @param res 
     * @returns  
     * /
    **/
    async addEmployeeController(req: Request, res: Response) {
        try {
            this.logger.info('Inside EmployeeController - addEmployeeController method');
            const response = await employeeService.createNewEmployee(req.body);
            if (!response) throw new CustomError('Failed to create employee', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.CREATED).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside EmployeeController - addEmployeeController method - Error while adding new employee: ${error}`);
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
    }

    /**
     * @method EmployeeController:updateEmployeeController
     * @description Controller to handle updating an existing employee.     
     * @param req 
     * @param res 
     * @returns  
    **/
    async updateEmployeeController(req: Request, res: Response) {
        try {
            this.logger.info('Inside EmployeeController - updateEmployeeController method');
            const response = await employeeService.updateEmployee(req.params.id!, req.body);
            if (!response) throw new CustomError('Failed to update employee', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside EmployeeController - updateEmployeeController method - Error while updating employee: ${error}`);
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
     * @method EmployeeController:getAllEmployeesController
     * @description Controller to handle fetching all employees.     
     * @param req 
     * @param res 
     * @returns
    */
    async getAllEmployeesController(req: Request, res: Response) {
        try {
            this.logger.info('Inside EmployeeController - getAllEmployeesController method');
            const response = await employeeService.getAllEmployees();
            if (!response) throw new CustomError('Failed to fetch employees', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: 'Employees fetched successfully',
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside EmployeeController - getAllEmployeesController method - Error while fetching employees: ${error}`);
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
     * @method EmployeeController:getTokenController
     * @description Controller to handle generating a token for an employee.     
     * @param req 
     * @param res 
     * @returns
    */
    async getTokenController(req: Request, res: Response) {
        try {
            this.logger.info('Inside EmployeeController - getTokenController method');
            if (!req.body) throw new CustomError('Full Name is required', HTTP_STATUS.BAD_REQUEST);

            const response = await employeeService.generateToken(req.body);
            if (!response) throw new CustomError('Failed to generate token', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: 'Token generated successfully',
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside EmployeeController - getTokenController method - Error while generating token: ${error}`);
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
    }       

};

export default new EmployeeController();