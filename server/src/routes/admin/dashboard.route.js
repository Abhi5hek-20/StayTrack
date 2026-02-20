import express from 'express';
import { getRoomOccupancy, getDashboardStats, getRoomUsers } from '../../controllers/admin/dashboard.controller.js';
import { getRecentLogbookEntries, getLogbookStats } from '../../controllers/admin/logbook.controller.js';
import { protectedRoute } from '../../middleware/adminAuth.middleware.js';

const router = express.Router();

// Get room occupancy data
router.get('/rooms', protectedRoute, getRoomOccupancy);

// Get detailed user data for a specific room
router.get('/rooms/:roomNo/users', protectedRoute, getRoomUsers);

// Get dashboard statistics
router.get('/stats', protectedRoute, getDashboardStats);

// Get recent logbook entries
router.get('/logbook', protectedRoute, getRecentLogbookEntries);

// Get logbook statistics
router.get('/logbook/stats', protectedRoute, getLogbookStats);

export default router;
