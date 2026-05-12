import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const WellnessContent = sequelize.define('WellnessContent', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Article', 'Audio', 'Exercise']],
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  }
}, {
  timestamps: true,
});

export default WellnessContent;
