import instance  from "./config";

async function getProfile() {
  return await instance.get("profile");
  // http://localhost:3000/profile; fetch method GET
}

async function createProfile(newUser) {
  return await instance.post("profile", newUser);
  // http://localhost:3000/profile; fetch method POST
}


async function updateProfile(id, updatedUser) {
  return await instance.put(`profile/${id}`, updatedUser);
  // http://localhost:3000/profile/1; fetch method PUT
}

async function deleteProfile(id) {
  return await instance.delete(`profile/${id}`);
  // http://localhost:3000/profile/1; fetch method DELETE
}

async function getProfileById(id) {
  return await instance.get(`profile/${id}`);
  // http://localhost:3000/profile/1; fetch method GET
}

async function getRoles() {
  return await instance.get("profile/roles");
  // http://localhost:3000/profile/roles; fetch method GET
}

export { getProfile, createProfile, updateProfile, deleteProfile, getProfileById, getRoles };
