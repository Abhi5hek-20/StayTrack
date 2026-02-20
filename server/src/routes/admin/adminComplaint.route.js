import express from 'express';
import { protectedRoute } from '../../middleware/adminAuth.middleware.js';
import {
  getAllComplaints,
  updateComplaintStatusAdmin,
  getComplaintStats
} from '../../controllers/admin/adminComplaint.controller.js';

const router = express.Router();

// All routes require admin authentication
router.use(protectedRoute);

// Admin complaint routes
router.get('/', getAllComplaints);
router.get('/stats', getComplaintStats);
router.put('/:complaintId/status', updateComplaintStatusAdmin);

export default router;
