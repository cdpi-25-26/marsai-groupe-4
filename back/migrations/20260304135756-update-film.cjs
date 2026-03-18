'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_films_phase_status') THEN
            CREATE TYPE enum_films_phase_status AS ENUM ('phase1', 'phase2', 'phase3', 'rejected');
          END IF;
        END $$;`,
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE films ADD COLUMN IF NOT EXISTS phase_status enum_films_phase_status DEFAULT 'phase1';`,
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE films DROP COLUMN IF EXISTS phase_status;`,
        { transaction: t }
      );
    });
  },
};
