import UserController from "../controllers/UserController.js";
import UploadController from "../controllers/UploadController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import express from "express";

const profileRouter = express.Router();

profileRouter.get("/:id", UserController.getUserById);

profileRouter.put("/:id", UserController.updateUser);

profileRouter.get("/:id/recent", 
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN", "JURY", "PRODUCER"]),
  UploadController.getRecentUploads
);

export default profileRouter;