import Award from "../models/Award.js";
import Film from "../models/Video.js";

export const getAllAwards = async (req, res) => {
  try {
    const awards = await Award.findAll({
      include: [{
        model: Film,               // ← Film = Upload (ton modèle)
        as: 'Film',
        attributes: ['title', 'thumbnail']  // ← on prend les vrais champs
      }],
      order: [['edition_year', 'DESC'], ['id', 'ASC']]
    });

    // Pas besoin de map manuel, Sequelize renvoie déjà la bonne structure
    res.json(awards);
  } catch (error) {
    console.error("Awards error:", error);
    res.status(500).json({ error: "Failed to fetch awards" });
  }
};
