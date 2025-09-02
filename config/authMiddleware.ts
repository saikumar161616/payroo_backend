import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from './config';
import HTTP_STATUS from '../constants/http.constants';
import { Default } from './default';

class AuthMiddleware extends Default {
    constructor() {
        super();
    }

    /**
     * @method verifyToken
     * @description Middleware to verify JWT token from the request headers.
     * @param req 
     * @param res 
     * @param next 
     * @returns 
    */
    async verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside AuthMiddleware - verifyToken method');
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Access token is missing or invalid' });
            }

            jwt.verify(token, config.SERVER.JWT_SECRET_KEY, (err, user) => {
                if (err) {
                    this.logger.error(`Inside AuthMiddleware - verifyToken method - Token verification failed: ${err}`);
                    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Invalid token' });
                }
                next();
            });
        } catch (error) {
            this.logger.error(`Inside AuthMiddleware - verifyToken method - Error while verifying token: ${error}`);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error });
        }
    }
}

export default new AuthMiddleware();
