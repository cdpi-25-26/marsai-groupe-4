import express from "express";
import EvaluationController from "../../controllers/EvaluationController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const evaluationRouter = express.Router();

evaluationRouter.use((req, res, next) => AuthMiddleware(req, res, next, ["ADMIN", "JURY"]));

evaluationRouter.get("/", EvaluationController.getEvaluations);
evaluationRouter.get("/films", EvaluationController.getFilmsToEvaluate);
evaluationRouter.get("/film/:filmId", EvaluationController.getEvaluationsByFilm);
evaluationRouter.post("/", EvaluationController.createEvaluation);
evaluationRouter.post("/undo", EvaluationController.undoLastEvaluation);
evaluationRouter.get("/stats/:filmId", EvaluationController.getFilmStats);
evaluationRouter.put("/:id", EvaluationController.updateEvaluation);
evaluationRouter.delete("/:id", EvaluationController.deleteEvaluation);

export default evaluationRouter;
