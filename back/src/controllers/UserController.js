import User from "../models/User.js";
import Evaluation from "../models/Evaluation.js";
import { hashPassword } from "../utils/password.js";

// Liste
function getUsers(req, res) {
  User.findAll({ attributes: { exclude: ['password'] } }).then((users) => {
    res.json(users);
  });
}

// Création
async function createUser(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hash = await hashPassword(password);
    const newUser = await User.create({ first_name, last_name, email, password: hash, role: role || "PRODUCER" });
    const { password: _, ...safeUser } = newUser.dataValues;
    res.status(201).json({ message: "Utilisateur créé", newUser: safeUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}

// Suppression
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await Evaluation.destroy({ where: { user_id: id } });
    await User.destroy({ where: { id } });
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}

// Modification
async function updateUser(req, res) {
  const { id } = req.params;
  const { first_name, last_name, email, password, role } = req.body;

  try {
    const user = await User.findOne({ where: { id } });
    
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    // Hash password only if it's being updated
    if (password) {
      user.password = await hashPassword(password);
    }

    const updatedUser = await user.save();
    const { password: _, ...safeUser } = updatedUser.dataValues;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
}

// Récupérer un utilisateur par ID
function getUserById(req, res) {
  const { id } = req.params;
  User.findOne({ where: { id } }).then((user) => {
    if (user) {
      const { password, ...safeUser } = user.dataValues;
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  });
}

function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

// Get available roles
function getRoles(req, res) {
  res.json({
    roles: ["ADMIN", "JURY", "PRODUCER"]
  });
}


// Get current authenticated user profile
function getMe(req, res) {
  const { password, ...safeUser } = req.user.dataValues;
  res.json(safeUser);
}

// Update current authenticated user profile
async function updateMe(req, res) {
  try {
    const user = req.user;
    const allowedFields = [
      "first_name", "last_name", "phone", "mobile", "birth_date",
      "biography", "current_job", "portfolio_url", "youtube_url",
      "instagram_url", "linkedin_url", "facebook_url", "tiktok_url",
      "street", "postal_code", "city", "country", "discovery_source",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password) {
      user.password = await hashPassword(req.body.password);
    }

    const updatedUser = await user.save();
    const { password: _, ...safeUser } = updatedUser.dataValues;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile", details: error.message });
  }
}

export default {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  findUserByEmail,
  getRoles,
  getMe,
  updateMe,
};
