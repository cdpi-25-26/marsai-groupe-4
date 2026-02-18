import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('conference', 'screening', 'workshop', 'masterclass', 'concert', 'party'),
      allowNull: false,
      defaultValue: 'conference'
    },
    title: {
      type: DataTypes.STRING(100),  
      allowNull: false,
    },
    description: {  
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time_start: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00",
    },
    time_end: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00",
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    enrolled: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'OPEN', 'FULL', 'CLOSED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'DRAFT'
    },
  },
  { 
    tableName: "events", 
    timestamps: true, 
    underscored: true 
  }
);

export default Event;