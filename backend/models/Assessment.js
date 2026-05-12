import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Assessment = sequelize.define('Assessment', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Stress Test', 'PHQ-9', 'GAD-7']],
    }
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answers: {
    type: DataTypes.JSON,
    defaultValue: [],
  }
}, {
  timestamps: true,
});

Assessment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Assessment, { foreignKey: 'userId' });

export default Assessment;
