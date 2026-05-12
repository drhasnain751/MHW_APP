import express from 'express';
import { 
  bookSession, 
  getPatientSessions, 
  getTherapistSessions,
  getTherapists,
  updateSessionStatus
} from '../controllers/therapyController.js';
import { protect, therapist } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/therapists').get(protect, getTherapists);
router.route('/book').post(protect, bookSession);
router.route('/my-sessions').get(protect, getPatientSessions);
router.route('/therapist-sessions').get(protect, therapist, getTherapistSessions);
router.route('/session/:id/status').put(protect, therapist, updateSessionStatus);

export default router;
