import timesheetService from "../modules/timesheet/timesheet.service";
import { TimesheetModel } from "../modules/timesheet/timesheet.model";
import { EmployeeModel } from "../modules/employee/employee.model";
import HTTP_STATUS from "../constants/http.constants";
import { CustomError } from "../error-handlers/custom.error";
import TIMESHEET_CONSTANTS from "../modules/timesheet/timesheet.constants";

// Mock dependencies
jest.mock("../modules/timesheet/timesheet.model");
jest.mock("../modules/employee/employee.model");

describe("TimesheetService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createNewTimesheet", () => {
        it("should throw error if timesheet data is not provided", async () => {
            await expect(timesheetService.createNewTimesheet(undefined)).rejects.toThrow(
                new CustomError("Timesheet data is required", HTTP_STATUS.BAD_REQUEST)
            );
        });

        it("should throw error if employee is not found", async () => {
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null);
            await expect(
                timesheetService.createNewTimesheet({ employeeId: "emp1" })
            ).rejects.toThrow(new CustomError("Employee not found", HTTP_STATUS.NOT_FOUND));
        });

        it("should throw error if employee is inactive", async () => {
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ status: "INACTIVE" });
            await expect(
                timesheetService.createNewTimesheet({ employeeId: "emp1" })
            ).rejects.toThrow(
                new CustomError("Cannot add timesheet for inactive employee", HTTP_STATUS.BAD_REQUEST)
            );
        });

        it("should throw error if timesheet already exists", async () => {
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ status: "ACTIVE", _id: "objid" });
            (TimesheetModel.findOne as jest.Mock).mockResolvedValue({ _id: "tsid" });
            await expect(
                timesheetService.createNewTimesheet({
                    employeeId: "emp1",
                    periodStart: new Date(),
                    periodEnd: new Date(),
                })
            ).rejects.toThrow(
                new CustomError("A timesheet for this employee and period already exists", HTTP_STATUS.CONFLICT)
            );
        });

        it("should create and return a new timesheet successfully", async () => {
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ status: "ACTIVE", _id: "objid" });
            (TimesheetModel.findOne as jest.Mock).mockResolvedValue(null);
            const mockSave = jest.fn().mockResolvedValue({ _id: "tsid", employeeId: "objid" });
            (TimesheetModel as any).mockImplementation(() => ({ save: mockSave }));

            const result = await timesheetService.createNewTimesheet({
                employeeId: "emp1",
                periodStart: new Date(),
                periodEnd: new Date(),
                entries: [{ date: new Date(), start: "09:00", end: "17:00", unpaidBreakMins: 30 }],
                allowances: 0,
            });

            expect(result.status).toBe(true);
            expect(result.message).toBe(TIMESHEET_CONSTANTS.TIMESHEET_CREATED);
            expect(result.data).toHaveProperty("_id", "tsid");
            expect(mockSave).toHaveBeenCalled();
        });
    });

    describe("fetchTimesheets", () => {
        it("should throw error if employee is not found", async () => {
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null);
            await expect(
                timesheetService.fetchTimesheets({ employeeId: "emp1" })
            ).rejects.toThrow(new CustomError("Employee not found", HTTP_STATUS.NOT_FOUND));
        });

        it("should throw error if employee is inactive", async () => {
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ status: "INACTIVE" });
            await expect(
                timesheetService.fetchTimesheets({ employeeId: "emp1" })
            ).rejects.toThrow(
                new CustomError("Cannot fetch timesheet for inactive employee", HTTP_STATUS.BAD_REQUEST)
            );
        });

        it("should fetch timesheets successfully", async () => {
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ status: "ACTIVE", _id: "objid" });
            (TimesheetModel.find as jest.Mock).mockResolvedValue([{ _id: "tsid" }]);
            const result = await timesheetService.fetchTimesheets({
                employeeId: "emp1",
                periodStart: new Date().toISOString(),
                periodEnd: new Date().toISOString(),
            });
            expect(result.status).toBe(true);
            expect(result.message).toBe(TIMESHEET_CONSTANTS.TIMESHEET_FETCHED);
            expect(Array.isArray(result.data)).toBe(true);
        });
    });

    describe("updateTimesheet", () => {
        it("should throw error if timesheetId is invalid", async () => {
            await expect(timesheetService.updateTimesheet("badid", {})).rejects.toThrow(
                new CustomError("Invalid timesheet ID", HTTP_STATUS.BAD_REQUEST)
            );
        });

        it("should throw error if update data is not provided", async () => {
            await expect(timesheetService.updateTimesheet("507f1f77bcf86cd799439011", undefined)).rejects.toThrow(
                new CustomError("Update data is required", HTTP_STATUS.BAD_REQUEST)
            );
        });

        it("should throw error if timesheet does not exist", async () => {
            (TimesheetModel.findById as jest.Mock).mockResolvedValue(null);
            await expect(
                timesheetService.updateTimesheet("507f1f77bcf86cd799439011", { employeeId: "emp1" })
            ).rejects.toThrow(
                new CustomError(TIMESHEET_CONSTANTS.TIMESHEET_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
            );
        });

        it("should throw error if assigning to non-existent employee", async () => {
            (TimesheetModel.findById as jest.Mock).mockResolvedValue({ employeeId: "objid", periodStart: new Date(), periodEnd: new Date() });
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null);
            await expect(
                timesheetService.updateTimesheet("507f1f77bcf86cd799439011", { employeeId: "emp2" })
            ).rejects.toThrow(new CustomError("Employee not found", HTTP_STATUS.NOT_FOUND));
        });

        it("should throw error if assigning to inactive employee", async () => {
            (TimesheetModel.findById as jest.Mock).mockResolvedValue({ employeeId: "objid", periodStart: new Date(), periodEnd: new Date() });
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ status: "INACTIVE" });
            await expect(
                timesheetService.updateTimesheet("507f1f77bcf86cd799439011", { employeeId: "emp2" })
            ).rejects.toThrow(
                new CustomError("Cannot assign timesheet to inactive employee", HTTP_STATUS.BAD_REQUEST)
            );
        });

        it("should throw error if period overlaps with another timesheet", async () => {
            (TimesheetModel.findById as jest.Mock).mockResolvedValue({
                employeeId: "objid",
                periodStart: new Date("2024-01-01"),
                periodEnd: new Date("2024-01-07"),
            });
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ status: "ACTIVE", _id: "objid" });
            (TimesheetModel.findOne as jest.Mock).mockResolvedValue({ _id: "otherid" });
            await expect(
                timesheetService.updateTimesheet("507f1f77bcf86cd799439011", {
                    employeeId: "emp2",
                    periodStart: "2024-01-02",
                    periodEnd: "2024-01-08",
                })
            ).rejects.toThrow(
                new CustomError("The updated period overlaps with an existing timesheet for this employee", HTTP_STATUS.CONFLICT)
            );
        });

        it("should update and return the timesheet successfully", async () => {
            (TimesheetModel.findById as jest.Mock).mockResolvedValue({
                employeeId: "objid",
                periodStart: new Date("2024-01-01"),
                periodEnd: new Date("2024-01-07"),
            });
            (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ status: "ACTIVE", _id: "objid" });
            (TimesheetModel.findOne as jest.Mock).mockResolvedValue(null);
            (TimesheetModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
                _id: "tsid",
                employeeId: "objid",
            });

            const result = await timesheetService.updateTimesheet("507f1f77bcf86cd799439011", {
                employeeId: "emp2",
                periodStart: "2024-01-02",
                periodEnd: "2024-01-08",
            });

            expect(result.status).toBe(true);
            expect(result.message).toBe(TIMESHEET_CONSTANTS.TIMESHEET_UPDATED);
            expect(result.data).toHaveProperty("_id", "tsid");
        });
    });
});