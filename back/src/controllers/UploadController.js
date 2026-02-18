import Upload from "../models/Upload.js";
import { videoDuration } from "@numairawan/video-duration";
import fs from "fs/promises";
import { uploadVideoToYoutubeInternal,uploadToS3 } from "./YoutubeController.js";
import path from "path";

function getUploads(req, res) {
  Upload.findAll()
    .then((uploads) => res.json(uploads))
    .catch((error) => {
      console.error("Erreur lors de la récupération des uploads :", error);
      res.status(500).json({ error: "Erreur serveur" });
    });
}

function getUploadbyId(req, res) {
  const { id } = req.params;

  Upload.findOne({ where: { id } })
    .then((upload) => {
      if (upload) {
        res.json(upload);
      } else {
        res.status(404).json({ error: "Upload non trouvé" });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de l'upload :", error);
      res.status(500).json({ error: "Erreur serveur" });
    });
}

async function createUpload(req, res) {
  try {

    await fs.mkdir("uploads/subtitles", { recursive: true });
    await fs.mkdir("uploads/images", { recursive: true });
    await fs.mkdir("uploads/videos", { recursive: true });

    const userId = req.user.id;
    const role = req.user.role;

    if (role !== "PRODUCER" && role !== "ADMIN") {
      return res.status(403).json({ error: "Seuls les participants et admins peuvent uploader" });
    }

    const videoFile = req.files?.video?.[0];

    if (!videoFile) {
      return res.status(400).json({ error: "Aucune vidéo envoyée" });
    }

    // === Validation durée ===
    let durationSeconds = 0;
    try {
      const durationInfo = await videoDuration(videoFile.path);
      durationSeconds = durationInfo.seconds || (durationInfo.duration / durationInfo.timeScale) || 0;
    } catch (err) {
      console.error("Erreur lecture durée :", err);

    }

    if (durationSeconds > 60) {
      return res.status(400).json({ error: "La vidéo est trop longue (max 60 secondes)" });
    }

    const formattedDuration = durationSeconds > 0
      ? `${Math.floor(durationSeconds / 60).toString().padStart(2, "0")}:${Math.floor(durationSeconds % 60).toString().padStart(2, "0")}`
      : null;

    const {
      title, translated_title, synopsis, language, synopsis_en, youtube_link, ai_tools
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Le titre est obligatoire" });
    }

    const thumbnailFile = req.files?.thumbnail?.[0];
    const image2File = req.files?.image_2?.[0];
    const image3File = req.files?.image_3?.[0];
    const subtitlesFile = req.files?.subtitles?.[0];

    // === Création du film ===
    const newFilm = await Upload.create({
      title,
      translated_title: translated_title || null,
      duration: formattedDuration,
      synopsis: synopsis || null,
      language: language || null,
      synopsis_en: synopsis_en || null,
      youtube_link: youtube_link || null,
      subtitles: subtitlesFile ? subtitlesFile.path : null,
      ai_tools: ai_tools || null,
      thumbnail: thumbnailFile ? thumbnailFile.path : null,
      image_2: image2File ? image2File.path : null,
      image_3: image3File ? image3File.path : null,
      status: "submitted",
      user_id: userId,
      video_path: videoFile.path,
      youtube_status: "pending",        
    });

    
    // === AUTO UPLOAD SUR YOUTUBE ===
    try {
      console.log(`[AUTO] Début upload YouTube pour le film ${newFilm.id}`);

      const youtubeResult = await uploadVideoToYoutubeInternal(videoFile.path, {
        title: newFilm.title,
        description: newFilm.synopsis || "",
        tags: newFilm.ai_tools ? newFilm.ai_tools.split(',').map(t => t.trim()) : [],
      });

      if (youtubeResult.success) {
        await newFilm.update({
          youtube_video_id: youtubeResult.videoId,
          youtube_status: "uploaded",
        });
        console.log(`[AUTO] Upload YouTube réussi → ID: ${youtubeResult.videoId}`);
      }
    } catch (youtubeError) {
      console.error("[AUTO] Échec upload YouTube :", youtubeError);
      await newFilm.update({ youtube_status: "failed" });
    }

    await newFilm.update({
  video_path: path.basename(videoFile.path),  
});

    try {
      console.log(`[S3] Envoi automatique pour le film ${newFilm.id}`);

      // Vidéo principale
      const s3VideoKey = await uploadToS3(videoFile.path, "videos");

      // Fichiers optionnels
      let s3ThumbnailKey = thumbnailFile ? await uploadToS3(thumbnailFile.path, "thumbnails") : null;
      let s3Image2Key = image2File ? await uploadToS3(image2File.path, "images") : null;
      let s3Image3Key = image3File ? await uploadToS3(image3File.path, "images") : null;
      let s3SubtitlesKey = subtitlesFile ? await uploadToS3(subtitlesFile.path, "subtitles") : null;

      // Optionnel : tu peux stocker les clés S3 quelque part si besoin plus tard
      // ex: newFilm.update({ s3_video_key: s3VideoKey }) mais tu as dit non
      console.log(`[S3] Vidéo envoyée → clé : ${s3VideoKey}`);
    } catch (s3Error) {
      console.error("[S3] Échec envoi Scaleway :", s3Error);
      // Pas bloquant : l'upload local et YouTube restent valides
    }
    
    res.status(201).json({
      message: "Film soumis avec succès",
      duration_seconds: Math.round(durationSeconds),
      film: newFilm,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'upload :", error);
    res.status(500).json({ error: "Erreur serveur lors du traitement" });
  }
}


async function updateUpload(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const film = await Upload.findOne({ where: { id } });
    if (!film) {
      return res.status(404).json({ error: "Film non trouvé" });
    }

    if (film.user_id !== userId && role !== "ADMIN") {
      return res.status(403).json({ error: "Accès refusé pour modifier ce film" });
    }

    const updated = await film.update(req.body);
    res.json({
      message: "Film mis à jour avec succès",
      film: updated,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'upload :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function deleteUpload(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const upload = await Upload.findOne({ where: { id } });
    if (!upload) {
      return res.status(404).json({ error: "Upload non trouvé" });
    }

    if (upload.user_id !== userId && role !== "ADMIN") {
      return res.status(403).json({ error: "Accès refusé pour supprimer cet upload" });
    }

    await upload.destroy();
    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export default {
  getUploads,
  getUploadbyId,
  createUpload,
  updateUpload,
  deleteUpload,
};