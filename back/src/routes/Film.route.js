import express from "express";
import FilmController from "../controllers/FilmController.js";

const filmRouter = express.Router();

// GET /gallerie
filmRouter.get("/", FilmController.listFilms);

filmRouter.get("/juryvideo", FilmController.listJuryFilms);
// GET /gallerie/:id
filmRouter.get("/:id", FilmController.getFilmById);

export default filmRouter;
