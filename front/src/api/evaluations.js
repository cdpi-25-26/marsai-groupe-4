import instance from "./config.js";

async function getEvaluations() {
  return await instance.get("admin/evaluations");
}

async function getFilmsToEvaluate() {
  return await instance.get("admin/evaluations/films");
}

async function getEvaluationsByFilm(filmId) {
  return await instance.get(`admin/evaluations/film/${filmId}`);
}

async function createEvaluation(data) {
  return await instance.post("admin/evaluations", data);
}

async function updateEvaluation(id, data) {
  return await instance.put(`admin/evaluations/${id}`, data);
}

async function deleteEvaluation(id) {
  return await instance.delete(`admin/evaluations/${id}`);
}

async function undoLastEvaluation() {
  return await instance.post("admin/evaluations/undo");
}

async function getFilmStats(filmId) {
  return await instance.get(`admin/evaluations/stats/${filmId}`);
}

export { getEvaluations, getFilmsToEvaluate, getEvaluationsByFilm, createEvaluation, updateEvaluation, deleteEvaluation, undoLastEvaluation, getFilmStats };
