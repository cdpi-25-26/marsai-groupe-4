import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import PhaseController from "../../controllers/PhaseController.js";

const Phaserouter = express.Router();

// Phaserouter.get("/phase1",PhaseController.getPhases1Video);
Phaserouter.get("/phase1", (req, res, next) => {  AuthMiddleware(req, res, next, ["ADMIN", "JURY","PRODUCER"]);}, PhaseController.getPhases1Video);
Phaserouter.post("/top50",  PhaseController.getTop50);
Phaserouter.put("/prize/:id", PhaseController.assignPrize);

export default Phaserouter;