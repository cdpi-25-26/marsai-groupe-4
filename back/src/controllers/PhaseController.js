import Upload from "../models/Upload.js";
import User from "../models/User.js";
import Evaluation from "../models/Evaluation.js";
import Award from "../models/Award.js"
import { Op } from "sequelize";
import sequelize from "../db/connection.js";

async function getPhases1Video(req,res){
    try {
        const videos = await Upload.findAll({
            where: { status:"submitted" , phase_status: 'phase1' },
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
    const editionYear = parseInt(req.body.edition_year) || 2026;
    const films = await Upload.findAll({
      where: { phase_status: "phase1",edition_year: editionYear },
      attributes: [
        "id",
        "title",
        "thumbnail",
        "created_at",
        "phase_status"
      ],
      include: [
        {
          model: Evaluation,
          as: "evaluations",
          where: { decision: "YES" },
          attributes: ["id"], 
          required: true,
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
      phase_status: film.phase_status,
      yes_count: film.evaluations.length || 0, 
      edition_year: editionYear,
    }));

    
    const top50 = filmsWithCount
      .sort((a, b) => b.yes_count - a.yes_count || new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);

    if (top50.length === 0) {
      return res.status(200).json({ 
        message: `Aucune vidéo éligible en phase 1 pour l'édition ${editionYear}`,
        top50: []
      });
    }

    
    const ids = top50.map(video => video.id);

    await Upload.update(
      { status:"selected" , phase_status: "phase2" },
      { where: { id: { [Op.in]: ids }, edition_year: editionYear } }
    );

    res.json({
      message: `Top ${top50.length} promu en phase 2 pour l'édition ${editionYear}(basé sur nombre de YES)`,
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

// Retourne l’état actuel du concours (phase + édition)
async function getContestStatus(req, res) {
  try {
    // Dernière édition (max edition_year)
    const latestEdition = await Upload.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('edition_year')), 'edition_year']],
      raw: true,
    });

    const currentEdition = latestEdition?.edition_year || 2026;

    // Stats par phase
    const phaseStats = await Upload.findAll({
      attributes: [
        'phase_status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['phase_status'],
      raw: true,
    });

    const status = {
      currentEdition,
      phases: {
        phase1: 0,
        phase2: 0,
        phase3: 0,
        rejected: 0,
      },
      currentPhase: "idle",
      phaseName: "Aucun concours en cours",
      message: `Concours édition ${currentEdition} – Aucun concours en cours`,
    };

    phaseStats.forEach(stat => {
      status.phases[stat.phase_status] = parseInt(stat.count);
    });

    // Détermine la phase actuelle (la plus avancée qui a des vidéos)
    if (status.phases.phase3 > 0) {
      status.currentPhase = "phase3";
      status.phaseName = "Palmarès & Attribution des prix";
      status.message = `Concours édition ${currentEdition} – Palmarès en cours`;
    } else if (status.phases.phase2 > 0) {
      status.currentPhase = "phase2";
      status.phaseName = "Top 50 - Sélection finale";
      status.message = `Concours édition ${currentEdition} – Top 50 en cours`;
    } else if (status.phases.phase1 > 0) {
      status.currentPhase = "phase1";
      status.phaseName = "Soumissions ouvertes";
      status.message = `Concours édition ${currentEdition} – Soumissions en cours`;
    }

    res.json(status);
  } catch (error) {
    console.error("Erreur getContestStatus :", error);
    res.status(500).json({ error: "Erreur récupération état concours" });
  }
}



export default { getPhases1Video, getTop50, assignPrize,getContestStatus}

