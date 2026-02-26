"use strict";

const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const [films] = await queryInterface.sequelize.query(`SELECT id FROM films ORDER BY id ASC;`);
    if (!films.length) throw new Error("No films found. Seed films first.");

    const awardNames = [
      "Best Film",
      "Best AI Use",
      "Best Animation",
      "Best Editing",
      "Best Sound",
      "Best Visuals",
      "Audience Choice",
      "Jury Special",
    ];

    const rows = [];
    for (let i = 0; i < 15; i++) {
      rows.push({
        name: awardNames[i % awardNames.length],
        edition_year: 2026,
        prize: i % 2 === 0 ? "Trophy" : "Certificate",
        description: `Demo award ${i + 1}`,
        film_id: films[i % films.length].id,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert("awards", rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("awards", {
      edition_year: { [Op.eq]: 2026 },
    });
  },
};
