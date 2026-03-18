import express from "express";
import UserController from "../controllers/UserController.js";
import UploadController from "../controllers/UploadController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const profileRouter = express.Router();

profileRouter.use((req, res, next) =>
  AuthMiddleware(req, res, next, ["ADMIN", "JURY", "PRODUCER"])
);

profileRouter.get("/me", UserController.getMe);
profileRouter.put("/me", UserController.updateMe);

profileRouter.get("/me/recent", UploadController.getRecentUploads);

export default profileRouter;
