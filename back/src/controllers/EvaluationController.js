import { Op } from "sequelize";
import Evaluation from "../models/Evaluation.js";
import User from "../models/User.js";
import Film from "../models/Video.js";

async function getEvaluations(req, res) {
  // TODO: Implement
  res.status(501).json({ error: "Not implemented" });
}

async function getEvaluationsByFilm(req, res) {
  // TODO: Implement
  res.status(501).json({ error: "Not implemented" });
}

async function createEvaluation(req, res) {
  // TODO: Implement
  res.status(501).json({ error: "Not implemented" });
}

async function updateEvaluation(req, res) {
  // TODO: Implement
  res.status(501).json({ error: "Not implemented" });
}

async function deleteEvaluation(req, res) {
  // TODO: Implement
  res.status(501).json({ error: "Not implemented" });
}

async function getFilmsToEvaluate(req, res) {
  // TODO: Implement
  res.status(501).json({ error: "Not implemented" });
}

async function undoLastEvaluation(req, res) {
  // TODO: Implement
  res.status(501).json({ error: "Not implemented" });
}

async function getFilmStats(req, res) {
  // TODO: Implement
  res.status(501).json({ error: "Not implemented" });
}

export default { getEvaluations, getEvaluationsByFilm, getFilmsToEvaluate, createEvaluation, updateEvaluation, deleteEvaluation, undoLastEvaluation, getFilmStats };

