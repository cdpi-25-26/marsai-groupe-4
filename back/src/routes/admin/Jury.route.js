import express from "express";
import JuryController from "../../controllers/JuryController.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const juryRouter = express.Router();

// Public/Jury routes - accessible by jury members themselves
juryRouter.get(
  "/my-films",
  (req, res, next) => AuthMiddleware(req, res, next, ["JURY", "ADMIN"]),
  async (req, res) => {
    req.params.user_id = req.user.id;
    return JuryController.getFilmsAssignedToJury(req, res);
  }
);

juryRouter.use((req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]));

juryRouter.get("/members", JuryController.getAllJuryMembers);
juryRouter.get("/:user_id/films", JuryController.getFilmsAssignedToJury);
juryRouter.get("/films/:film_id", JuryController.getJuryAssignedToFilm);
juryRouter.post("/assign", JuryController.assignFilmToJury);
juryRouter.post("/assign-multiple", JuryController.assignMultipleFilmsToJury);
juryRouter.delete("/unassign/:film_id/:user_id", JuryController.unassignFilmFromJury);

export default juryRouter;