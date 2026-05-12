import Assessment from '../models/Assessment.js';

// @desc    Submit an assessment
// @route   POST /api/assessments
// @access  Private
const submitAssessment = async (req, res) => {
  const { type, score, severity, answers } = req.body;

  if (!type || score === undefined || !severity) {
    res.status(400).json({ message: 'Please provide type, score, and severity.' });
    return;
  }

  const createdAssessment = await Assessment.create({
    userId: req.user.id,
    type,
    score,
    severity,
    answers
  });

  const responseData = createdAssessment.toJSON();
  responseData._id = createdAssessment.id;

  res.status(201).json(responseData);
};

// @desc    Get user's assessments
// @route   GET /api/assessments
// @access  Private
const getAssessments = async (req, res) => {
  const assessments = await Assessment.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']]
  });

  const formatted = assessments.map(a => {
    const assessment = a.toJSON();
    assessment._id = assessment.id;
    return assessment;
  });

  res.json(formatted);
};

export { submitAssessment, getAssessments };
