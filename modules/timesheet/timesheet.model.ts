import mongoose, { Schema, model, Document } from 'mongoose';
import joi from 'joi';
import { helperUtil } from '../../utilities/helper.util';

export interface TimesheetEntry {
    date: Date;
    start: string;
    end: string;
    unpaidBreakMins: number;
}

export interface Timesheet extends Document {
    employeeId: any;
    periodStart: Date;
    periodEnd: Date;
    entries: TimesheetEntry[];
    allowances: number;
}

const timeSheetEntrySchema = new Schema<TimesheetEntry>({
    date: {
        type: Date,
        required: true
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true
    },
    unpaidBreakMins: {
        type: Number,
        required: true,
    }
}, { _id: false });

const timesheetSchema = new Schema<Timesheet>({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        required: true,
    },
    periodStart: {
        type: Date,
        required: true
    },
    periodEnd: {
        type: Date,
        required: true
    },
    entries: {
        type: [timeSheetEntrySchema],
        required: true,
    },
    allowances: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Creating compound index to ensure one timesheet per employee per period
timesheetSchema.index({ employeeId: 1, periodStart: 1, periodEnd: 1 }, { unique: true });

export const TimesheetModel = model<Timesheet>('timesheet', timesheetSchema);

export const addtimesheetValidator = joi.object({
    employeeId: joi.string().required(),
    periodStart: joi.date().required(),
    periodEnd: joi.date().required(),
    entries: joi.array().items(
        joi.object({
            date: joi.date().required(),
            start: joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required(), // HH:mm format
            end: joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required(),   // HH:mm format
            unpaidBreakMins: joi.number().min(0).required()
        })
    ).min(1).required(),
    allowances: joi.number().min(0).default(0)
});

export const gettimesheetValidator = joi.object({
    employeeId: joi.string().required(),
    periodStart: joi.string().required(),
    periodEnd: joi.string().required(),
});

export const updatetimesheetValidator = joi.object({
    employeeId: joi.string().required(),
    periodStart: joi.date().required(),
    periodEnd: joi.date().required(),
    entries: joi.array().items(
        joi.object({
            date: joi.date().required(),
            start: joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required(), // HH:mm format
            end: joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required(),   // HH:mm format
            unpaidBreakMins: joi.number().min(0).required()
        })
    ).min(1).required(),
    allowances: joi.number().min(0).default(0).optional()
});


