import express from 'express';
import { submitAssessment, getAssessments } from '../controllers/assessmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, submitAssessment).get(protect, getAssessments);

export default router;
