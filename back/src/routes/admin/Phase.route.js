import express from "express"
import AuthMiddleware from "../../middlewares/AuthMiddleware"
import PhaseController from "../../controllers/PhaseController.js"

const Phaserouter = express.Router;

contestRouter.get("/phase1", AuthMiddleware(["ADMIN", "JURY", "PRODUCER"]), PhaseController.getPhase1Videos);
contestRouter.get("/top50", AuthMiddleware(["ADMIN", "JURY", "PRODUCER"]), PhaseController.getTop50);
contestRouter.post("/promote-phase2", AuthMiddleware(["ADMIN"]), PhaseController.promoteToPhase2);
contestRouter.put("/prize/:id", AuthMiddleware(["ADMIN"]), PhaseController.assignPrize);