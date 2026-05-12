import User from '../models/User.js';
import MoodLog from '../models/MoodLog.js';
import TherapySession from '../models/TherapySession.js';

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalTherapists = await User.count({ where: { role: 'therapist' } });
    const totalMoodLogs = await MoodLog.count();
    const totalSessions = await TherapySession.count();
    const completedSessions = await TherapySession.count({ where: { status: 'Completed' } }); // Note: Capitalized 'Completed' to match model enum
    
    res.json({
        totalUsers,
        totalTherapists,
        totalMoodLogs,
        totalSessions,
        completedSessions
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

export { getAdminStats };
