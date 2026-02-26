import Event from "../models/Event.js"
import sequelize from "../db/connection.js";

function getEvents(req, res) {
    Event.findAll().then((events) => {
        res.json(events);
    });
}


async function deleteEvent(req, res) {
    const { id } = req.params;
    
    try {
        await sequelize.transaction(async (t) => {
            await sequelize.query(
                'DELETE FROM reservations WHERE event_id = ?',
                { replacements: [id], transaction: t }
            );
            
            await Event.destroy({ where: { id }, transaction: t });
        });
        
        res.status(204).json({ message: "Evennement supprimé" });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ 
            error: "Impossible de supprimer l'événement",
            details: error.message 
        });
    }
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

async function getTypes(req, res) {
    try {
        const [results] = await sequelize.query(`
            SELECT COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'events' 
            AND COLUMN_NAME = 'type'
        `);
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Type column not found" });
        }
        
        const columnType = results[0].COLUMN_TYPE;
        const enumMatch = columnType.match(/enum\((.*)\)/i);
        
        if (!enumMatch) {
            return res.status(500).json({ error: "Could not parse enum values" });
        }
        
        const types = enumMatch[1]
            .split(',')
            .map(value => value.replace(/'/g, '').trim());
        
        res.json({ types });
    } catch (error) {
        console.error('Error fetching event types:', error);
        res.status(500).json({ 
            error: "Failed to fetch event types",
            details: error.message 
        });
    }
}

export default {
    getEvents,
    deleteEvent,
    getEventById,
    createEvent,
    updateEvent,
    getTypes
}