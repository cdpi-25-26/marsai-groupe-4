"use strict";

const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const rows = [
      "AI Short Film",
      "Animation",
      "Documentary",
      "Experimental",
      "Sci-Fi",
      "Drama",
      "Comedy",
      "Music Video",
      "Horror",
      "Student Film",
    ].map((name) => ({
      name,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert("categories", rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", {
      name: { [Op.in]: ["AI Short Film", "Animation", "Documentary", "Experimental", "Sci-Fi", "Drama", "Comedy", "Music Video", "Horror", "Student Film"] },
    });
  },
};
