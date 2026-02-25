import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import { configDotenv } from "dotenv";
import { setupAssociations } from "./src/models/associations.js";

configDotenv(); // Charger les variables d'environnement depuis le fichier .env

// Setup model associations
setupAssociations();

const app = express(); // Créer une application Express

app.use(cors({ origin: "*" ,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
})); // Autoriser les requêtes CORS de toutes origines
app.use(express.json());


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
