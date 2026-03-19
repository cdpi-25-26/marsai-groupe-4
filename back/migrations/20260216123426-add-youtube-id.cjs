'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
       ALTER TABLE films
    ADD youtube_video_id VARCHAR(50) NULL,
    ADD youtube_status VARCHAR(30) NOT NULL DEFAULT 'pending';
        `,
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
       ALTER TABLE films
    DROP COLUMN youtube_video_id,
    DROP COLUMN youtube_status;
        `,
        { transaction: t }
      );
    });
  },
};