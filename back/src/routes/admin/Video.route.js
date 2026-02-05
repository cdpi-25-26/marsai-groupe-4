import express from "express";
import VideoController from "../../controllers/VideoController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const videoRouter = express.Router();

videoRouter.get("/", VideoController.getVideos); // Admin

videoRouter.post("/", VideoController.createVideo); // Admin


videoRouter.put("/", (req, res) => {

  // Code à faire
  res.json({message: "test"});
}); // User

export default videoRouter;
