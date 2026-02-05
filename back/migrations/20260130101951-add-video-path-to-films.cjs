'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE films
        ADD COLUMN video_path VARCHAR(255) NULL DEFAULT NULL
        AFTER image_3;
         
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
        DROP COLUMN video_path;
        `,
        { transaction: t }
      );
    });
  },
};