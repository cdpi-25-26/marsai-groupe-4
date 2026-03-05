import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import PhaseController from "../../controllers/PhaseController.js";

const Phaserouter = express.Router();

Phaserouter.get("/phase1",PhaseController.getPhases1Video);
Phaserouter.get("/top50",  PhaseController.getTop50);
Phaserouter.put("/prize/:id", PhaseController.assignPrize);

export default Phaserouter;