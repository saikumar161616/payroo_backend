import mongoose, { Schema, model, Document } from 'mongoose';
import joi from 'joi';

export interface Payslip {
    employeeId: mongoose.Types.ObjectId;
    normalHours: number;
    overtimeHours: number;
    gross: number;
    tax: number;
    super: number;
    net: number;
}

export interface PayrunTotals {
    gross: number;
    tax: number;
    super: number;
    net: number;
}

export interface Payrun extends Document {
    periodStart: Date;
    periodEnd: Date;
    totals: PayrunTotals;
    payslips: Payslip[];
}

const payslipSchema = new Schema<Payslip>({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'employee',
        required: true
    },
    normalHours: {
        type: Number,
        required: true
    },
    overtimeHours: {
        type: Number,
        required: true
    },
    gross: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    super: {
        type: Number,
        required: true
    },
    net: {
        type: Number,
        required: true
    }
}, { _id: false });

const payrunTotalsSchema = new Schema<PayrunTotals>({
    gross: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    super: {
        type: Number,
        required: true
    },
    net: {
        type: Number,
        required: true
    }
}, { _id: false });

const payrunSchema = new Schema<Payrun>({

    id: {
        type: String,
        required: true,
        unique: true,
    },

    periodStart: {
        type: Date,
        required: true
    },
    periodEnd: {
        type: Date,
        required: true
    },
    totals: {
        type: payrunTotalsSchema,
        required: true
    },
    payslips: {
        type: [payslipSchema],
        required: true,
        // validate: [(val: Payslip[]) => val.length > 0, 'There must be at least one payslip']
    }
}, { timestamps: true });

export const PayrunModel = model<Payrun>('payrun', payrunSchema);

export const payrunRequestValidator = joi.object({
    periodStart: joi.date().required(),
    periodEnd: joi.date().required(),
    employeeIds: joi.array().items(joi.string())
});

