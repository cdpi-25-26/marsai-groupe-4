import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import User from "./User.js";
import Film from "./Video.js";

const Evaluation = sequelize.define(
  "Evaluation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    decision: {
      type: DataTypes.ENUM("YES", "MAYBE", "NO"),
      allowNull: false,
      defaultValue: "MAYBE",
    },

    film_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  },
  {
    tableName: "evaluations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: true,
  }
);



export default Evaluation;

