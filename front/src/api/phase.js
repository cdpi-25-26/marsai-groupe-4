import instance from "./config";


async function getPhase1Videos() {
  return await instance.get("/phase/phase1");
}

async function getTop50() {
  return await instance.get("/phase/top50");
}

async function assignPrize(videoId, prizeData) {
  return await instance.put(`/phase/prize/${videoId}`, prizeData);
}

async function getContestStatus(){
  return await instance.get("/phase/status");
}

async function getAvailablesPrizes(){
  return await instance.get("/prizes")
}

export async function getAvailablePrizes() {
  try {
    const res = await instance.get("/phase/prizes");
    return res.data;
  } catch (error) {
    console.error("Erreur récupération des prix disponibles :", error);
    throw error;
  }
}


export {getPhase1Videos, getTop50,assignPrize,getContestStatus,getAvailablesPrizes}