import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const JournalEntry = sequelize.define('JournalEntry', {
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General',
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sentiment: {
    type: DataTypes.STRING,
    defaultValue: 'Neutral'
  }
}, {
  timestamps: true,
});

JournalEntry.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(JournalEntry, { foreignKey: 'userId' });

export default JournalEntry;
