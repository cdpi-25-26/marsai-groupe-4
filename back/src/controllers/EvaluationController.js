import { Op, fn, col } from "sequelize";
import Evaluation from "../models/Evaluation.js";
import User from "../models/User.js";
import Film from "../models/Video.js";

const VALID_DECISIONS = new Set(["YES", "MAYBE", "NO"]);

function parsePositiveInt(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function normalizeDecision(value) {
  if (typeof value !== "string") return null;
  return value.trim().toUpperCase();
}

async function getEvaluations(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit ?? "20", 10), 1), 100);
    const offset = (page - 1) * limit;

    const where = {};

    if (req.user?.role === "JURY") {
      where.user_id = req.user.id;
    } else if (req.query.user_id !== undefined) {
      const userId = parsePositiveInt(req.query.user_id);
      if (!userId) {
        return res.status(400).json({ error: "Invalid user_id" });
      }
      where.user_id = userId;
    }

    if (req.query.film_id !== undefined) {
      const filmId = parsePositiveInt(req.query.film_id);
      if (!filmId) {
        return res.status(400).json({ error: "Invalid film_id" });
      }
      where.film_id = filmId;
    }

    if (req.query.decision !== undefined) {
      const decision = normalizeDecision(req.query.decision);
      if (!VALID_DECISIONS.has(decision)) {
        return res.status(400).json({ error: "Invalid decision" });
      }
      where.decision = decision;
    }

    const search = req.query.search?.trim();
    if (search) {
      where.comment = { [Op.like]: `%${search}%` };
    }

    const [evaluations, total] = await Promise.all([
      Evaluation.findAll({
        where,
        include: [
          {
            model: User,
            as: "jury",
            attributes: ["id", "first_name", "last_name", "email"],
          },
          {
            model: Film,
            as: "film",
            attributes: ["id", "title", "translated_title", "status", "youtube_link"],
          },
        ],
        order: [["created_at", "DESC"]],
        limit,
        offset,
      }),
      Evaluation.count({ where }),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return res.json({
      evaluations,
      total,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch evaluations" });
  }
}

async function getEvaluationsByFilm(req, res) {
  try {
    const filmId = parsePositiveInt(req.params.filmId);
    if (!filmId) {
      return res.status(400).json({ error: "Invalid film id" });
    }

    const where = { film_id: filmId };

    if (req.user?.role === "JURY") {
      where.user_id = req.user.id;
    }

    const evaluations = await Evaluation.findAll({
      where,
      include: [
        {
          model: User,
          as: "jury",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: Film,
          as: "film",
          attributes: ["id", "title", "translated_title", "status", "youtube_link"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.json({
      evaluations,
      total: evaluations.length,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch evaluations for this film" });
  }
}

async function createEvaluation(req, res) {
  try {
    const filmId = parsePositiveInt(req.body?.film_id);
    const decision = normalizeDecision(req.body?.decision);
    const comment = typeof req.body?.comment === "string" ? req.body.comment.trim() : null;

    if (!filmId) {
      return res.status(400).json({ error: "film_id is required" });
    }

    if (!VALID_DECISIONS.has(decision)) {
      return res.status(400).json({ error: "Decision must be YES, MAYBE or NO" });
    }

    const targetUserId =
      req.user?.role === "ADMIN" && req.body?.user_id
        ? parsePositiveInt(req.body.user_id)
        : req.user.id;

    if (!targetUserId) {
      return res.status(400).json({ error: "Invalid user_id" });
    }

    const film = await Film.findByPk(filmId);
    if (!film) {
      return res.status(404).json({ error: "Film not found" });
    }

    if (req.user?.role === "JURY") {
      const assignedCount = await Film.count({
        where: { id: filmId },
        include: [
          {
            model: User,
            as: "juryMembers",
            attributes: [],
            through: { attributes: [] },
            where: { id: req.user.id },
            required: true,
          },
        ],
      });

      if (assignedCount === 0) {
        return res.status(403).json({ error: "Film is not assigned to this jury member" });
      }
    }

    const [evaluation, created] = await Evaluation.findOrCreate({
      where: {
        user_id: targetUserId,
        film_id: filmId,
      },
      defaults: {
        user_id: targetUserId,
        film_id: filmId,
        decision,
        comment: comment || null,
      },
    });

    if (!created) {
      await evaluation.update({
        decision,
        comment: comment || null,
      });
    }

    const populatedEvaluation = await Evaluation.findByPk(evaluation.id, {
      include: [
        {
          model: User,
          as: "jury",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: Film,
          as: "film",
          attributes: ["id", "title", "translated_title", "status", "youtube_link"],
        },
      ],
    });

    return res.status(created ? 201 : 200).json(populatedEvaluation);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create evaluation" });
  }
}

async function updateEvaluation(req, res) {
  try {
    const evaluationId = parsePositiveInt(req.params.id);
    if (!evaluationId) {
      return res.status(400).json({ error: "Invalid evaluation id" });
    }

    const updateData = {};

    if (req.body?.decision !== undefined) {
      const decision = normalizeDecision(req.body.decision);
      if (!VALID_DECISIONS.has(decision)) {
        return res.status(400).json({ error: "Decision must be YES, MAYBE or NO" });
      }
      updateData.decision = decision;
    }

    if (req.body?.comment !== undefined) {
      updateData.comment =
        typeof req.body.comment === "string" && req.body.comment.trim() !== ""
          ? req.body.comment.trim()
          : null;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields provided to update" });
    }

    const where = { id: evaluationId };
    if (req.user?.role === "JURY") {
      where.user_id = req.user.id;
    }

    const evaluation = await Evaluation.findOne({ where });
    if (!evaluation) {
      return res.status(404).json({ error: "Evaluation not found" });
    }

    await evaluation.update(updateData);

    const updatedEvaluation = await Evaluation.findByPk(evaluation.id, {
      include: [
        {
          model: User,
          as: "jury",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: Film,
          as: "film",
          attributes: ["id", "title", "translated_title", "status", "youtube_link"],
        },
      ],
    });

    return res.json(updatedEvaluation);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update evaluation" });
  }
}

async function deleteEvaluation(req, res) {
  try {
    const evaluationId = parsePositiveInt(req.params.id);
    if (!evaluationId) {
      return res.status(400).json({ error: "Invalid evaluation id" });
    }

    const where = { id: evaluationId };
    if (req.user?.role === "JURY") {
      where.user_id = req.user.id;
    }

    const deleted = await Evaluation.destroy({ where });
    if (deleted === 0) {
      return res.status(404).json({ error: "Evaluation not found" });
    }

    return res.json({ message: "Evaluation deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete evaluation" });
  }
}

async function getFilmsToEvaluate(req, res) {
  try {
    const isAdmin = req.user?.role === "ADMIN";
    const requestedUserId =
      isAdmin && req.query.user_id !== undefined ? parsePositiveInt(req.query.user_id) : null;

    if (isAdmin && req.query.user_id !== undefined && !requestedUserId) {
      return res.status(400).json({ error: "Invalid user_id" });
    }

    const scopedUserId = isAdmin ? requestedUserId : req.user.id;
    const where = {
      youtube_link: { [Op.ne]: null },
    };

    const include = [
      {
        model: User,
        as: "user",
        attributes: ["id", "first_name", "last_name", "email"],
      },
    ];

    if (scopedUserId) {
      const evaluatedFilms = await Evaluation.findAll({
        where: { user_id: scopedUserId },
        attributes: ["film_id"],
        raw: true,
      });

      const evaluatedFilmIds = evaluatedFilms.map((row) => row.film_id);
      if (evaluatedFilmIds.length > 0) {
        where.id = { [Op.notIn]: evaluatedFilmIds };
      }

      include.push({
        model: User,
        as: "juryMembers",
        attributes: [],
        through: { attributes: [] },
        where: { id: scopedUserId },
        required: true,
      });
    }

    const films = await Film.findAll({
      where,
      include,
      order: [["id", "ASC"]],
    });

    return res.json({
      films,
      total: films.length,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch films to evaluate" });
  }
}

async function undoLastEvaluation(req, res) {
  try {
    const requestedUserId =
      req.user?.role === "ADMIN"
        ? parsePositiveInt(req.body?.user_id ?? req.query?.user_id)
        : null;

    if (
      req.user?.role === "ADMIN" &&
      (req.body?.user_id !== undefined || req.query?.user_id !== undefined) &&
      !requestedUserId
    ) {
      return res.status(400).json({ error: "Invalid user_id" });
    }

    const targetUserId = requestedUserId || req.user.id;

    const lastEvaluation = await Evaluation.findOne({
      where: { user_id: targetUserId },
      order: [
        ["created_at", "DESC"],
        ["id", "DESC"],
      ],
    });

    if (!lastEvaluation) {
      return res.status(404).json({ error: "No evaluation to undo" });
    }

    await lastEvaluation.destroy();

    return res.json({
      message: "Last evaluation undone",
      deletedEvaluation: {
        id: lastEvaluation.id,
        film_id: lastEvaluation.film_id,
        user_id: lastEvaluation.user_id,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to undo last evaluation" });
  }
}

async function getFilmStats(req, res) {
  try {
    const filmId = parsePositiveInt(req.params.filmId);
    if (!filmId) {
      return res.status(400).json({ error: "Invalid film id" });
    }

    const grouped = await Evaluation.findAll({
      where: { film_id: filmId },
      attributes: ["decision", [fn("COUNT", col("id")), "count"]],
      group: ["decision"],
      raw: true,
    });

    let yes = 0;
    let maybe = 0;
    let no = 0;

    for (const row of grouped) {
      const count = Number.parseInt(row.count, 10) || 0;
      if (row.decision === "YES") yes = count;
      if (row.decision === "MAYBE") maybe = count;
      if (row.decision === "NO") no = count;
    }

    const total = yes + maybe + no;

    return res.json({
      total,
      yes,
      maybe,
      no,
      yesPercent: total > 0 ? Math.round((yes / total) * 100) : 0,
      maybePercent: total > 0 ? Math.round((maybe / total) * 100) : 0,
      noPercent: total > 0 ? Math.round((no / total) * 100) : 0,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch film stats" });
  }
}

export default { getEvaluations, getEvaluationsByFilm, getFilmsToEvaluate, createEvaluation, updateEvaluation, deleteEvaluation, undoLastEvaluation, getFilmStats };
