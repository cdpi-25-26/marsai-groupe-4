import instance from "./config.js";

async function getVideos(page = 1, limit = 6) {
  return await instance.get(`films?page=${page}&limit=${limit}`);
}

export { getVideos };
