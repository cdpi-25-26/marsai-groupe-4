import instance from "./config.js";

async function getVideos(page = 1, limit = 6) {
  return await instance.get(`films?page=${page}&limit=${limit}`);
}

async function getAllVideos() {
  return await instance.get("films?limit=1000");
}

async function deleteVideo(id) {
  return await instance.delete(`films/${id}`);
}

async function updateVideo(id, data) {
  return await instance.put(`films/${id}`, data);
}

export { getVideos, getAllVideos, deleteVideo, updateVideo };
