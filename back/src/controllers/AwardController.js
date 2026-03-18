import Award from "../models/Award.js";
import Film from "../models/Video.js";
import User from "../models/User.js";
import EmailController from "./EmailController.js";

async function listAwards(req, res) {
  try {
    const awards = await Award.findAll({
      include: [
        {
          model: Film,
          as: "film",
          attributes: ["id", "title", "translated_title", "thumbnail", "youtube_link"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "first_name", "last_name"],
            },
          ],
        },
      ],
      order: [["edition_year", "DESC"], ["id", "ASC"]],
    });
    res.json(awards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch awards", details: error.message });
  }
}

async function getAwardById(req, res) {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id, {
      include: [
        {
          model: Film,
          as: "film",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "first_name", "last_name"],
            },
          ],
        },
      ],
    });

    if (!award) {
      return res.status(404).json({ error: "Award not found" });
    }

    res.json(award);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch award", details: error.message });
  }
}

async function createAward(req, res) {
  try {
    const { name, edition_year, prize, description, film_id } = req.body;

    if (!name || !edition_year || !prize || !film_id) {
      return res.status(400).json({ error: "name, edition_year, prize, film_id are required" });
    }

    const award = await Award.create({ name, edition_year, prize, description, film_id });

    // Notify the film's producer by email
    try {
      const film = await Film.findByPk(film_id, {
        include: [{ model: User, as: "user", attributes: ["email", "first_name"] }],
      });
      if (film?.user?.email) {
        await EmailController.sendMail(
          film.user.email,
          `🏆 Félicitations — Votre film "${film.title}" a reçu un prix !`,
          `<h2>Félicitations ${film.user.first_name} !</h2>
           <p>Votre film <strong>${film.title}</strong> a été récompensé au festival MarsAI.</p>
           <p><strong>Prix :</strong> ${prize}<br/>
           <strong>Nom de la récompense :</strong> ${name}<br/>
           ${description ? `<strong>Description :</strong> ${description}` : ""}</p>
           <p>Merci pour votre participation. À bientôt sur MarsAI !</p>`
        );
      }
    } catch (_) { /* email failure must not block the response */ }

    res.status(201).json(award);
  } catch (error) {
    res.status(500).json({ error: "Failed to create award", details: error.message });
  }
}

async function updateAward(req, res) {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id);

    if (!award) {
      return res.status(404).json({ error: "Award not found" });
    }

    await award.update(req.body);
    res.json(award);
  } catch (error) {
    res.status(500).json({ error: "Failed to update award", details: error.message });
  }
}

async function deleteAward(req, res) {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id);

    if (!award) {
      return res.status(404).json({ error: "Award not found" });
    }

    await award.destroy();
    res.status(200).json({ message: "Award deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete award", details: error.message });
  }
}

export default { listAwards, getAwardById, createAward, updateAward, deleteAward };
