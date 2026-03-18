import Video from "../models/Video.js";
import User from "../models/User.js";
import { Op } from "sequelize";

async function getStats(req, res) {
  try {
    const currentYear = new Date().getFullYear();
    const videoCount = await Video.count({ where: { status: 'submitted' } });
    const userCount = await User.count();
    const producerCount = await User.count({ where: { role: 'PRODUCER' } });
    const recentVideos = await Video.findAll({ where: { youtube_link: { [Op.ne]: null } }, order: [['created_at', 'DESC']], limit: 5 });
    const recentUsers = await User.findAll({ order: [['created_at', 'DESC']], limit: 5 });

    const stats = {
      totalVideos: videoCount,
      totalUsers: userCount,
      producerCount,
      recentVideos,
      recentUsers,
      date: currentYear,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}

export default { getStats };