'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE users
          MODIFY COLUMN phone             VARCHAR(20)   NULL DEFAULT NULL,
          MODIFY COLUMN mobile            VARCHAR(20)   NULL DEFAULT NULL,
          MODIFY COLUMN birth_date        DATE          NULL DEFAULT NULL,
          MODIFY COLUMN street            VARCHAR(100)  NULL DEFAULT NULL,
          MODIFY COLUMN postal_code       VARCHAR(10)   NULL DEFAULT NULL,
          MODIFY COLUMN city              VARCHAR(50)   NULL DEFAULT NULL,
          MODIFY COLUMN country           VARCHAR(50)   NULL DEFAULT NULL,
          MODIFY COLUMN biography         TEXT          NULL DEFAULT NULL,
          MODIFY COLUMN current_job       VARCHAR(255)  NULL DEFAULT NULL,
          MODIFY COLUMN portfolio_url     VARCHAR(255)  NULL DEFAULT NULL,
          MODIFY COLUMN youtube_url       VARCHAR(255)  NULL DEFAULT NULL,
          MODIFY COLUMN instagram_url     VARCHAR(255)  NULL DEFAULT NULL,
          MODIFY COLUMN linkedin_url      VARCHAR(255)  NULL DEFAULT NULL,
          MODIFY COLUMN facebook_url      VARCHAR(255)  NULL DEFAULT NULL,
          MODIFY COLUMN tiktok_url        VARCHAR(255)  NULL DEFAULT NULL,
          MODIFY COLUMN discovery_source  VARCHAR(255)  NULL DEFAULT NULL;
        `,
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE users
          MODIFY COLUMN phone             VARCHAR(20)   NOT NULL,
          MODIFY COLUMN mobile            VARCHAR(20)   NOT NULL,
          MODIFY COLUMN birth_date        DATE          NOT NULL,
          MODIFY COLUMN street            VARCHAR(100)  NOT NULL,
          MODIFY COLUMN postal_code       VARCHAR(10)   NOT NULL,
          MODIFY COLUMN city              VARCHAR(50)   NOT NULL,
          MODIFY COLUMN country           VARCHAR(50)   NOT NULL,
          MODIFY COLUMN biography         TEXT          NOT NULL,
          MODIFY COLUMN current_job       VARCHAR(255)  NOT NULL,
          MODIFY COLUMN portfolio_url     VARCHAR(255)  NOT NULL,
          MODIFY COLUMN youtube_url       VARCHAR(255)  NOT NULL,
          MODIFY COLUMN instagram_url     VARCHAR(255)  NOT NULL,
          MODIFY COLUMN linkedin_url      VARCHAR(255)  NOT NULL,
          MODIFY COLUMN facebook_url      VARCHAR(255)  NOT NULL,
          MODIFY COLUMN tiktok_url        VARCHAR(255)  NOT NULL,
          MODIFY COLUMN discovery_source  VARCHAR(255)  NOT NULL;
        `,
        { transaction: t }
      );
    });
  },
};