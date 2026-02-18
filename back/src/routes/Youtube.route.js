import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { googleAuth, googleAuthCallback, uploadVideoToYoutubeInternal, loadTokens } from "../controllers/YoutubeController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const youtubeRouter = express.Router();

const uploadDir = path.join(process.cwd(), "uploads/videos");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format vidéo non supporté. Utilisez MP4, MOV ou WebM."));
    }
  },
});

// OAuth routes — auth endpoint is public (redirects to Google), callback is called by Google
youtubeRouter.get("/auth", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), googleAuth);
youtubeRouter.get("/auth/callback", googleAuthCallback);
youtubeRouter.post("/upload", upload.single("video"), uploadVideoToYoutubeInternal);

// Protected routes — ADMIN only
youtubeRouter.get("/check-auth", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), async (req, res) => {
  try {
    const tokens = await loadTokens();
    res.json({ connected: !!tokens });
  } catch (err) {
    console.error("Erreur check-auth:", err);
    res.status(500).json({ connected: false, error: "Erreur serveur" });
  }
});

export default youtubeRouter;
