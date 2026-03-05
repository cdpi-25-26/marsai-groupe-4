import instance from "./config";


async function getPhase1Videos() {
  return await instance.get("/phase/phase1");
}

async function getTop50() {
  return await instance.get("/phase/top50");
}

async function assignPrize(videoId, prizeData){
    return await instance.put(`/contest/prize/${videoId}`, prizeData);
}

export {getPhase1Videos, getTop50,assignPrize}