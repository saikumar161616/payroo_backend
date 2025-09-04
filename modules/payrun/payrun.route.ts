import { Request, Response, NextFunction, Router } from "express";
import PayrunMiddleware from "./payrun.middleware";
import AuthMiddleware from "../../config/authMiddleware";
import PayrunController from "./payrun.controller";

const router = Router();


/**
 * @route /payruns
 * @description Route to handle payrun-related operations.
*/

router.post('/run',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => PayrunMiddleware.prepareCreatePayrun(req, res, next),
    (req: Request, res: Response) => PayrunController.createPayrunController(req, res)
);

router.get('/',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response) => PayrunController.getPayrunsController(req, res)
);


export default router;

