import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import User from "./User.js";

const Film = sequelize.define(
  "Film", 
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    translated_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },

    synopsis: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    synopsis_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("submitted", "under_review", "rejected", "selected", "finalist"),
      allowNull: false,
      defaultValue: "submitted",
    },

    subtitles: {
      type: DataTypes.STRING,
      allowNull: true,      
    },

    ai_tools: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    language: {
      type: DataTypes.STRING(100),
      allowNull:true,
    },

    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    image_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    image_3: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    duration: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    youtube_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },


  },
  {
      tableName: "films",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      freezeTableName: true,
    }

);


Film.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Film;
