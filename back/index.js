import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import { setupAssociations } from "./src/models/associations.js";

dotenv.config(); // Charger les variables d'environnement depuis le fichier .env

// Setup model associations
setupAssociations();

const app = express(); // Créer une application Express

app.set("trust proxy", 1); // Fly.io / Vercel proxy

app.use(cors({ origin: "*" ,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
})); // Autoriser les requêtes CORS de toutes origines
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000; // Définir le port du serveur

app.use("/", router);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log("-----------------------------");
  console.log("--        L'ARBITRE        --");
  console.log("-----------------------------");

  console.log(`Le serveur est lancé sur http://localhost:${PORT}`);
});
