import express from "express";
import EventController from "../../controllers/EventController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const eventRouter = express.Router();

// Admin



eventRouter.get("/", EventController.getEvents); // Liste de tous les utilisateurs

eventRouter.use((req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]));

eventRouter.get("/types", EventController.getTypes); // Must be before /:id to avoid matching "types" as an id
eventRouter.get("/:id", EventController.getEventById); // Récupérer un utilisateur par ID
eventRouter.post("/", EventController.createEvent); // Créer un nouvel utilisateur
eventRouter.delete("/:id", EventController.deleteEvent); // Supprimer un utilisateur par ID
eventRouter.put("/:id", EventController.updateEvent); // Modifier un utilisateur par ID

export default eventRouter;
