import express from "express";
import HomeController from "../controllers/HomeController.js";

const homeRouter = express.Router();

homeRouter.get("/featured", HomeController.getFeaturedVideos);

homeRouter.get("/stats", HomeController.getStats);

export default homeRouter;
