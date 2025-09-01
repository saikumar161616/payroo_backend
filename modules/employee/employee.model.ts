import { Schema, model, Document } from 'mongoose';
import joi from 'joi';
import { helperUtil } from '../../utilities/helper.util';

export interface BankDetails {
    bsb: string;
    account: string;
};

export interface Employee extends Document {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: 'HOURLY';
    baseHourlyRate: number;
    superRate: number;
    bank: BankDetails;
    status: 'ACTIVE' | 'INACTIVE';
};

const BankDetailsSchema = new Schema<BankDetails>({
    bsb: {
        type: String,
        required: true,
        match: [/^\d{3}-\d{3}$/, 'BSB must be in the format 083-123']
    },
    account: {
        type: String,
        required: true,
        match: [/^\d{6,12}$/, 'Account must be 6 to 12 digits']
    }
}, { _id: false });

const employeeSchema = new Schema<Employee>({
    id: {
        type: String,
        required: true,
        unique: true,
        default: helperUtil.generateUniqueId()
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    type: {
        type: String,
        required: true,
        enum: ['HOURLY']
    },
    baseHourlyRate: {
        type: Number,
        required: true
    },
    superRate: {
        type: Number,
        required: true
    },
    bank: {
        type: BankDetailsSchema,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
        // This feild is helpful to easily enable, disable or soft-delete employees
        // without removing their data from the database. It allows filtering for only
        // active employees in queries and helps with audit trails and data integrity.
    }
}, { timestamps: true });

employeeSchema.index({ email: 1 });
employeeSchema.index({ id: 1 });

export const EmployeeModel = model<Employee>('employee', employeeSchema);

export const addEmployeeSchemaValidator = joi.object({
    firstName: joi.string().min(2).max(50).required(),
    lastName: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    type: joi.string().valid('HOURLY').required(),
    baseHourlyRate: joi.number().required().min(0),
    superRate: joi.number().min(0).required(),
    bank: joi.object({
        bsb: joi.string().pattern(/^\d{3}-\d{3}$/).required(), // e.g., 083-123
        account: joi.string().pattern(/^\d{6,12}$/).required() // 6 to 12 digits eg: 12345678
    }).required(),
    status: joi.string().valid('ACTIVE', 'INACTIVE').optional()
});

export const updateEmployeeSchemaValidator = joi.object({
    firstName: joi.string().min(2).max(50).optional(),
    lastName: joi.string().min(2).max(50).optional(),
    email: joi.string().email().optional(),
    type: joi.string().valid('HOURLY').optional(),
    baseHourlyRate: joi.number().min(0).optional(),
    superRate: joi.number().min(0).optional(),
    bank: joi.object({
        bsb: joi.string().pattern(/^\d{3}-\d{3}$/).required(),
        account: joi.string().pattern(/^\d{6,12}$/).required()
    }).optional(),
    status: joi.string().valid('ACTIVE', 'INACTIVE').optional()
});

export const employeeIdValidator = joi.object({
    id: joi.string().pattern(/^EMP\-[A-Z0-9]{7}$/).required()
});