import express from 'express'
import {
  getAnnouncements,
  getActiveAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
  getAnnouncementStats,
  getAnnouncementsByCategory,
  getAnnouncementsByPriority
} from '../../controllers/admin/announcement.controller.js'
import { protectedRoute } from '../../middleware/adminAuth.middleware.js'

const router = express.Router()

// Get announcement statistics (for dashboard)
router.get('/stats', protectedRoute, getAnnouncementStats)

// Get all announcements with filtering and pagination
router.get('/', protectedRoute, getAnnouncements)

// Get active announcements (public endpoint for users)
router.get('/active', getActiveAnnouncements)

// Get announcements by category
router.get('/category/:category', protectedRoute, getAnnouncementsByCategory)

// Get announcements by priority
router.get('/priority/:priority', protectedRoute, getAnnouncementsByPriority)

// Get specific announcement by ID
router.get('/:id', protectedRoute, getAnnouncementById)

// Create new announcement
router.post('/', protectedRoute, createAnnouncement)

// Update announcement
router.put('/:id', protectedRoute, updateAnnouncement)

// Toggle announcement active status
router.patch('/:id/toggle', protectedRoute, toggleAnnouncementStatus)

// Delete announcement
router.delete('/:id', protectedRoute, deleteAnnouncement)

export default router
