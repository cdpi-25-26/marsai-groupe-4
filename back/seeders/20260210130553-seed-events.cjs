"use strict";

const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const types = ["conference", "screening", "workshop"];
    const locations = ["Cannes", "Nice", "Antibes", "Marseille", "Paris"];

    const events = [];
    for (let i = 1; i <= 12; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);

      events.push({
        title: `Event ${i}`,
        description: `Demo event description ${i}`,
        event_date: d.toISOString().slice(0, 10),
        location: locations[i % locations.length],
        type: types[i % types.length],
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert("events", events);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("events", {
      title: { [Op.like]: "Event %" },
    });
  },
};
