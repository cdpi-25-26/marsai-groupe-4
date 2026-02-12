"use strict";

/**
 * Seed films table with 50 demo videos
 * - Real YouTube links
 * - Placeholder thumbnails
 */

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // A list of real, stable YouTube videos (public, non-copyright sensitive)
    const youtubeLinks = [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/watch?v=9bZkp7q19f0",
      "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
      "https://www.youtube.com/watch?v=l482T0yNkeo",
      "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      "https://www.youtube.com/watch?v=fLexgOxsZu0",
      "https://www.youtube.com/watch?v=RgKAFK5djSk",
      "https://www.youtube.com/watch?v=hT_nvWreIhg",
      "https://www.youtube.com/watch?v=OPf0YbXqDm0",
      "https://www.youtube.com/watch?v=YQHsXMglC9A",
    ];

    const films = [];

    for (let i = 1; i <= 50; i++) {
      films.push({
        title: `Video ${i}`,
        translated_title: null,
        duration: null,
        synopsis: `Demo synopsis for video ${i}`,
        language: "English",
        synopsis_en: null,
        youtube_link: youtubeLinks[i % youtubeLinks.length],
        subtitles: null,
        ai_tools: null,
        thumbnail: "thumbnail-placeholder.png",
        image_2: null,
        image_3: null,
        video_path: null,
        status: "submitted",
        user_id: 5 + i, // safe default (first seeded user)

        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert("films", films);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("films", {
      title: {
        [queryInterface.sequelize.Op.like]: "Video %",
      },
    });
  },
};