import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import Film from "./Video.js";

const Award = sequelize.define(
  "Award",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    edition_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    prize: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    film_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "awards",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: true,
  }
);

// 🔗 Связь
Award.belongsTo(Film, { foreignKey: "film_id" });

export default Award;