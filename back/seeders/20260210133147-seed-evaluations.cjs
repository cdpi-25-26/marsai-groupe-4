"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const [juryUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'JURY' ORDER BY id ASC;`
    );
    const [films] = await queryInterface.sequelize.query(`SELECT id FROM films ORDER BY id ASC;`);

    if (!juryUsers.length) throw new Error("No JURY users found. Seed users first.");
    if (!films.length) throw new Error("No films found. Seed films first.");

    const decisions = ["YES", "MAYBE", "NO"];

    // Create ~ (juryCount * 10) evaluations, but always unique (user_id, film_id)
    const rows = [];
    const maxPerJury = 10;

    for (let j = 0; j < juryUsers.length; j++) {
      const userId = juryUsers[j].id;

      for (let k = 0; k < maxPerJury; k++) {
        const filmId = films[(j * maxPerJury + k) % films.length].id;

        rows.push({
          decision: decisions[(j + k) % decisions.length],
          comment: `Demo evaluation by jury ${userId} on film ${filmId}`,
          user_id: userId,
          film_id: filmId,
          created_at: now,
          updated_at: now,
        });
      }
    }

    // No duplicates possible with that mapping, but keep it safe anyway
    const uniq = new Map();
    for (const r of rows) uniq.set(`${r.user_id}-${r.film_id}`, r);

    await queryInterface.bulkInsert("evaluations", Array.from(uniq.values()));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("evaluations", null);
  },
};
