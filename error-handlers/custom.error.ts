/**
 * CustomError class extends the built in error class to include HTTP Status Codes
 * This class can be used througout the app to throw errors with consistent structure
 * including both a message and HTTP status code for better error handling and response structure
*/

export class CustomError extends Error {
    statusCode: number;

    constructor(message?: string, statusCode?: number) {
        super(message);

        // Assign the error class name
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
    
        // Capturing  stack trace excluding constructor call from it
        Error.captureStackTrace(this, this.constructor)
    }
}