import express from "express";
import userRouter from "./admin/User.route.js";
import videoRouter from "./admin/Video.route.js";
import authRouter from "./Auth.route.js";
import homeRouter from "./Home.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/home", homeRouter);
router.use("/users", userRouter);
router.use("/videos", videoRouter);

export default router;
