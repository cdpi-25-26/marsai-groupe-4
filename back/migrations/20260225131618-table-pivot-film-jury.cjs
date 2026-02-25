'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const q = (sql) =>
        queryInterface.sequelize.query(sql, { transaction: t });

      await q(`
        CREATE TABLE films_jury (
          id INT AUTO_INCREMENT PRIMARY KEY,
          film_id INT NOT NULL,
          user_id INT NOT NULL,

          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

          UNIQUE KEY uk_films_jury (user_id, film_id),
          CONSTRAINT fk_films_jury_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          CONSTRAINT fk_films_jury_film FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
      `);
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const q = (sql) =>
        queryInterface.sequelize.query(sql, { transaction: t });

      await q(`DROP TABLE IF EXISTS films_jury;`);
    });
  },
};
