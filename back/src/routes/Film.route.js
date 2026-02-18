import express from "express";
import FilmController from "../controllers/FilmController.js";

const filmRouter = express.Router();

// GET /films
filmRouter.get("/", FilmController.listFilms);

export default filmRouter;
