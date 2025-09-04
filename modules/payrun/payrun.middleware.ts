import { Request, Response, NextFunction } from "express";
import { payrunRequestValidator } from "./payrun.model";
import { Default } from "../../config/default";
import HTTP_STATUS from "../../constants/http.constants";

class PayrunMiddleware extends Default {
    constructor() {
        super();
    }

    /**
     * @method PayrunMiddleware:prepareCreatePayrun
     * @description Middleware to validate and prepare the request body for creating a new payrun.
     * @param req 
     * @param res   
     * @param next
     * @returns
    **/

    async prepareCreatePayrun(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside PayrunMiddleware - prepareCreatePayrun method');
            const inputValidation = await payrunRequestValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        }
        catch (error) {
            this.logger.error(`Inside PayrunMiddleware - prepareCreatePayrun method - Error while validating create payrun request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }


    /**
     * @method PayrunMiddleware:prepareGetPayruns
     * @description Middleware to validate and prepare the request query for fetching payruns.
     * @param req
     * @param res
     * @param next
     * @return
    **/
    

};

export default new PayrunMiddleware();