import Video from "../models/Video.js";
import User from "../models/User.js";
import { Op } from "sequelize";

async function getStats(req, res) {
  try {
    const videos = await Video.findAll({ where: { youtube_link: { [Op.ne]: null } } });
    const users = await User.findAll();
    const producerCount = await User.count({ where: { role: 'PRODUCER' } });
    const videoCount = await Video.count({ where: { status: 'Submitted' } });

    const stats = {
      totalVideos: videoCount,
      totalUsers: users.length,
      producerCount: producerCount,
      recentVideos: videos.slice(0, 5),
      recentUsers: users.slice(0, 5),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}

export default { getStats };