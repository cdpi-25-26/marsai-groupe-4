import Upload from "../models/Upload.js";
import User from "../models/User.js";
import Evaluation from "../models/Evaluation.js";
import Award from "../models/Award.js"
import { Op } from "sequelize";

async function getPhases1Video(req,res){
    try {
        const videos = await Upload.findAll({
            where: { status:"selected" , phase_status: 'phase1' },
            include: [
                {model: User, as: 'producer', attributes:['first_name','last_name']},
                    
        ],
    order:[['createdAt','DESC']],
        });
        res.json(videos);
    } catch (error) {
        console.log("Erreur lors de la récupération des vidéos de phase 1 :", error);
        res.status(500).json({ error: error.message });
    }
}

async function getTop50(req, res) {
  try {
    const films = await Upload.findAll({
      where: { phase_status: "phase1" },
      attributes: [
        "id",
        "title",
        "thumbnail",
        "created_at",
      ],
      include: [
        {
          model: Evaluation,
          as: "evaluations",
          where: { decision: "YES" },
          attributes: ["id"], 
          required: false,
        },
        { 
          model: User, 
          as: "producer", 
          attributes: ["first_name", "last_name"] 
        }
      ],
    
    });

   
    const filmsWithCount = films.map(film => ({
      id: film.id,
      title: film.title,
      thumbnail: film.thumbnail,
      created_at: film.created_at,
      producer: film.producer,
      yes_count: film.evaluations.length || 0, 
    }));

    
    const top50 = filmsWithCount
      .sort((a, b) => b.yes_count - a.yes_count || new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);

    if (top50.length === 0) {
      return res.status(200).json({ 
        message: "Aucune vidéo éligible en phase 1",
        top50: []
      });
    }

    
    const ids = top50.map(video => video.id);

    await Upload.update(
      { phase_status: "phase2" },
      { where: { id: { [Op.in]: ids } } }
    );

    res.json({
      message: `Top ${top50.length} promu en phase 2 (basé sur nombre de YES)`,
      top50
    });
  } catch (error) {
    console.error("Erreur top50/promote :", error);
    res.status(500).json({ error: error.message });
  }
}

async function assignPrize(req,res){
    try{
        const {id} = req.params;
        const {name, prize,description,edition_year} = req.body;
        const video = await Upload.findByPk(id);
        if(!video)return res.status(404).json({error:"Video non trouvée"});
        await video.update({ phase_status :"phase3"});

        const award = await Award.create({
            name: name,
            prize,
            description: description || null,
            edition_year: edition_year || null,
            film_id: id

        });
        res.json ({
            message: "prix attribué avec succès",
            award,
            video
        });
    }catch(error){
        console.error("Erreur assignPrize :",error);
        res.status(500).json({error: error.message});

    }
}



export default { getPhases1Video, getTop50, assignPrize}

