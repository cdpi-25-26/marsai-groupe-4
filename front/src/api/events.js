import instance from "./config.js";



async function getEvents() {
  return await instance.get("events");
  // http://localhost:3000/events; fetch method GET
}

async function createEvent(newEvent) {
  return await instance.post("events", newEvent);
  // http://localhost:3000/events; fetch method POST
}

async function updateEvent(id, updatedEvent) {
  return await instance.put(`events/${id}`, updatedEvent);
  // http://localhost:3000/events/1; fetch method PUT
}

async function deleteEvent(id) {
  return await instance.delete(`events/${id}`);
  // http://localhost:3000/events/1; fetch method DELETE
}

async function getEventById(id) {
  return await instance.get(`events/${id}`);
  // http://localhost:3000/events/1; fetch method GET
}

async function getTypes() {
  return await instance.get("events/types");
  // http://localhost:3000/events/types; fetch method GET
}

export { getEvents, createEvent, updateEvent, deleteEvent, getEventById, getTypes };


