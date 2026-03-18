'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE films ADD COLUMN IF NOT EXISTS edition_year INTEGER NOT NULL DEFAULT 2026;`,
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE films DROP COLUMN IF EXISTS edition_year;`,
        { transaction: t }
      );
    });
  },
};
