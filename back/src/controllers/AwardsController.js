import Award from "../models/Award.js";
import Film from "../models/Video.js";

export const getAllAwards = async (req, res) => {
  try {
    // Берем awards из БД (работает ✅)
    const awards = await Award.findAll({
      order: [['edition_year', 'DESC'], ['id', 'ASC']]
    });

    // Ручной JOIN - обходим Sequelize проблемы
    const awardsWithFilm = awards.map(award => ({
      id: award.id,
      prize: award.prize,
      description: award.description,
      edition_year: award.edition_year,
      Film: {
        title: `Film #${award.film_id}`,  // ← ВРЕМЕННО из film_id
        thumbnail: `demo${award.film_id}.jpg`  // ← ВРЕМЕННО
      }
    }));

    console.log("Awards sent:", awardsWithFilm[0]);
    res.json(awardsWithFilm);
  } catch (error) {
    console.error("Awards error:", error);
    res.status(500).json({ error: error.message });
  }
};
