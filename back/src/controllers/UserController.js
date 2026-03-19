import User from "../models/User.js";
import Evaluation from "../models/Evaluation.js";
import { hashPassword } from "../utils/password.js";

// Liste
function getUsers(req, res) {
  User.findAll().then((users) => {
    res.json(users);
  });
}

// Création
function createUser(req, res) {
  console.log(req);

  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { first_name, last_name, email, password, role } = req.body;

if (!first_name || !last_name || !email || !password ) {
  return res.status(400).json({ error: "Tous les champs sont requis" });
}

// Vérifie si email déjà utilisé
User.findOne({ where: { email } }).then(async (existingEmail) => {
  if (existingEmail) {
    return res.status(400).json({ error: "Email déjà utilisé" });
  }

  const hash = await hashPassword(password);
  User.create({ first_name, last_name, email, password: hash, role: role || "PRODUCER" })
      .then((newUser) => {
        const { password, ...safeUser } = newUser.dataValues;
        res.status(201).json({ message: "Utilisateur créé", newUser: safeUser });
      });
});
}

// Suppression
async function deleteUser(req, res) {
  const { id } = req.params;
  await Evaluation.destroy({ where: { user_id: id } });
  User.destroy({ where: { id } }).then(() => {
    res.status(204).json({ message: "Utilisateur supprimé" });
  });
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
      res.json(user);
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


export default {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  findUserByEmail,
  getRoles,
};
