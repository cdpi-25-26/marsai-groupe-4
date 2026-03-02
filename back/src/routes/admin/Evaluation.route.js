import express from "express";
import EvaluationController from "../../controllers/EvaluationController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const evaluationRouter = express.Router();

evaluationRouter.use((req, res, next) => AuthMiddleware(req, res, next, ["ADMIN", "JURY"]));

// TODO: Define routes

export default evaluationRouter;

