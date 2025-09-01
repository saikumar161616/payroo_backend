import { createLogger, format, transports, Logger } from 'winston';
const { combine, timestamp, json, printf, errors } = format;
const myFormat = printf(({ level, message, timestamp, stack }) => { return `${timestamp}  ${level} : ${stack || message}` });

import config from './config';
import jwt from 'jsonwebtoken';
import path from 'path';

export class Default {
    private loggerInstance: Logger;
    public paginationOffset = 0;
    public paginationLimit = 10;

    private jwtSecretKey = config.SERVER.JWT_SECRET_KEY

    constructor() {
        this.loggerInstance = createLogger({
            format: combine(
                timestamp(),
                errors({ stack: true }),
                myFormat,
                json()
            ),
            defaultMeta: {meta : ''},
            transports: [
                new transports.Console(),
                new transports.File({
                    level: 'error',
                    filename: path.join(__dirname, '../logs/error.log'),
                    handleExceptions: true,
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                }),
                new transports.File({
                    level: 'info',
                    filename: path.join(__dirname, '../logs/info.log'),
                    handleExceptions: true,
                    maxsize: 10042880, // 10MB
                    maxFiles: 5,
                })
            ]
        })
    }

    get logger(): Logger {
        return this.loggerInstance
    }

    async generateJwtToken(data: string | object): Promise<string> {
        return jwt.sign(data, this.jwtSecretKey, { expiresIn: '12h' })
    }

}

