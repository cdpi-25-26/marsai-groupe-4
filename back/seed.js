import "dotenv/config";
import sequelize from "./src/db/connection.js";
import { setupAssociations } from "./src/models/associations.js";
import User from "./src/models/User.js";
import Film from "./src/models/Video.js";
import FilmsJury from "./src/models/FilmsJury.js";
import bcrypt from "bcrypt";

setupAssociations();

const hash = (pw) => bcrypt.hash(pw, 10);

async function seed() {
  await sequelize.authenticate();
  console.log("✓ Connected to DB");

  // ─── Users ───────────────────────────────────────────────────────────────
  const [admin] = await User.findOrCreate({
    where: { email: "admin@marsai.io" },
    defaults: {
      first_name: "Admin",
      last_name: "MarsAI",
      email: "admin@marsai.io",
      password: await hash("Admin123!"),
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin: admin@marsai.io / Admin123!  (id=${admin.id})`);

  const [jury1] = await User.findOrCreate({
    where: { email: "jury1@marsai.io" },
    defaults: {
      first_name: "Alice",
      last_name: "Dupont",
      email: "jury1@marsai.io",
      password: await hash("Jury123!"),
      role: "JURY",
    },
  });
  console.log(`✓ Jury:  jury1@marsai.io  / Jury123!   (id=${jury1.id})`);

  const [jury2] = await User.findOrCreate({
    where: { email: "jury2@marsai.io" },
    defaults: {
      first_name: "Bob",
      last_name: "Martin",
      email: "jury2@marsai.io",
      password: await hash("Jury123!"),
      role: "JURY",
    },
  });
  console.log(`✓ Jury:  jury2@marsai.io  / Jury123!   (id=${jury2.id})`);

  const [producer] = await User.findOrCreate({
    where: { email: "producer@marsai.io" },
    defaults: {
      first_name: "Clara",
      last_name: "Lefebvre",
      email: "producer@marsai.io",
      password: await hash("Producer123!"),
      role: "PRODUCER",
    },
  });
  console.log(`✓ Producer: producer@marsai.io / Producer123!  (id=${producer.id})`);

  // ─── Films ───────────────────────────────────────────────────────────────
  const filmsData = [
    {
      title: "Echoes of Tomorrow",
      translated_title: "Échos de Demain",
      synopsis: "Un voyage visuel à travers un futur généré par IA.",
      synopsis_en: "A visual journey through an AI-generated future.",
      language: "English",
      duration: "04:32",
      youtube_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      ai_tools: "Stable Diffusion, ElevenLabs, Runway",
      status: "selected",
      phase_status: "phase1",
      user_id: producer.id,
      youtube_status: "uploaded",
      edition_year: 2026,
    },
    {
      title: "Pixels in Motion",
      translated_title: "Pixels en Mouvement",
      synopsis: "Une danse abstraite créée entièrement avec des outils IA.",
      synopsis_en: "An abstract dance created entirely with AI tools.",
      language: "French",
      duration: "03:15",
      youtube_link: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      ai_tools: "Midjourney, Suno AI, CapCut AI",
      status: "selected",
      phase_status: "phase1",
      user_id: producer.id,
      youtube_status: "uploaded",
      edition_year: 2026,
    },
    {
      title: "Neural Dreams",
      translated_title: "Rêves Neuronaux",
      synopsis: "Un documentaire court sur la créativité artificielle.",
      synopsis_en: "A short documentary on artificial creativity.",
      language: "French",
      duration: "06:48",
      youtube_link: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      ai_tools: "ChatGPT, DALL-E, Pika Labs",
      status: "selected",
      phase_status: "phase1",
      user_id: producer.id,
      youtube_status: "uploaded",
      edition_year: 2026,
    },
    {
      title: "The Last Algorithm",
      translated_title: "Le Dernier Algorithme",
      synopsis: "Science-fiction : une IA décide du destin de l'humanité.",
      synopsis_en: "Sci-fi: an AI decides the fate of humanity.",
      language: "English",
      duration: "08:20",
      youtube_link: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      ai_tools: "Runway Gen-2, ElevenLabs, Adobe Firefly",
      status: "selected",
      phase_status: "phase1",
      user_id: producer.id,
      youtube_status: "uploaded",
      edition_year: 2026,
    },
    {
      title: "Infinite Canvas",
      translated_title: "Toile Infinie",
      synopsis: "L'art génératif comme nouvelle forme d'expression cinématographique.",
      synopsis_en: "Generative art as a new form of cinematic expression.",
      language: "Spanish",
      duration: "05:10",
      youtube_link: "https://www.youtube.com/watch?v=L_jWHffIx5E",
      ai_tools: "Stable Diffusion XL, Udio, Luma AI",
      status: "selected",
      phase_status: "phase1",
      user_id: producer.id,
      youtube_status: "uploaded",
      edition_year: 2026,
    },
  ];

  const films = [];
  for (const data of filmsData) {
    const [film, created] = await Film.findOrCreate({
      where: { title: data.title },
      defaults: data,
    });
    films.push(film);
    console.log(`✓ Film [${created ? "created" : "exists "}]: "${film.title}" (id=${film.id})`);
  }

  // ─── Assign jury to films ─────────────────────────────────────────────────
  // jury1 → films 0,1,2,3,4 (tous)
  // jury2 → films 2,3,4
  const assignments = [
    { jury: jury1, filmIndexes: [0, 1, 2, 3, 4] },
    { jury: jury2, filmIndexes: [2, 3, 4] },
  ];

  for (const { jury, filmIndexes } of assignments) {
    for (const idx of filmIndexes) {
      const film = films[idx];
      const [, created] = await FilmsJury.findOrCreate({
        where: { film_id: film.id, user_id: jury.id },
        defaults: { film_id: film.id, user_id: jury.id },
      });
      if (created) {
        console.log(`✓ Assigned "${film.title}" → ${jury.email}`);
      }
    }
  }

  console.log("\n=== SEED TERMINÉ ===");
  console.log("Comptes:");
  console.log("  admin@marsai.io    / Admin123!      → ADMIN");
  console.log("  jury1@marsai.io    / Jury123!       → JURY  (5 films assignés)");
  console.log("  jury2@marsai.io    / Jury123!       → JURY  (3 films assignés)");
  console.log("  producer@marsai.io / Producer123!   → PRODUCER");

  await sequelize.close();
}

seed().catch((err) => {
  console.error("SEED FAILED:", err);
  process.exit(1);
});
