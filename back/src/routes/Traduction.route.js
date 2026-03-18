import express from 'express';
import { getTranslations, updateTranslation, updateBulkTranslations } from '../controllers/TraductionController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const traductionRouter = express.Router();

traductionRouter.get('/:lang', getTranslations);
traductionRouter.put('/:lang/bulk', (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), updateBulkTranslations);
traductionRouter.put('/:lang', (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), updateTranslation);

export default traductionRouter;