"use strict";

module.exports = {
  async up(queryInterface) {
    const [films] = await queryInterface.sequelize.query(`SELECT id FROM films ORDER BY id ASC;`);
    const [collabs] = await queryInterface.sequelize.query(`SELECT id FROM collaborators ORDER BY id ASC;`);

    if (!films.length) throw new Error("No films found. Seed films first.");
    if (!collabs.length) throw new Error("No collaborators found. Seed collaborators first.");

    // Map each film to 1–2 collaborators
    const rows = [];
    for (let i = 0; i < films.length; i++) {
      const filmId = films[i].id;

      const a = collabs[i % collabs.length].id;
      const b = collabs[(i + 7) % collabs.length].id;

      rows.push({ collaborator_id: a, film_id: filmId });
      if (i % 3 === 0) rows.push({ collaborator_id: b, film_id: filmId });
    }

    // Deduplicate
    const uniq = new Map();
    for (const r of rows) uniq.set(`${r.collaborator_id}-${r.film_id}`, r);

    await queryInterface.bulkInsert("collaborator_films", Array.from(uniq.values()));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("collaborator_films", null);
  },
};
