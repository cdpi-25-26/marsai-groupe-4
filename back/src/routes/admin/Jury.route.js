import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import OverviewController from "../../controllers/OverviewController.js";

const jurysRouter = express.Router();

jurysRouter.get("/", JurysController.getStats); // Admin


jurysRouter.post("/upload", (req, res) => {
  // Code à faire
  res.send("Upload de vidéo");
}); // User

export default jurysRouter;