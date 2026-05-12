import TherapySession from '../models/TherapySession.js';
import User from '../models/User.js';

// @desc    Book a new therapy session
// @route   POST /api/therapy/book
// @access  Private
const bookSession = async (req, res) => {
  const { therapistId, date } = req.body;

  if (!therapistId || !date) {
    res.status(400).json({ message: 'Please provide therapist ID and Date' });
    return;
  }

  const createdSession = await TherapySession.create({
    patientId: req.user.id,
    therapistId,
    date,
  });

  const responseData = createdSession.toJSON();
  responseData._id = createdSession.id;

  res.status(201).json(responseData);
};

// @desc    Get user's therapy sessions (For Patient)
// @route   GET /api/therapy/my-sessions
// @access  Private
const getPatientSessions = async (req, res) => {
  const sessions = await TherapySession.findAll({
    where: { patientId: req.user.id },
    include: [{ model: User, as: 'therapist', attributes: ['name', 'email'] }]
  });

  const formatted = sessions.map(s => {
    const session = s.toJSON();
    session._id = session.id;
    return session;
  });

  res.json(formatted);
};

// @desc    Get therapist's assigned sessions
// @route   GET /api/therapy/therapist-sessions
// @access  Private/Therapist
const getTherapistSessions = async (req, res) => {
  const sessions = await TherapySession.findAll({
    where: { therapistId: req.user.id },
    include: [{ model: User, as: 'patient', attributes: ['name', 'email'] }]
  });

  const formatted = sessions.map(s => {
    const session = s.toJSON();
    session._id = session.id;
    return session;
  });

  res.json(formatted);
};

// @desc    Get list of all therapists (For Patients to choose from)
// @route   GET /api/therapy/therapists
// @access  Private
const getTherapists = async (req, res) => {
  const therapists = await User.findAll({
    where: { role: 'therapist' },
    attributes: { exclude: ['password'] }
  });

  const formatted = therapists.map(t => {
    const therapist = t.toJSON();
    therapist._id = therapist.id;
    return therapist;
  });

  res.json(formatted);
};

// @desc    Update session status (completed, cancelled, etc.)
// @route   PUT /api/therapy/session/:id/status
// @access  Private/Therapist
const updateSessionStatus = async (req, res) => {
  const { status } = req.body;
  const session = await TherapySession.findByPk(req.params.id);

  if (session) {
    if (session.therapistId.toString() !== req.user.id.toString()) {
      res.status(401).json({ message: 'Not authorized to update this session' });
      return;
    }
    session.status = status;
    const updatedSession = await session.save();
    
    const responseData = updatedSession.toJSON();
    responseData._id = updatedSession.id;

    res.json(responseData);
  } else {
    res.status(404).json({ message: 'Session not found' });
  }
};

export { bookSession, getPatientSessions, getTherapistSessions, getTherapists, updateSessionStatus };
