import express from 'express'
import { 
  getAllNotifications,
  createNotification,
  createNotificationForAllUsers,
  getNotificationStats,
  deleteNotification,
  deleteAllNotifications
} from '../../controllers/admin/adminNotification.controller.js'
import { protectedRoute } from '../../middleware/adminAuth.middleware.js'

const router = express.Router()

// All routes are protected and require admin access
router.use(protectedRoute)

// Get all notifications (admin view)
router.get('/', getAllNotifications)

// Get notification statistics
router.get('/stats', getNotificationStats)

// Create notification for specific users
router.post('/create', createNotification)

// Create notification for all users
router.post('/create-all', createNotificationForAllUsers)

// Delete specific notification
router.delete('/:notificationId', deleteNotification)

// Delete all notifications (admin only)
router.delete('/all/clear', deleteAllNotifications)

export default router
