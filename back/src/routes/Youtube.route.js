import express from 'express';
import multer from 'multer';
import { googleAuth, googleAuthCallback, uploadVideoToYoutubeInternal, loadTokens } from '../controllers/YoutubeController.js';
import path from 'path';
import fs from 'fs';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const youtubeRouter = express.Router();
const UploadDir = path.join(process.cwd(), "uploads/videos");
if (!fs.existsSync(UploadDir)) fs.mkdirSync(UploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UploadDir);
  },
  filename: (req, file, cb) => {
    console.log(req);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });
youtubeRouter.get("/auth", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), googleAuth);

youtubeRouter.get("/auth/callback", googleAuthCallback);
youtubeRouter.post("/upload", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), upload.single("video"), uploadVideoToYoutubeInternal);

youtubeRouter.get("/check-auth", async (req, res) => {
  try {
    const tokens = await loadTokens();
    res.json({ connected: !!tokens }); 
  } catch (err) {
    console.error("Erreur check-auth:", err);
    res.status(500).json({ connected: false, error: "Erreur serveur" });
  }
});



export default youtubeRouter;