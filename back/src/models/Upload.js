import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import User from "./User.js"
import Evaluation from "./Evaluation.js"

const Upload = sequelize.define("Upload", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  translated_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  synopsis: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  synopsis_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  youtube_link: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  subtitles: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ai_tools: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  status: {
    type: DataTypes.ENUM(
      "submitted",
      "under_review",
      "rejected",
      "selected",
      "finalist"
    ),
    defaultValue: "submitted",
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  video_path: {
  type: DataTypes.STRING(255),
  allowNull: false,
},
youtube_video_id: {
  type: DataTypes.STRING(50),   
  allowNull: true,
},
youtube_status: {
  type: DataTypes.STRING(30),
  defaultValue: "pending",
  allowNull: false,
},
phase_status: {
      type: DataTypes.ENUM("phase1", "phase2", "phase3", "rejected"),
      allowNull: false,
      defaultValue: "phase1",
    },
    edition_year: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 2026,  
},
}, {
  timestamps: true,
  tableName: "films",
  underscored: true,
});

Upload.belongsTo(User, { 
  foreignKey: "user_id", 
  as: "producer" 
});

Upload.hasMany(Evaluation, {
  foreignKey: "film_id",
  as: "evaluations",          
  sourceKey: "id"
});


export default Upload;