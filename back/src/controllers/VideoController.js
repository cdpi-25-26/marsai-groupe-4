import { Op } from "sequelize";
import Video from "../models/Video.js";
import User from "../models/User.js";

// Liste
async function getVideos(req, res) {

 try {
    const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit ?? "6", 10), 1);
    const offset = (page - 1) * limit;

    const { rows, count } = await Video.findAndCountAll({
      where: { youtube_link: { [Op.ne]: null } },
      include: [{
        model: User,
        as: "user",
        attributes: ["id", "first_name", "last_name", "email"],
      }],
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

export default { getVideos, createVideo };