"use strict";

module.exports = {
  async up(queryInterface) {
    const [films] = await queryInterface.sequelize.query(`SELECT id FROM films ORDER BY id ASC;`);
    const [categories] = await queryInterface.sequelize.query(`SELECT id FROM categories ORDER BY id ASC;`);

    if (!films.length) throw new Error("No films found. Seed films first.");
    if (!categories.length) throw new Error("No categories found. Seed categories first.");

    // Map each film to 1–3 categories
    const rows = [];
    for (let i = 0; i < films.length; i++) {
      const filmId = films[i].id;

      const c1 = categories[(i + 0) % categories.length].id;
      const c2 = categories[(i + 1) % categories.length].id;
      const c3 = categories[(i + 2) % categories.length].id;

      rows.push({ film_id: filmId, category_id: c1 });

      if (i % 2 === 0) rows.push({ film_id: filmId, category_id: c2 });
      if (i % 5 === 0) rows.push({ film_id: filmId, category_id: c3 });
    }

    // Deduplicate pairs (film_id, category_id)
    const uniq = new Map();
    for (const r of rows) uniq.set(`${r.film_id}-${r.category_id}`, r);

    await queryInterface.bulkInsert("film_categories", Array.from(uniq.values()));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("film_categories", null);
  },
};
