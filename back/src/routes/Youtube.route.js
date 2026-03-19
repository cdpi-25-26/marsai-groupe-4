import express from 'express';
import multer from 'multer'; 
import { googleAuth, googleAuthCallback, uploadVideoToYoutubeInternal, loadTokens } from '../controllers/YoutubeController.js';
import path from 'path';
import fs from 'fs';

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
youtubeRouter.get("/auth", googleAuth);

youtubeRouter.get("/auth/callback", googleAuthCallback);
youtubeRouter.post("/upload", upload.single("video"), uploadVideoToYoutubeInternal);

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