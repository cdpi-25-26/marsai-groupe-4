import express from "express";
import rateLimit from "express-rate-limit";
import AuthController from "../controllers/AuthController.js";

const authRouter = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many auth attempts, please try again later." }
});

authRouter.post("/login", authLimiter, AuthController.login);

authRouter.post("/register", authLimiter, AuthController.register);

authRouter.post("/checkToken", AuthController.checkToken);

export default authRouter;
