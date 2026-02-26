import Film from "../models/Video.js";
import User from "../models/User.js";

async function listFilms(req, res) {

 try {
    const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit ?? "6", 10), 1);
    const offset = (page - 1) * limit;

    const { rows, count } = await Film.findAndCountAll({
      where: { status: "submitted" },
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
          through: { attributes: [] },
          required: false
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
    console.error("Error fetching gallerie films:", error);
    res.status(500).json({ 
      error: "Failed to fetch Gallerie films",
      details: error.message 
    });
  }
}

export default { listFilms };
