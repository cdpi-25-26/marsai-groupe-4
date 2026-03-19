'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const q = (sql) =>
        queryInterface.sequelize.query(sql, { transaction: t });

      await q(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          mobile VARCHAR(20) NOT NULL,
          birth_date DATE NOT NULL,
          street VARCHAR(100) NOT NULL,
          postal_code VARCHAR(10) NOT NULL,
          city VARCHAR(50) NOT NULL,
          country VARCHAR(50) NOT NULL,
          biography TEXT NOT NULL,
          current_job VARCHAR(255),
          portfolio_url VARCHAR(255) NOT NULL,
          youtube_url VARCHAR(255) NOT NULL,
          instagram_url VARCHAR(255) NOT NULL,
          linkedin_url VARCHAR(255) NOT NULL,
          facebook_url VARCHAR(255) NOT NULL,
          tiktok_url VARCHAR(255) NOT NULL,
          discovery_source VARCHAR(255) NOT NULL,
          role ENUM('ADMIN','JURY','DIRECTOR','PARTICIPANT') NOT NULL DEFAULT 'PARTICIPANT',

          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);

      await q(`
        CREATE TABLE categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,

          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);

      await q(`
        CREATE TABLE collaborators (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title ENUM('Ms','Mr') NOT NULL DEFAULT 'Mr',
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          profession VARCHAR(50) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,

          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);

      await q(`
        CREATE TABLE events (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          description VARCHAR(255) DEFAULT '',
          event_date DATE NOT NULL,
          location VARCHAR(100) DEFAULT '',
          type ENUM('conference','screening','workshop') NOT NULL DEFAULT 'conference',

          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `);

      await q(`
        CREATE TABLE films (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          translated_title VARCHAR(255),
          duration VARCHAR(20),
          synopsis TEXT,
          language VARCHAR(100),
          synopsis_en TEXT,
          youtube_link VARCHAR(255),
          subtitles TEXT,
          ai_tools TEXT,
          thumbnail VARCHAR(255),
          image_2 VARCHAR(255),
          image_3 VARCHAR(255),
          status ENUM('submitted','under_review','rejected','selected','finalist')
            NOT NULL DEFAULT 'submitted',
          user_id INT NOT NULL,

          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

          CONSTRAINT fk_films_user
            FOREIGN KEY (user_id) REFERENCES users(id)
            ON DELETE CASCADE
        ) ENGINE=InnoDB;
      `);

      await q(`
        CREATE TABLE evaluations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          decision ENUM('YES','MAYBE','NO') NOT NULL DEFAULT 'MAYBE',
          comment VARCHAR(255),
          user_id INT NOT NULL,
          film_id INT NOT NULL,

          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

          UNIQUE KEY uk_evaluation (user_id, film_id),
          CONSTRAINT fk_evaluations_user FOREIGN KEY (user_id) REFERENCES users(id),
          CONSTRAINT fk_evaluations_film FOREIGN KEY (film_id) REFERENCES films(id)
        ) ENGINE=InnoDB;
      `);

      await q(`
        CREATE TABLE awards (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          edition_year YEAR NOT NULL,
          prize VARCHAR(100) NOT NULL,
          description VARCHAR(100),
          film_id INT NOT NULL,

          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

          CONSTRAINT fk_awards_film FOREIGN KEY (film_id) REFERENCES films(id)
        ) ENGINE=InnoDB;
      `);

      await q(`
        CREATE TABLE reservations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL,
          profession VARCHAR(50),
          event_id INT NOT NULL,

          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

          CONSTRAINT fk_reservations_event FOREIGN KEY (event_id) REFERENCES events(id)
        ) ENGINE=InnoDB;
      `);


      await q(`
        CREATE TABLE film_categories (
          film_id INT NOT NULL,
          category_id INT NOT NULL,
          PRIMARY KEY (film_id, category_id),
          FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
      `);

      await q(`
        CREATE TABLE collaborator_films (
          collaborator_id INT NOT NULL,
          film_id INT NOT NULL,
          PRIMARY KEY (collaborator_id, film_id),
          FOREIGN KEY (collaborator_id) REFERENCES collaborators(id) ON DELETE CASCADE,
          FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
      `);
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const q = (sql) =>
        queryInterface.sequelize.query(sql, { transaction: t });

      await q(`DROP TABLE collaborator_films;`);
      await q(`DROP TABLE film_categories;`);
      await q(`DROP TABLE reservations;`);
      await q(`DROP TABLE awards;`);
      await q(`DROP TABLE evaluations;`);
      await q(`DROP TABLE films;`);
      await q(`DROP TABLE events;`);
      await q(`DROP TABLE collaborators;`);
      await q(`DROP TABLE categories;`);
      await q(`DROP TABLE users;`);
    });
  },
};
