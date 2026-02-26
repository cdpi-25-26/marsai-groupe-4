import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Event = sequelize.define(
    "Event",

    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },

        title: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        description: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },

        event_date: {
          type: DataTypes.DATEONLY, 
          allowNull: true, 
          defaultValue: null
        },

        location: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },

        type: {
          type: DataTypes.ENUM("conference", "screening", "Workshop"),
          allowNull: false,
          defaultValue: "conference",
        },
    },

    {
    tableName: "events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: true,
  }
);

export default Event;