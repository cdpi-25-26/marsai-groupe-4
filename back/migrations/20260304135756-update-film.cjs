'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE films
  ADD COLUMN phase_status ENUM('phase1', 'phase2', 'phase3', 'rejected') DEFAULT 'phase1';`,
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
       ` ALTER TABLE films,

        DROP COLUMN phase_status;`,
        { transaction: t }
      );
    });
  },
};