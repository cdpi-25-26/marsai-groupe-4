import Film from "../models/Video.js";
import User from "../models/User.js";

async function listFilms(req, res) {

 try {
    const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit ?? "6", 10), 1);
    const offset = (page - 1) * limit;

    const { rows, count } = await Film.findAndCountAll({
      where: { status: "selected" },
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
    res.status(500).json({ error: "Failed to fetch Gallerie films" });
  }
}

export default { listFilms };
