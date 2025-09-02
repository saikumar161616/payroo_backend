export const TIMESHEET_STATUS = {
    SUBMITTED: 'SUBMITTED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    DRAFT: 'DRAFT'
};

export const TIMESHEET_CONSTANTS = {
    TIMESHEET_CREATED: 'Timesheet created successfully',
    TIMESHEET_UPDATED: 'Timesheet updated successfully',
    TIMESHEET_DELETED: 'Timesheet deleted successfully',
    TIMESHEET_FETCHED: 'Timesheet(s) fetched successfully',
    TIMESHEET_NOT_FOUND: 'Timesheet not found',
    INVALID_TIMESHEET_STATUS: `Invalid timesheet status. Allowed statuses are ${Object.values(TIMESHEET_STATUS).join(', ')}`
};
export default TIMESHEET_CONSTANTS;