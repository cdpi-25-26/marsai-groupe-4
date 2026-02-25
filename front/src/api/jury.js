import instance from "./config.js";

async function getJuryMembers() {
  return await instance.get("jury/members");
}

async function getJuryFilms(userId) {
  return await instance.get(`jury/${userId}/films`);
}

async function getFilmJury(filmId) {
  return await instance.get(`jury/films/${filmId}`);
}

async function assignFilmToJury(filmId, userId) {
  return await instance.post("jury/assign", { film_id: filmId, user_id: userId });
}

async function unassignFilmFromJury(filmId, userId) {
  return await instance.delete(`jury/unassign/${filmId}/${userId}`);
}

export { 
  getJuryMembers, 
  getJuryFilms, 
  getFilmJury,
  assignFilmToJury, 
  unassignFilmFromJury 
};