import instance from "./config";

export const getRecentUploads = async () => {
  const res = await instance.get("/profile/me/recent");
  return res.data;
};
