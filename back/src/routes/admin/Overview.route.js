import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import OverviewController from "../../controllers/OverviewController.js";

const overviewRouter = express.Router();

overviewRouter.use((req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]));

overviewRouter.get("/", OverviewController.getStats); // Admin


export default overviewRouter;