import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

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
}, {
  timestamps: true,          
  tableName: "films",         
  underscored: true,        
});

export default Upload;