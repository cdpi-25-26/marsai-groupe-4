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
    decision: {
      type: DataTypes.ENUM("YES", "MAYBE", "NO"),
      allowNull: false,
      defaultValue: "MAYBE",
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    film_id: {
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

Evaluation.belongsTo(User, { foreignKey: "user_id", as: "jury" });
Evaluation.belongsTo(Film, { foreignKey: "film_id", as: "film" });

export default Evaluation;
