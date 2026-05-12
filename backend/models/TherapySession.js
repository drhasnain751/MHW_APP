import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const TherapySession = sequelize.define('TherapySession', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Scheduled',
    validate: {
      isIn: [['Scheduled', 'Completed', 'Cancelled']],
    }
  },
  notes: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

TherapySession.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
TherapySession.belongsTo(User, { foreignKey: 'therapistId', as: 'therapist' });
User.hasMany(TherapySession, { foreignKey: 'patientId', as: 'patientSessions' });
User.hasMany(TherapySession, { foreignKey: 'therapistId', as: 'therapistSessions' });

export default TherapySession;
