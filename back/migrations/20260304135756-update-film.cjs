'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE films
  ADD COLUMN average_score DECIMAL(4,2) DEFAULT 0.00,
  ADD COLUMN jury_votes_count INT DEFAULT 0 ,
  ADD COLUMN phase_status ENUM('phase1', 'phase2', 'phase3', 'rejected') DEFAULT 'phase1';`,
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
       ` ALTER TABLE films,
        DROP COLUMN average_score,
        DROP COLUMN jury_votes_count,
        DROP COLUMN phase_status;`,
        { transaction: t }
      );
    });
  },
};