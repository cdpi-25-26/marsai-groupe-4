import express from "express";
import UploadController from "../controllers/UploadController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") {
      cb(null, "uploads/videos/");
    } else {
      cb(null, "uploads/images/");
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    const allowed = ["video/mp4", "video/quicktime", "video/webm"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format vidéo non autorisé (MP4, MOV, WebM seulement)"), false);
    }
  } else if (["thumbnail", "image_2", "image_3"].includes(file.fieldname)) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format image non autorisé (jpg, png, webp, gif seulement)"), false);
    }
  } else {
    cb(new Error("Champ non autorisé"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter,
});

const uploadRouter = express.Router();

uploadRouter.use((req, res, next) => {
  AuthMiddleware(req, res, next, ["ADMIN", "JURY", "PRODUCER"]);
});


uploadRouter.get("/", (req, res, next) => {
  AuthMiddleware(req, res, next, ["ADMIN", "JURY"]);
}, UploadController.getUploads);

uploadRouter.get("/:id", (req, res, next) => {
  AuthMiddleware(req, res, next, ["ADMIN", "JURY", "PRODUCER"]);
}, UploadController.getUploadbyId);

uploadRouter.post(
  "/",
  (req, res, next) => AuthMiddleware(req, res, next, ["PRODUCER", "ADMIN"]),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "image_2", maxCount: 1 },
    { name: "image_3", maxCount: 1 },
  ]),
  UploadController.createUpload
);
uploadRouter.put("/:id", (req, res, next) => {
  AuthMiddleware(req, res, next, ["ADMIN", "PRODUCER"]);
}, UploadController.updateUpload);

uploadRouter.delete("/:id", (req, res, next) => {
  AuthMiddleware(req, res, next, ["ADMIN", "PRODUCER"]);
}, UploadController.deleteUpload);

export default uploadRouter; 