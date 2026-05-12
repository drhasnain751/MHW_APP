import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const MoodLog = sequelize.define('MoodLog', {
  mood: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Happy', 'Calm', 'Sad', 'Anxious', 'Angry', 'Tired']],
    }
  },
  intensity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
    }
  },
  notes: {
    type: DataTypes.STRING(500),
  },
}, {
  timestamps: true,
});

MoodLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(MoodLog, { foreignKey: 'userId' });

export default MoodLog;
