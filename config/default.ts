import { createLogger, format, transports, Logger } from 'winston';
const { combine, timestamp, json, printf, errors } = format;
const myFormat = printf(({ level, message, timestamp, stack }) => { return `${timestamp}  ${level} : ${stack || message}` });

import config from './config';
import jwt from 'jsonwebtoken'

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
            )
        })
    }

    get logger(): Logger {
        return this.loggerInstance
    }

    async generateJwtToken(data: string | object): Promise<string> {
        return jwt.sign(data, this.jwtSecretKey, { expiresIn: '12h' })
    }

}

