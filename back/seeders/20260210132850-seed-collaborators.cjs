"use strict";

const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const collaborators = [];

    const professions = ["Director", "Producer", "Editor", "Cinematographer", "Sound", "Composer", "VFX", "Animator"];

    for (let i = 1; i <= 25; i++) {
      collaborators.push({
        title: i % 2 === 0 ? "Ms" : "Mr",
        first_name: `Collab${i}`,
        last_name: `Person`,
        profession: professions[i % professions.length],
        email: `collab${i}@marsai.test`,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert("collaborators", collaborators);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("collaborators", {
      email: { [Op.like]: "%@marsai.test" },
    });
  },
};
