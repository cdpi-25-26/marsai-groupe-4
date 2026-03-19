'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      // 1) Normalize existing data
      // Map removed roles to PRODUCER
      await queryInterface.sequelize.query(
        `
        UPDATE users
        SET role = 'PRODUCER'
        WHERE role IN ('DIRECTOR', 'PARTICIPANT');
        `,
        { transaction: t }
      );

      // 2) Alter ENUM definition
      await queryInterface.sequelize.query(
        `
        ALTER TABLE users
        MODIFY role ENUM('ADMIN','JURY','PRODUCER')
        NOT NULL DEFAULT 'PRODUCER';
        `,
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      // Revert enum (best-effort rollback)
      await queryInterface.sequelize.query(
        `
        ALTER TABLE users
        MODIFY role ENUM('ADMIN','JURY','DIRECTOR','PARTICIPANT')
        NOT NULL DEFAULT 'PARTICIPANT';
        `,
        { transaction: t }
      );
    });
  },
};
