import Upload from "../models/Upload.js";
import { videoDuration } from "@numairawan/video-duration";
import fs from "fs/promises";
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

    let durationInfo = {};
    let durationSeconds = 0;
    try {
      durationInfo = await videoDuration(videoFile.path);
      console.log("Durée lue :", durationInfo);
      durationSeconds = durationInfo.seconds || (durationInfo.duration / durationInfo.timeScale) || 0;
    } catch (err) {
      console.error("Erreur lecture durée :", err);
      durationSeconds = 0;
    }

    const MAX_DURATION = 60;

    if (durationSeconds > MAX_DURATION) {
      return res.status(400).json({
        error: `La vidéo est trop longue (${Math.round(durationSeconds)}s). Maximum autorisé : ${MAX_DURATION} secondes.`,
      });
    }

    const formattedDuration = durationSeconds > 0
      ? `${Math.floor(durationSeconds / 60).toString().padStart(2, "0")}:${Math.floor(durationSeconds % 60).toString().padStart(2, "0")}`
      : null; // ou "00:00" si tu préfères

    const {
      title,
      translated_title,
      synopsis,
      language,
      synopsis_en,
      youtube_link,
      subtitles,
      ai_tools,
      thumbnail,
      image_2,
      image_3,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Le titre est obligatoire" });
    }

    const thumbnailFile = req.files?.thumbnail?.[0];
    const image2File = req.files?.image_2?.[0];
    const image3File = req.files?.image_3?.[0];

    const newFilm = await Upload.create({
      title,
      translated_title: translated_title || null,
      duration: formattedDuration,
      synopsis: synopsis || null,
      language: language || null,
      synopsis_en: synopsis_en || null,
      youtube_link: youtube_link || null,
      subtitles: subtitles || null,
      ai_tools: ai_tools || null,
      thumbnail: thumbnailFile ? thumbnailFile.path : null,
      image_2: image2File ? image2File.path : null,
      image_3: image3File ? image3File.path : null,
      status: "submitted",
      user_id: userId,
      video_path: videoFile.path,
    });

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