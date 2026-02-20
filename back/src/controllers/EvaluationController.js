import { Op } from "sequelize";
import Evaluation from "../models/Evaluation.js";
import User from "../models/User.js";
import Film from "../models/Video.js";

async function getEvaluations(req, res) {
  try {
    const evaluations = await Evaluation.findAll({
      include: [
        { model: User, as: "jury", attributes: ["id", "first_name", "last_name"] },
        { model: Film, as: "film", attributes: ["id", "title"] },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(evaluations);
  } catch (error) {
    console.error("getEvaluations error:", error);
    res.status(500).json({ error: "Failed to fetch evaluations" });
  }
}

async function getEvaluationsByFilm(req, res) {
  try {
    const evaluations = await Evaluation.findAll({
      where: { film_id: req.params.filmId },
      include: [
        { model: User, as: "jury", attributes: ["id", "first_name", "last_name"] },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch evaluations" });
  }
}

async function createEvaluation(req, res) {
  try {
    const { decision, comment, film_id } = req.body;
    const user_id = req.user.id;

    if (!decision || !film_id) {
      return res.status(400).json({ error: "Decision and film_id are required" });
    }

    const existing = await Evaluation.findOne({ where: { user_id, film_id } });
    if (existing) {
      await existing.update({ decision, comment });
      return res.json(existing);
    }

    const evaluation = await Evaluation.create({ decision, comment, user_id, film_id });
    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: "Failed to create evaluation" });
  }
}

async function updateEvaluation(req, res) {
  try {
    const evaluation = await Evaluation.findByPk(req.params.id);
    if (!evaluation) return res.status(404).json({ error: "Evaluation not found" });
    await evaluation.update(req.body);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: "Failed to update evaluation" });
  }
}

async function deleteEvaluation(req, res) {
  try {
    const evaluation = await Evaluation.findByPk(req.params.id);
    if (!evaluation) return res.status(404).json({ error: "Evaluation not found" });
    await evaluation.destroy();
    res.json({ message: "Evaluation deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete evaluation" });
  }
}

async function getFilmsToEvaluate(req, res) {
  try {
    const user_id = req.user.id;
    const evaluated = await Evaluation.findAll({
      where: { user_id },
      attributes: ["film_id"],
    });
    const evaluatedIds = evaluated.map((e) => e.film_id);

    const where = {
      status: { [Op.in]: ["selected", "finalist"] },
      ...(evaluatedIds.length > 0 ? { id: { [Op.notIn]: evaluatedIds } } : {}),
    };
    const films = await Film.findAll({
      where,
      include: [{ model: User, as: "user", attributes: ["id", "first_name", "last_name"] }],
      order: [["id"]],
    });
    res.json(films);
  } catch (error) {
    console.error("getFilmsToEvaluate error:", error);
    res.status(500).json({ error: "Failed to fetch films to evaluate" });
  }
}

async function undoLastEvaluation(req, res) {
  try {
    const user_id = req.user.id;
    const last = await Evaluation.findOne({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });
    if (!last) return res.status(404).json({ error: "No evaluation to undo" });
    await last.destroy();
    res.json({ message: "Last evaluation undone", film_id: last.film_id });
  } catch (error) {
    res.status(500).json({ error: "Failed to undo evaluation" });
  }
}

async function getFilmStats(req, res) {
  try {
    const { filmId } = req.params;
    const evaluations = await Evaluation.findAll({ where: { film_id: filmId } });
    const total = evaluations.length;
    const yes = evaluations.filter((e) => e.decision === "YES").length;
    const no = evaluations.filter((e) => e.decision === "NO").length;
    res.json({
      total,
      yes,
      no,
      yesPercent: total > 0 ? Math.round((yes / total) * 100) : 0,
      noPercent: total > 0 ? Math.round((no / total) * 100) : 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}

export default { getEvaluations, getEvaluationsByFilm, getFilmsToEvaluate, createEvaluation, updateEvaluation, deleteEvaluation, undoLastEvaluation, getFilmStats };
