import express from 'express'
import { getActiveAnnouncements } from '../../controllers/admin/announcement.controller.js'
import { protectedRoute } from '../../middleware/auth.middleware.js'

const router = express.Router()

// Get active announcements for users (requires user authentication)
router.get('/', protectedRoute, getActiveAnnouncements)

export default router