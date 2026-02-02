import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/emailService.js";

function login(req, res) {
  const { email, password } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    comparePassword(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });

      return res.status(200).json({
        message: "Login successful",
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        token,
      });
    });
  });
}

async function register(req, res) {
  try {
    const { first_name, last_name, email, password, rgpd_accepted } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    if (!rgpd_accepted) {
      return res.status(400).json({ error: "Vous devez accepter les conditions RGPD" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hash = await hashPassword(password);
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hash,
      role: "PRODUCER",
    });

    const { password: _, ...safeUser } = user.dataValues;

    sendRegistrationEmail(user).catch((err) =>
      console.error("Erreur envoi email inscription :", err)
    );

    res.status(201).json({ message: "Inscription réussie", user: safeUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default { login, register };
