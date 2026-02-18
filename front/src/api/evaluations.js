import instance from "./config.js";

async function getEvaluations() {
  return await instance.get("admin/evaluations");
}

async function getFilmsToEvaluate() {
  return await instance.get("admin/evaluations/films");
}

async function getEvaluationsByFilm(filmId) {
  return await instance.get(`gallery/films/${filmId}/evaluations`);
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

export { getEvaluations, getFilmsToEvaluate, getEvaluationsByFilm, createEvaluation, updateEvaluation, deleteEvaluation };
