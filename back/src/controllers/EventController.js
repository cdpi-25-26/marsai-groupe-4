import Event from "../models/Events.js";

async function getAll(req, res) {
  try {
    const events = await Event.findAll({
      order: [
        ["event_date", "ASC"],
        ["time_start", "ASC"],
      ],
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function getOne(req, res){
    try{
        const event = await Event.findByPk(req.params.id);
        if(!event) {
            return res.status(404).json({error: "event find error"})
        }
        res.json(event);
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}

async function create(req, res) {
  try{
    const event = await Event.create(req.body);
    res.status(201).json(event);
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
}

async function update(req, res) {
  try{
    const event = await Event.findByPk(req.params.id);
    if (!event){
      return res.status(404).json({ error: "event find error"})
    }
    await event.update(req.body);
    res.json(event)
  }
  catch (error) {
    res.status(500).json({error: error.message});
  }
}

async function remove(req, res){
  try{
    const event = await Event.findByPk(req.params.id);
    if(!event) {
      return res.status(404).json({error: 'event find'})
    }
    await event.destroy();
    res.status(204).send()

  }catch(error){
    res.status(500).json({error: error.message})
  }
}


export default {getAll, getOne, create, update, remove};