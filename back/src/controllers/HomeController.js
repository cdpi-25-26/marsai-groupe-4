import Film from "../models/Video.js";
import User from "../models/User.js";
import { Op } from "sequelize";

Film.belongsTo(User, { foreignKey: "user_id", as: "producer" });

function getFeaturedVideos(req, res) {
  Film.findAll({
    where: { status: { [Op.in]: ["selected", "finalist"] } },
    limit: 6,
    order: [["created_at", "DESC"]],
    include: [
      {
        model: User,
        as: "producer",
        attributes: ["id", "first_name", "last_name"],
      },
    ],
  }).then((films) => {
    res.json(films);
  });
}

function getStats(req, res) {
  Promise.all([
    Film.count(),
    User.count({ where: { role: "PRODUCER" } }),
    Film.count({ where: { status: "selected" } }),
    Film.count({ where: { status: "finalist" } }),
  ]).then(([total_films, total_producers, total_selected, total_finalists]) => {
    res.json({ total_films, total_producers, total_selected, total_finalists });
  });
}

export default { getFeaturedVideos, getStats };
