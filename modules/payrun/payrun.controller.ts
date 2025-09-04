import { Request, Response } from "express";
import HTTP_STATUS from "../../constants/http.constants";
import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import PayrunService from "./payrun.service";


class PayrunController extends Default {
    constructor() {
        super();
    }

    /**
     * @method PayrunController:createPayrunController
     * @description Controller to handle adding a new payrun.
     * @param req
     * @param res
     * @returns
    */
    async createPayrunController(req: Request, res: Response) {
        try {
            this.logger.info('Inside PayrunController - createPayrunController method');
            const response = await PayrunService.createPayrun(req.body);
            if (!response) throw new CustomError('Failed to create employee', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.CREATED).json({
                status: true,
                message: response.message,
                data: response.data
            });
        } catch (error) {
            this.logger.error(`Inside PayrunController - createPayrunController method - Error while creating payrun: ${error}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message || error,
                    status: false
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error
            });
        }
    }

    /**
     * @method PayrunController:getPayrunsController
     * @description Controller to fetch all payruns.
     * @param req
     * @param res
     * @returns
    */
    async getPayrunsController(req: Request, res: Response) {
        try {
            const response = await PayrunService.getPayruns();
            if (!response) throw new CustomError('Failed to fetch payruns', HTTP_STATUS.INTERNAL_SERVER_ERROR);
            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error) {
            this.logger.error(`Inside PayrunController - getPayrunsController method - Error while fetching payruns: ${error}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message || error,
                    status: false
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error
            });
        }
    };
}
export default new PayrunController();