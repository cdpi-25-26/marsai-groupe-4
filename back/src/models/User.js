import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    phone: { type: DataTypes.STRING(20), allowNull: true, defaultValue: null },
    mobile: { type: DataTypes.STRING(20), allowNull: true, defaultValue: null },
    birth_date: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: null },

    street: { type: DataTypes.STRING(100), allowNull: true, defaultValue: null },
    postal_code: { type: DataTypes.STRING(10), allowNull: true, defaultValue: null },
    city: { type: DataTypes.STRING(50), allowNull: true, defaultValue: null },
    country: { type: DataTypes.STRING(50), allowNull: true, defaultValue: null },

    biography: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    current_job: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },

    portfolio_url: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    youtube_url: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    instagram_url: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    linkedin_url: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    facebook_url: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    tiktok_url: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },

    discovery_source: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },

    role: {
      type: DataTypes.ENUM("ADMIN", "JURY", "PRODUCER"),
      allowNull: false,
      defaultValue: "PRODUCER",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: true,
  }
);

export default User;
