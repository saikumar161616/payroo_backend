import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import HTTP_STATUS from "../../constants/http.constants";

import { PayrunModel } from "./payrun.model";
import { Employee, EmployeeModel } from "../employee/employee.model";
import { TimesheetModel } from "../timesheet/timesheet.model";

import { STATUS, HOURS } from "../../constants/feild.constants";

import { helperUtil } from "../../utilities/helper.util";

import mongoose from "mongoose";
import { stat } from "fs";

class PayrunService extends Default {
    constructor() {
        super();
    }

    /**
     * @method PayrunService:createPayrun
     * @description Create a new payrun for a given period
     * @param payrunData - The payrun data
    */

    async createPayrun(payrunData: { periodStart: Date; periodEnd: Date; employeeIds: string[] }) {
        const session = await PayrunModel.startSession();
        session.startTransaction();
        try {
            this.logger.info('Inside PayrunService - createPayrun method');
            const { periodStart, periodEnd, employeeIds } = payrunData;

            // Find employees( active )
            const employeeQuery: any = { status: STATUS.ACTIVE };
            if (employeeIds && employeeIds.length > 0) {
                employeeQuery._id = { $in: employeeIds.map(id => new mongoose.Types.ObjectId(id)) };
            }

            const employees = await EmployeeModel.find(employeeQuery).lean({ session });
            if (!employees || employees.length === 0) throw new CustomError('No active employees found for the given criteria', HTTP_STATUS.NOT_FOUND);

            // For timesheet for each employee in period
            const payslips = [];
            let total = { gross: 0, tax: 0, super: 0, net: 0 };

            for (const emp of employees) {
                const timesheet = await TimesheetModel.findOne({
                    employeeId: emp._id,
                    periodStart: { $gte: periodStart },
                    periodEnd: { $lte: periodEnd },
                }).lean({ session });

                if (!timesheet) continue; // skip if no timesheet found

                // calculate hours and amounts
                let totalMinutes = 0;
                for (const entry of timesheet.entries) {
                    const [startHour, startMinute] = entry.start.split(':').map(Number);
                    const [endHour, endMinute] = entry.end.split(':').map(Number);

                    const startDate = new Date(entry.date);
                    startDate.setHours(startHour ?? 0, startMinute ?? 0, 0, 0);
                    const endDate = new Date(entry.date);
                    endDate.setHours(endHour ?? 0, endMinute ?? 0, 0, 0);

                    let minutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
                    minutes = minutes - entry.unpaidBreakMins;
                    totalMinutes = totalMinutes + minutes;
                }

                const totalHours = totalMinutes / 60;
                const normalHours = Math.min(totalHours, HOURS.NORMAL_TIME);
                const overtimeHours = Math.max(totalHours - HOURS.NORMAL_TIME, 0);

                // calculatee gross, tax, super, net
                const gross = normalHours * emp.baseHourlyRate + (overtimeHours * emp.baseHourlyRate * 1.5) + timesheet.allowances;

                // calculate tax
                const tax = helperUtil.calculateTax(gross);

                // calculate super
                const superAmount = gross * 0.115; // assuming 11.5% superannuation rate as per document or we can use emp.superRate if available

                const net = gross - tax ;

                // Add to payslips and totals
                payslips.push({
                    employeeId: emp._id,
                    normalHours: Number(normalHours.toFixed(2)),
                    overtimeHours: Number(overtimeHours.toFixed(2)),
                    gross: Number(gross.toFixed(2)),
                    tax: Number(tax.toFixed(2)),
                    super: Number(superAmount.toFixed(2)),
                    net: Number(net.toFixed(2))
                });

                // Update totals
                total.gross += gross;
                total.tax += tax;
                total.super += superAmount;
                total.net += net;
            };

            // Save payrun
            const newPayRun = new PayrunModel({
                periodStart: new Date(periodStart),
                periodEnd: new Date(periodEnd),
                totals: {
                    gross: Number(total.gross.toFixed(2)),
                    tax: Number(total.tax.toFixed(2)),
                    super: Number(total.super.toFixed(2)),
                    net: Number(total.net.toFixed(2))
                },
                payslips
            });

            await newPayRun.save({ session });

            await session.commitTransaction();
            session.endSession();

            return {
                message: 'Payrun created successfully',
                payrun: newPayRun,
                status: true
            }

        }
        catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            this.logger.error(`Inside PayrunService - createPayrun method - Error while creating new payrun: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }


};

export default new PayrunService();