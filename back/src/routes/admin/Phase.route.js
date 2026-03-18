import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import PhaseController from "../../controllers/PhaseController.js";

const Phaserouter = express.Router();

// Phaserouter.get("/phase1",PhaseController.getPhases1Video);
Phaserouter.get("/phase1", (req, res, next) => {  AuthMiddleware(req, res, next, ["ADMIN", "JURY","PRODUCER"]);}, PhaseController.getPhases1Video);
Phaserouter.post("/top50", (req, res, next) => { AuthMiddleware(req, res, next, ["ADMIN"]); }, PhaseController.getTop50);
Phaserouter.put("/prize/:id", (req, res, next) => { AuthMiddleware(req, res, next, ["ADMIN"]); }, PhaseController.assignPrize);
Phaserouter.get("/status", PhaseController.getContestStatus);
Phaserouter.get("/prizes", PhaseController.getAvailablePrizes);
Phaserouter.post("/promote", (req, res, next) => { AuthMiddleware(req, res, next, ["ADMIN"]); }, PhaseController.promoteToNextPhase);
Phaserouter.post("/revert", (req, res, next) => { AuthMiddleware(req, res, next, ["ADMIN"]); }, PhaseController.revertToPreviousPhase);
export default Phaserouter;