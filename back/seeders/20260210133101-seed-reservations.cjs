"use strict";

const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const [events] = await queryInterface.sequelize.query(`SELECT id FROM events ORDER BY id ASC;`);
    if (!events.length) throw new Error("No events found. Seed events first.");

    const rows = [];
    for (let i = 1; i <= 40; i++) {
      rows.push({
        first_name: `Guest${i}`,
        last_name: `Viewer`,
        email: `guest${i}@marsai.test`,
        profession: i % 3 === 0 ? "Student" : i % 3 === 1 ? "Engineer" : "Artist",
        event_id: events[i % events.length].id,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert("reservations", rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("reservations", {
      email: { [Op.like]: "%@marsai.test" },
    });
  },
};
