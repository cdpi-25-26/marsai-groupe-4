import express from "express";
import userRouter from "./admin/User.route.js";
import videoRouter from "./admin/Video.route.js";
import authRouter from "./Auth.route.js";
import uploadRouter from "./Upload.route.js";
import overviewRouter from "./admin/Overview.route.js";
import eventRouter from "./admin/Event.route.js";
import filmRouter from "./Film.route.js";
import youtubeRouter from "./Youtube.route.js";
import traductionRouter from "./traduction.route.js";
import juryRouter from "./admin/Jury.route.js";
import evaluationRouter from "./admin/Evaluation.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/uploads", uploadRouter);
router.use("/overview", overviewRouter);
router.use("/events", eventRouter);
router.use("/films", videoRouter);
router.use("/gallerie", filmRouter);
router.use("/youtube", youtubeRouter);
router.use("/translations", traductionRouter);
router.use("/jury", juryRouter);
router.use("/admin/evaluations", evaluationRouter);

export default router;