import Video from "../models/Video.js";
import User from "../models/User.js";
import Evaluation from "../models/Evaluation.js";

async function getPhases1Video(req,res){
    try {
        const videos = await Video.findAll({
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

async function getTop50(req,res){
    try{
        const top50 = await Video.findAll({
            where: { phase_status: 'phase1' },
            order: [["average_score", "DESC"], ["jury_votes_count", "DESC"]],
      limit: 50,
        });
        if (top50.length === 0){
            return res.status(404).json({ error: "Aucune vidéo trouvée" });
        }
            const ids = top50.map(video => video.id);
            await Video.update({ phase_status: 'phase2' }, { where: { id:{[Op.in]: ids} } }); //L'OP.in en JavaScript vérifie si une propriété spécifique existe dans un objet ou dans sa chaîne de prototypes.
        res.json(top50);
    } catch (error) {
        console.log("Erreur lors de la mise à jour des vidéos de phase 1 vers phase 2 :", error);
        res.status(500).json({ error: error.message });
    }
}

