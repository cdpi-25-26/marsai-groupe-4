import { Op } from "sequelize";
import Video from "../models/Video.js";
import User from "../models/User.js";
import sequelize from "../db/connection.js";

// Liste
async function getVideos(req, res) {

 try {
    const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit ?? "6", 10), 1);
    const offset = (page - 1) * limit;

    const { rows, count } = await Video.findAndCountAll({
      where: { youtube_link: { [Op.ne]: null } },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: User,
          as: "juryMembers",
          attributes: ["id", "first_name", "last_name", "email"],
          through: { attributes: [] }
        }
      ],
      limit,
      offset,
      order: [["id"]],
    });

    const totalPages = Math.max(Math.ceil(count / limit), 1);

    res.json({
      showVideos: rows,
      totalVideos: count,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}


// Création
function createVideo(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Video.findOne({ where: { title } }).then((video) => {
    if (video) {
      res.json(video);
    } else {
      Video.create({ title: title, description: description }).then(
        (newVideo) => {
          res.status(201).json(newVideo);
        },
      );
    }
  });
}

async function updateVideo(req, res) {
  const { id } = req.params;
  const updateData = {};

  // Only include fields that are provided
  const allowedFields = ['title', 'translated_title', 'synopsis', 'synopsis_en', 'status', 'ai_tools', 'language', 'duration', 'youtube_link'];
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  try {
    const video = await Video.findByPk(id);
    
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    await video.update(updateData);

    // Fetch updated video with associations
    const updatedVideo = await Video.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: User,
          as: "juryMembers",
          attributes: ["id", "first_name", "last_name", "email"],
          through: { attributes: [] }
        }
      ]
    });

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update video",
      details: error.message
    });
  }
}

async function deleteVideo(req, res) {
  const { id } = req.params;

  try {
    await sequelize.transaction(async (t) => {
      
      await sequelize.query(
        'DELETE FROM evaluations WHERE film_id = ?',
        { replacements: [id], transaction: t}
      );

      await sequelize.query(
        'DELETE FROM awards WHERE film_id = ?',
        { replacements: [id], transaction: t}
      );

      
      await Video.destroy({ where: { id }, transaction: t });
    });

    res.status(204).json({ message: "Video supprimé" });
  } catch (error) {
    res.status(500).json({
      error: "Impossible de supprimer le video",
      details: error.message
    });
  }
}

export default { getVideos, createVideo, updateVideo, deleteVideo };