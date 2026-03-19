"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        "events",
        "time_start",
        { type: Sequelize.TIME, allowNull: false, defaultValue: "00:00:00" },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "events",
        "time_end",
        { type: Sequelize.TIME, allowNull: false, defaultValue: "00:00:00" },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "events",
        "capacity",
        { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "events",
        "enrolled",
        { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "events",
        "status",
        {
          type: Sequelize.ENUM("DRAFT", "OPEN", "FULL", "CLOSED", "CANCELLED"),
          allowNull: false,
          defaultValue: "DRAFT",
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn("events", "status", { transaction: t });
      await queryInterface.removeColumn("events", "enrolled", { transaction: t });
      await queryInterface.removeColumn("events", "capacity", { transaction: t });
      await queryInterface.removeColumn("events", "time_end", { transaction: t });
      await queryInterface.removeColumn("events", "time_start", { transaction: t });
    });
  },
};