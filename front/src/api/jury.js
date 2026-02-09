import instance from "./config.js";

async function getJurys() {
  return await instance.get("jurys");
}

export { getJurys };