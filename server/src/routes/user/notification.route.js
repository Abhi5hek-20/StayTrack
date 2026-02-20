import express from 'express'
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification 
} from '../../controllers/user/notification.controller.js'
import { protectedRoute } from '../../middleware/auth.middleware.js'

const router = express.Router()

// All routes are protected (require authentication)
router.use(protectedRoute)

// Get user notifications
router.get('/', getUserNotifications)

// Get unread count
router.get('/unread-count', getUnreadCount)

// Mark notification as read
router.patch('/:notificationId/read', markNotificationAsRead)

// Mark all notifications as read
router.patch('/mark-all-read', markAllNotificationsAsRead)

// Delete notification
router.delete('/:notificationId', deleteNotification)

export default router
