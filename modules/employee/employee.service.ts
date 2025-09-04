import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import HTTP_STATUS from "../../constants/http.constants";
import { STATUS } from "../../constants/feild.constants";
import EMPLOYEE_CONSTANTS from "./employee.constants";
import { EmployeeModel } from "./employee.model";


class EmployeeService extends Default {
    constructor() {
        super();
    }

    /**
     * @method EmployeeService:createNewEmployee
     * @description Service to create a new employee into the database after all validations are done.
     * @param employeeData 
    */
    async createNewEmployee(employeeData: any) {
        // TO ensure atomitcity and prevent partial saves - using mongoose transactions
        const session = await EmployeeModel.startSession();
        session.startTransaction();
        try {
            this.logger.info('Inside EmployeeService - createNewEmployee method');

            // Logic to create a new employee in the database goes here.
            if (!employeeData) throw new CustomError('Employee data is required', HTTP_STATUS.BAD_REQUEST);
            const isEmployeeExist = await EmployeeModel.findOne({ email: employeeData.email });
            if (isEmployeeExist) throw new CustomError(EMPLOYEE_CONSTANTS.EMPLOYEE_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
            const newEmployee = new EmployeeModel(employeeData);
            const savedEmployee = await newEmployee.save();

            const { id, firstName, lastName, email, type, status, bank, baseHourlyRate, superRate } = savedEmployee.toObject();

            await session.commitTransaction();
            session.endSession();

            return {
                status: true,
                message: EMPLOYEE_CONSTANTS.EMPLOYEE_CREATED,
                data: { id, firstName, lastName, email, type, status, bank, baseHourlyRate, superRate }
            }

        }
        catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            this.logger.error(`Inside EmployeeService - createNewEmployee method - Error while creating new employee: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @method EmployeeService:updateEmployee
     * @description Service to update an existing employee in the database after all validations are done.
     * @param employeeId 
     * @param updateData 
    */
    async updateEmployee(employeeId: string, updateData: any) {
        try {
            this.logger.info('Inside EmployeeService - updateEmployee method');
            // Logic to update an existing employee in the database goes here.
            if (!employeeId) throw new CustomError('Employee ID is required', HTTP_STATUS.BAD_REQUEST);
            if (!updateData || Object.keys(updateData).length === 0) throw new CustomError('Employee data is required', HTTP_STATUS.BAD_REQUEST);

            const existingEmployee = await EmployeeModel.findOne({ id: employeeId });
            if (!existingEmployee) throw new CustomError(EMPLOYEE_CONSTANTS.EMPLOYEE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

            if (updateData.email && updateData.email !== existingEmployee.email) {
                const emailExists = await EmployeeModel.findOne({ email: updateData.email });
                if (emailExists) throw new CustomError(EMPLOYEE_CONSTANTS.EMPLOYEE_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
            }

            const updatedEmployee = await EmployeeModel.findOneAndUpdate(
                { id: employeeId },
                { $set: updateData },
                { new: true }
            );
            if (!updatedEmployee) throw new CustomError('Failed to update employee', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            const { id, firstName, lastName, email, type, status, bank, baseHourlyRate, superRate } = updatedEmployee.toObject();

            return {
                status: true,
                message: EMPLOYEE_CONSTANTS.EMPLOYEE_UPDATED,
                data: { id, firstName, lastName, email, type, status, bank, baseHourlyRate, superRate }
            }

        }
        catch (error: any) {
            this.logger.error(`Inside EmployeeService - updateEmployee method - Error while updating employee: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    };


    /**
     * @method EmployeeService:getAllEmployees
     * @description Service to fetch all employees from the database.
    */
    async getAllEmployees() {
        try {
            this.logger.info('Inside EmployeeService - getAllEmployees method');
            const employees = await EmployeeModel.find({ status: STATUS.ACTIVE }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean();
            return {
                status: true,
                message: EMPLOYEE_CONSTANTS.EMPLOYEE_FETCHED,
                data: employees
            }
        } catch (error: any) {
            this.logger.error(`Inside EmployeeService - getAllEmployees method - Error while fetching employees: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    };


    /**
     * @method EmployeeService:generateToken
     * @description Service to generate a token for an employee based on their ID and email.
     * @param employeeId 
     * @param email 
    */
    async generateToken(body: any) {
        try {
            this.logger.info('Inside EmployeeService - generateToken method');

            const token = await this.jwtTokenGenerator(body);

            return {
                status: true,
                message: 'Token generated successfully',
                data: token
            }

        }
        catch (error: any) {
            this.logger.error(`Inside EmployeeService - generateToken method - Error while generating token: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    };

}

export default new EmployeeService();