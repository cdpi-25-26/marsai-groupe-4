import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import jwt from "jsonwebtoken";
import sendMail from "../services/mailer.js";

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      email: user.email,
      first_name: user.first_name,
      role: user.role,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

async function register(req, res) {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    const hash = await hashPassword(password);
    const newUser = await User.create({ first_name, last_name, email, password: hash, role: role || "PRODUCER" });
    const { password: _, ...safeUser } = newUser.dataValues;

    sendMail(email, "Welcome to MarsAI!",
      `<p>Hi ${first_name},</p><p>Your account has been created successfully. Welcome to the MarsAI platform!</p><p>— The MarsAI Team</p>`);

    res.status(201).json({ message: "Utilisateur créé", newUser: safeUser });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

function checkToken(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by email from decoded token
    User.findOne({ where: { email: decoded.email } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        return res.status(200).json({
          email: user.email,
          first_name: user.first_name,
          role: user.role,
        });
      })
      .catch((error) => {
        return res.status(500).json({ error: "Database error" });
      });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email requis" });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      sendMail(
        email,
        "Réinitialisation de mot de passe — MARS.AI",
        `<p>Bonjour ${user.first_name},</p>
         <p>Vous avez demandé une réinitialisation de mot de passe.</p>
         <p>Veuillez contacter l'administrateur du festival pour obtenir un nouveau mot de passe.</p>
         <p>— L'équipe MARS.AI</p>`
      );
    }
    // Always return success to not reveal if email exists
    return res.status(200).json({ message: "Si cet email existe, un message a été envoyé." });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

export default { login, register, checkToken, forgotPassword };
