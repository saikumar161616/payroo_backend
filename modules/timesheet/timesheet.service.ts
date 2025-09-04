import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import HTTP_STATUS from "../../constants/http.constants";
import { STATUS } from "../../constants/feild.constants";
import TIMESHEET_CONSTANTS from "./timesheet.constants";
import { TimesheetModel } from "./timesheet.model";
import mongoose from "mongoose";

import { EmployeeModel } from "../employee/employee.model";

class TimesheetService extends Default {
    constructor() {
        super();
    }

    /**
     * @method TimesheetService:createNewTimesheet
     * @description Service to create a new timesheet entry into the database after all validations are done.
     * @param timesheetData 
    */
    async createNewTimesheet(timesheetData: any) {
        try {
            this.logger.info('Inside TimesheetService - createNewTimesheet method');
            // Logic to create a new timesheet entry in the database goes here.
            if (!timesheetData) throw new CustomError('Timesheet data is required', HTTP_STATUS.BAD_REQUEST);

            // find for employee status is active
            const employeeStatus = await EmployeeModel.findOne({ id: timesheetData.employeeId });
            if (!employeeStatus) throw new CustomError('Employee not found', HTTP_STATUS.NOT_FOUND);
            if (employeeStatus.status !== STATUS.ACTIVE) throw new CustomError('Cannot add timesheet for inactive employee', HTTP_STATUS.BAD_REQUEST);

            // employeeId to ObjectId
            timesheetData.employeeId = employeeStatus._id;

            // Check for existing timesheet for the same employee and period
            const existingTimesheet = await TimesheetModel.findOne({
                employeeId: timesheetData.employeeId,
                periodStart: timesheetData.periodStart,
                periodEnd: timesheetData.periodEnd
            });

            if (existingTimesheet) throw new CustomError('A timesheet for this employee and period already exists', HTTP_STATUS.CONFLICT);
        
            const newTimesheet = new TimesheetModel(timesheetData);
            const savedTimesheet = await newTimesheet.save();


            return {
                status: true,
                message: TIMESHEET_CONSTANTS.TIMESHEET_CREATED,
                data: savedTimesheet
            }

        }
        catch (error: any) {
            console.log("error", error);
            this.logger.error(`Inside TimesheetService - createNewTimesheet method - Error while creating new timesheet entry: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @method TimesheetService:fetchTimesheets
     * @description Service to fetch timesheet entries from the database based on query parameters.
     * @param query 
    */
    async fetchTimesheets(query: any) {
        try {
            this.logger.info('Inside TimesheetService - fetchTimesheets method');

            // first find employeeId from employee collection
            const employee = await EmployeeModel.findOne({ id: query.employeeId });
            if (!employee) throw new CustomError('Employee not found', HTTP_STATUS.NOT_FOUND);
            if (employee.status !== STATUS.ACTIVE) throw new CustomError('Cannot fetch timesheet for inactive employee', HTTP_STATUS.BAD_REQUEST);
            
            query.employeeId = employee._id;
            query.periodStart = new Date(query.periodStart);
            query.periodEnd = new Date(query.periodEnd);
            
            // Fetch timesheets based on query parameters
            const timesheets = await TimesheetModel.find({ ...query });

            return {
                status: true,
                message: TIMESHEET_CONSTANTS.TIMESHEET_FETCHED,
                data: timesheets
            }

        }
        catch (error: any) {
            this.logger.error(`Inside TimesheetService - fetchTimesheets method - Error while fetching timesheet entries: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }   

    /**
     * @method TimesheetService:updateTimesheet
     * @description Service to update an existing timesheet entry in the database after all validations are done.
     * @param timesheetId 
     * @param updateData
     *  */
    async updateTimesheet(timesheetId: string, updateData: any) {
        try {
            this.logger.info('Inside TimesheetService - updateTimesheet method');
            if (!mongoose.Types.ObjectId.isValid(timesheetId)) throw new CustomError('Invalid timesheet ID', HTTP_STATUS.BAD_REQUEST);
            if (!updateData) throw new CustomError('Update data is required', HTTP_STATUS.BAD_REQUEST);

            // Check if the timesheet entry exists
            const existingTimesheet = await TimesheetModel.findById(timesheetId);
            if (!existingTimesheet) throw new CustomError(TIMESHEET_CONSTANTS.TIMESHEET_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

            // If employeeId is being updated, validate the new employeeId
            if (updateData.employeeId) {
                const employeeStatus = await EmployeeModel.findOne({ id: updateData.employeeId });
                if (!employeeStatus) throw new CustomError('Employee not found', HTTP_STATUS.NOT_FOUND);
                if (employeeStatus.status !== STATUS.ACTIVE) throw new CustomError('Cannot assign timesheet to inactive employee', HTTP_STATUS.BAD_REQUEST);
                updateData.employeeId = employeeStatus._id; // Convert to ObjectId
            }

            // If periodStart or periodEnd are being updated, ensure no overlap with existing timesheets for the same employee
            if (updateData.periodStart || updateData.periodEnd) {
                const newPeriodStart = updateData.periodStart ? new Date(updateData.periodStart) : existingTimesheet.periodStart;
                const newPeriodEnd = updateData.periodEnd ? new Date(updateData.periodEnd) : existingTimesheet.periodEnd;

                const overlappingTimesheet = await TimesheetModel.findOne({
                    _id: { $ne: timesheetId }, // Exclude the current timesheet
                    employeeId: updateData.employeeId || existingTimesheet.employeeId,
                    periodStart: { $lt: newPeriodEnd },
                    periodEnd: { $gt: newPeriodStart }
                });

                if (overlappingTimesheet) {
                    throw new CustomError('The updated period overlaps with an existing timesheet for this employee', HTTP_STATUS.CONFLICT);
                }
            }

            // Perform the update
            const updatedTimesheet = await TimesheetModel.findByIdAndUpdate(timesheetId, updateData, { new: true });
            if (!updatedTimesheet) throw new CustomError('Failed to update timesheet entry', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return {
                status: true,
                message: TIMESHEET_CONSTANTS.TIMESHEET_UPDATED,
                data: updatedTimesheet
            }

        }
        catch (error: any) {
            console.log("error", error);
            this.logger.error(`Inside TimesheetService - updateTimesheet method - Error while updating timesheet entry: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    };
}

export default new TimesheetService();