import Film from "../models/Video.js";
import User from "../models/User.js";
import FilmsJury from "../models/FilmsJury.js";


async function assignFilmToJury(req, res) {
  try {
    const { film_id, user_id } = req.body;

    if (!film_id || !user_id) {
      return res.status(400).json({ error: "film_id and user_id are required" });
    }


    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== "JURY") {
      return res.status(400).json({ error: "User must have JURY role" });
    }

    
    const film = await Film.findByPk(film_id);
    if (!film) {
      return res.status(404).json({ error: "Film not found" });
    }

    
    const existingAssignment = await FilmsJury.findOne({
      where: { film_id, user_id },
    });

    if (existingAssignment) {
      return res.status(400).json({ error: "Film already assigned to this jury member" });
    }

    
    const assignment = await FilmsJury.create({ film_id, user_id });

    res.status(201).json({
      message: "Film assigned to jury member successfully",
      assignment,
    });
  } catch (error) {
    console.error("Error assigning film to jury:", error);
    res.status(500).json({ error: "Failed to assign film to jury member" });
  }
}


async function assignMultipleFilmsToJury(req, res) {
  try {
    const { film_ids, user_id } = req.body;

    if (!film_ids || !Array.isArray(film_ids) || film_ids.length === 0 || !user_id) {
      return res.status(400).json({ error: "film_ids (array) and user_id are required" });
    }

    
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== "JURY") {
      return res.status(400).json({ error: "User must have JURY role" });
    }


    const assignments = await Promise.all(
      film_ids.map(async (film_id) => {
        const existing = await FilmsJury.findOne({ where: { film_id, user_id } });
        if (!existing) {
          return FilmsJury.create({ film_id, user_id });
        }
        return null;
      })
    );

    const createdAssignments = assignments.filter((a) => a !== null);

    res.status(201).json({
      message: `${createdAssignments.length} films assigned to jury member`,
      assignments: createdAssignments,
    });
  } catch (error) {
    console.error("Error assigning multiple films to jury:", error);
    res.status(500).json({ error: "Failed to assign films to jury member" });
  }
}


async function unassignFilmFromJury(req, res) {
  try {
    const { film_id, user_id } = req.params;

    const deleted = await FilmsJury.destroy({
      where: { film_id, user_id },
    });

    if (deleted === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json({ message: "Film unassigned from jury member successfully" });
  } catch (error) {
    console.error("Error unassigning film from jury:", error);
    res.status(500).json({ error: "Failed to unassign film from jury member" });
  }
}


async function getFilmsAssignedToJury(req, res) {
  try {
    const { user_id } = req.params;

    // Verify the user exists and is a jury member
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== "JURY") {
      return res.status(400).json({ error: "User must have JURY role" });
    }

    const userWithFilms = await User.findByPk(user_id, {
      include: [
        {
          model: Film,
          as: "assignedFilms",
          through: { attributes: ["created_at"] },
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "first_name", "last_name", "email"],
            },
          ],
        },
      ],
    });

    res.json({
      jury: {
        id: userWithFilms.id,
        first_name: userWithFilms.first_name,
        last_name: userWithFilms.last_name,
        email: userWithFilms.email,
      },
      assignedFilms: userWithFilms.assignedFilms,
      totalFilms: userWithFilms.assignedFilms.length,
    });
  } catch (error) {
    console.error("Error fetching films for jury:", error);
    res.status(500).json({ error: "Failed to fetch films assigned to jury member" });
  }
}

// Get all jury members assigned to a specific film
async function getJuryAssignedToFilm(req, res) {
  try {
    const { film_id } = req.params;

    const film = await Film.findByPk(film_id, {
      include: [
        {
          model: User,
          as: "juryMembers",
          through: { attributes: ["created_at"] },
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });

    if (!film) {
      return res.status(404).json({ error: "Film not found" });
    }

    res.json({
      film: {
        id: film.id,
        title: film.title,
        translated_title: film.translated_title,
        status: film.status,
      },
      juryMembers: film.juryMembers,
      totalJuryMembers: film.juryMembers.length,
    });
  } catch (error) {
    console.error("Error fetching jury for film:", error);
    res.status(500).json({ error: "Failed to fetch jury members assigned to film" });
  }
}

// Get all jury members (for admin purposes)
async function getAllJuryMembers(req, res) {
  try {
    const juryMembers = await User.findAll({
      where: { role: "JURY" },
      attributes: ["id", "first_name", "last_name", "email", "created_at"],
      order: [["last_name", "ASC"]],
    });

    res.json({
      juryMembers,
      total: juryMembers.length,
    });
  } catch (error) {
    console.error("Error fetching jury members:", error);
    res.status(500).json({ error: "Failed to fetch jury members" });
  }
}

export default {
  assignFilmToJury,
  assignMultipleFilmsToJury,
  unassignFilmFromJury,
  getFilmsAssignedToJury,
  getJuryAssignedToFilm,
  getAllJuryMembers,
};
