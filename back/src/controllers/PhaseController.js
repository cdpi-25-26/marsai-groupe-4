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
async function assignPrize(req, res) {
  try {
    const { id } = req.params;
    const { name, prize, description, edition_year } = req.body;

    const video = await Upload.findByPk(id);
    if (!video) return res.status(404).json({ error: "Vidéo non trouvée" });

    // Autorise phase 2 (premier prix) et phase 3 (modification)
    if (video.phase_status !== "phase2" && video.phase_status !== "phase3") {
      return res.status(400).json({ 
        error: "La vidéo doit être en phase 2 ou 3 pour attribuer/modifier un prix" 
      });
    }

    await video.update({ phase_status: "phase3" });

    const [award, created] = await Award.findOrCreate({
      where: { film_id: id },
      defaults: {
        name: name || "Prix spécial",
        prize: prize || "Trophy",
        description: description || null,
        edition_year: edition_year || video.edition_year || new Date().getFullYear(),
        film_id: id,
      },
    });

    if (!created) {
      await award.update({
        name: name || award.name,
        prize: prize || award.prize,
        description: description || award.description,
        edition_year: edition_year || award.edition_year,
      });
    }

    res.json({
      message: created ? "Prix créé" : "Prix mis à jour avec succès",
      award,
      video: {
        id: video.id,
        title: video.title,
        phase_status: video.phase_status,
      },
    });
  } catch (error) {
    console.error("Erreur assignPrize :", error);
    res.status(500).json({ error: error.message });
  }
}



async function getContestStatus(req, res) {
  try {
    const latestEdition = await Upload.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('edition_year')), 'edition_year']],
      raw: true,
    });

    const currentEdition = latestEdition?.edition_year || 2026;

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

    // Détermine la phase actuelle (la plus avancée avec des vidéos)
    if (status.phases.phase3 > 0) {
      status.currentPhase = "phase3";
      status.phaseName = "Palmarès & Attribution des prix";
    } else if (status.phases.phase2 > 0) {
      status.currentPhase = "phase2";
      status.phaseName = "Top 50 - Sélection finale";
    } else if (status.phases.phase1 > 0) {
      status.currentPhase = "phase1";
      status.phaseName = "Soumissions ouvertes";
    }

    status.message = status.currentPhase === "idle"
      ? `Aucun concours en cours pour l'édition ${currentEdition}`
      : `Concours édition ${currentEdition} – ${status.phaseName}`;

    res.json(status);
  } catch (error) {
    console.error("Erreur getContestStatus :", error);
    res.status(500).json({ error: "Erreur récupération état concours" });
  }
}

async function getAvailablePrizes(req, res) {
  try {
    const names = await Award.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('name')), 'name']],
      raw: true,
    });

    const nameList = names
      .map(n => n.name)
      .filter(n => n && n.trim() !== '');

    res.json(nameList);
  } catch (error) {
    console.error("Erreur getAvailablePrizes :", error);
    res.status(500).json({ error: "Erreur récupération des noms de prix" });
  }
}

async function promoteToNextPhase(req, res) {
  try {
    const editionYear = parseInt(req.body.edition_year) || 2026;

    // 1. Récupère les films en phase 1 avec leurs évaluations "YES"
    const films = await Upload.findAll({
      where: { phase_status: "phase1", edition_year: editionYear },
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
          required: true, // ← seulement ceux avec au moins 1 YES
        },
        {
          model: User,
          as: "producer",
          attributes: ["first_name", "last_name"]
        }
      ],
    });

    if (films.length === 0) {
      return res.status(200).json({
        message: `Aucune vidéo avec au moins un YES en phase 1 pour l'édition ${editionYear}`,
        top50: []
      });
    }

    // 2. Calcule le nombre de YES
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

    // 3. Trie et limite à 50
    const top50 = filmsWithCount
      .sort((a, b) => b.yes_count - a.yes_count || new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);

    if (top50.length === 0) {
      return res.status(200).json({
        message: `Aucune vidéo éligible pour l'édition ${editionYear}`,
        top50: []
      });
    }

    // 4. Promotion sélective : seulement les top 50 passent en phase 2 + status "selected"
    const ids = top50.map(video => video.id);

    await Upload.update(
      { status: "selected", phase_status: "phase2" },
      { where: { id: { [Op.in]: ids }, edition_year: editionYear } }
    );

    res.json({
      message: `Top ${top50.length} promu en phase 2 pour l'édition ${editionYear} (basé sur nombre de YES)`,
      top50
    });
  } catch (error) {
    console.error("Erreur promoteToNextPhase :", error);
    res.status(500).json({ error: error.message });
  }
}
async function revertToPreviousPhase(req, res) {
  try {
    const { edition_year } = req.body;
    if (!edition_year) return res.status(400).json({ error: "edition_year requis" });

    // Trouve la phase actuelle (par édition)
    const phases = await Upload.findAll({
      where: { edition_year },
      attributes: ['phase_status'],
      group: ['phase_status'],
      raw: true,
    });

    const hasPhase3 = phases.some(p => p.phase_status === 'phase3');
    const hasPhase2 = phases.some(p => p.phase_status === 'phase2');

    let previousPhase;
    if (hasPhase3) {
      previousPhase = 'phase2';
    } else if (hasPhase2) {
      previousPhase = 'phase1';
    } else {
      return res.status(400).json({ error: "Impossible de revenir plus en arrière" });
    }

    // 1. Identifie les vidéos qui vont repasser à la phase précédente
    const videosToRevert = await Upload.findAll({
      where: {
        edition_year,
        phase_status: hasPhase3 ? 'phase3' : 'phase2',
      },
      attributes: ['id'],
      raw: true,
    });

    const videoIds = videosToRevert.map(v => v.id);

    // 2. Supprime complètement les lignes de prix liées à ces vidéos
    if (videoIds.length > 0) {
      await Award.destroy({
        where: {
          film_id: { [Op.in]: videoIds },
          edition_year,
        },
      });
    }

    // 3. Si on revient en phase 1 → remet status à "submitted"
    if (previousPhase === 'phase1') {
      await Upload.update(
        { status: "submitted" },
        { where: { id: { [Op.in]: videoIds }, edition_year } }
      );
    }

    // 4. Remet les vidéos à la phase précédente
    await Upload.update(
      { phase_status: previousPhase },
      { where: { id: { [Op.in]: videoIds }, edition_year } }
    );

    res.json({
      message: `Retour à ${previousPhase} effectué pour ${videoIds.length} vidéo(s) de l'édition ${edition_year}. Les prix attribués ont été supprimés.`,
      previousPhase,
      revertedVideoCount: videoIds.length,
    });
  } catch (error) {
    console.error("Erreur revert :", error);
    res.status(500).json({ error: error.message });
  }
}

export default { getPhases1Video, getTop50, assignPrize,getContestStatus,getAvailablePrizes,promoteToNextPhase,revertToPreviousPhase}

