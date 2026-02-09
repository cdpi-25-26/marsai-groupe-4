import express from "express";
import VideoController from "../../controllers/VideoController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const videoRouter = express.Router();

videoRouter.use((req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]));

videoRouter.get("/", VideoController.getVideos); // Admin
videoRouter.post("/", VideoController.createVideo); // Admin


export default videoRouter;
