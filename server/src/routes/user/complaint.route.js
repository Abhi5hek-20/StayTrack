import express from 'express';
import { protectedRoute } from '../../middleware/auth.middleware.js';
import {
  createComplaint,
  checkComplaintStatus,
  updateComplaintStatus,
  getUserComplaints
} from '../../controllers/user/complaint.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protectedRoute);

// User routes
router.post('/create', createComplaint);
router.get('/my-complaints', getUserComplaints);
router.get('/:id/status', checkComplaintStatus);
router.patch('/:id/status', updateComplaintStatus);

export default router;
