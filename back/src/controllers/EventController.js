import Event from "../models/Event.js"

function getEvents(req, res) {
    Event.findAll().then((events) => {
        res.json(events);
    });
}


function deleteEvent(req, res) {
    const { id } = req.params;
    Event.destroy({ where: { id } }). then (() => {
        res.status(204).json({ message: "Evennement supprimé"})
    });
}

function getEventById(req, res) {
    const { id } = req.params;
    Event.findOne({ where: { id } }).then((event) => {
        if(event) {
           res.json(event);
        } else {
      res.status(404).json({ error: "Evennement non trouvé" });
    }
    })
}

function createEvent(req, res) {
    const eventData = req.body;
    Event.create(eventData).then((event) => {
        res.status(201).json(event);
    }).catch((error) => {
        res.status(400).json({ error: error.message });
    });
}

function updateEvent(req, res) {
    const { id } = req.params;
    const eventData = req.body;
    Event.update(eventData, { where: { id } }).then(() => {
        res.json({ message: "Evennement mis à jour" });
    }).catch((error) => {
        res.status(400).json({ error: error.message });
    });
}


export default {
    getEvents,
    deleteEvent,
    getEventById,
    createEvent,
    updateEvent
}