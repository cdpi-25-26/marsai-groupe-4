import instance from "./config.js";

async function getStats() {
  return await instance.get("overview");
}

export { getStats };