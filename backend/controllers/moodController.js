import MoodLog from '../models/MoodLog.js';

// @desc    Add a new mood log
// @route   POST /api/moods
// @access  Private
const createMoodLog = async (req, res) => {
  const { mood, intensity, notes } = req.body;

  if (!mood || !intensity) {
    res.status(400).json({ message: 'Please provide mood and intensity' });
    return;
  }

  const createdLog = await MoodLog.create({
    userId: req.user.id,
    mood,
    intensity,
    notes,
  });

  // Maintain _id map for frontend
  const responseData = createdLog.toJSON();
  responseData._id = createdLog.id;

  res.status(201).json(responseData);
};

// @desc    Get user's mood logs
// @route   GET /api/moods
// @access  Private
const getMoodLogs = async (req, res) => {
  // Sort by newest first
  const logs = await MoodLog.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']]
  });

  const formattedLogs = logs.map(log => {
    const l = log.toJSON();
    l._id = l.id;
    return l;
  });

  res.json(formattedLogs);
};

export { createMoodLog, getMoodLogs };
