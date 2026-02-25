import express from 'express';
import { getTranslations, updateTranslation } from '../controllers/TraductionController.js';


const traductionRouter = express.Router();

traductionRouter.get('/:lang', getTranslations);
traductionRouter.put('/:lang', updateTranslation);

export default traductionRouter;