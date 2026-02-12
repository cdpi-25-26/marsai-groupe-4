"use strict";

/**
 * Seed users table with:
 * - 100 PRODUCER
 * - 10 JURY
 * - 3 ADMIN
 */

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const users = [];

    // ---- PRODUCERS (100) ----
    for (let i = 1; i <= 100; i++) {
      users.push({
        first_name: `Producer${i}`,
        last_name: `User`,
        email: `producer${i}@marsai.test`,
        password: "$2b$10$examplehashedpasswordxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // replace later with real hash
        role: "PRODUCER",

        phone: null,
        mobile: null,
        birth_date: null,
        street: null,
        postal_code: null,
        city: null,
        country: null,
        biography: null,
        current_job: null,
        portfolio_url: null,
        youtube_url: null,
        instagram_url: null,
        linkedin_url: null,
        facebook_url: null,
        tiktok_url: null,
        discovery_source: null,

        created_at: now,
        updated_at: now,
      });
    }

    // ---- JURY (10) ----
    for (let i = 1; i <= 10; i++) {
      users.push({
        first_name: `Jury${i}`,
        last_name: `Member`,
        email: `jury${i}@marsai.test`,
        password: "$2b$10$examplehashedpasswordxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        role: "JURY",

        phone: null,
        mobile: null,
        birth_date: null,
        street: null,
        postal_code: null,
        city: null,
        country: null,
        biography: null,
        current_job: null,
        portfolio_url: null,
        youtube_url: null,
        instagram_url: null,
        linkedin_url: null,
        facebook_url: null,
        tiktok_url: null,
        discovery_source: null,

        created_at: now,
        updated_at: now,
      });
    }

    // ---- ADMINS (3) ----
    for (let i = 1; i <= 3; i++) {
      users.push({
        first_name: `Admin${i}`,
        last_name: `User`,
        email: `admin${i}@marsai.test`,
        password: "$2b$10$examplehashedpasswordxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        role: "ADMIN",

        phone: null,
        mobile: null,
        birth_date: null,
        street: null,
        postal_code: null,
        city: null,
        country: null,
        biography: null,
        current_job: null,
        portfolio_url: null,
        youtube_url: null,
        instagram_url: null,
        linkedin_url: null,
        facebook_url: null,
        tiktok_url: null,
        discovery_source: null,

        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert("users", users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: {
        [queryInterface.sequelize.Op.like]: "%@marsai.test",
      },
    });
  },
};