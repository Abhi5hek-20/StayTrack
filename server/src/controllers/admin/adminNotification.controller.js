import Notification from '../../models/notification.model.js'
import User from '../../models/user/user.model.js'

// Get all notifications for admin (system-wide view)
export const getAllNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      isRead,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    // Build filter object
    const filter = {}
    if (type) filter.type = type
    if (isRead !== undefined) filter.isRead = isRead === 'true'
    if (priority) filter.priority = priority

    const notifications = await Notification.find(filter)
      .populate('userId', 'name email room phoneNumber')
      .populate('announcementId', 'title category priority')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await Notification.countDocuments(filter)
    const totalUnread = await Notification.countDocuments({ ...filter, isRead: false })

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          totalUnread
        }
      }
    })
  } catch (error) {
    console.error('Error fetching admin notifications:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    })
  }
}

// Create notification for specific users
export const createNotification = async (req, res) => {
  try {
    const { userIds, type, title, message, priority = 'medium', data = null } = req.body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'userIds array is required'
      })
    }

    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'type, title, and message are required'
      })
    }

    const notifications = await Notification.createForUsers(userIds, {
      type,
      title,
      message,
      priority,
      data
    })

    // Emit socket event to notify users
    if (global.io) {
      userIds.forEach(userId => {
        global.io.to(`user_${userId}`).emit('new-notification', {
          type,
          title,
          message,
          priority,
          data,
          createdAt: new Date()
        })
      })
    }

    res.status(201).json({
      success: true,
      message: `Notification sent to ${notifications.length} users`,
      data: { count: notifications.length }
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    })
  }
}

// Create notification for all users
export const createNotificationForAllUsers = async (req, res) => {
  try {
    const { type, title, message, priority = 'medium', data = null } = req.body

    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'type, title, and message are required'
      })
    }

    const notifications = await Notification.createForAllUsers({
      type,
      title,
      message,
      priority,
      data
    })

    // Emit socket event to all users
    if (global.io) {
      global.io.emit('new-notification', {
        type,
        title,
        message,
        priority,
        data,
        createdAt: new Date()
      })
    }

    res.status(201).json({
      success: true,
      message: `Notification sent to ${notifications.length} users`,
      data: { count: notifications.length }
    })
  } catch (error) {
    console.error('Error creating notification for all users:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    })
  }
}

// Get notification statistics
export const getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments()
    const unreadNotifications = await Notification.countDocuments({ isRead: false })
    const readNotifications = await Notification.countDocuments({ isRead: true })

    // Get stats by type
    const statsByType = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unread: {
            $sum: {
              $cond: [{ $eq: ['$isRead', false] }, 1, 0]
            }
          }
        }
      }
    ])

    // Get stats by priority
    const statsByPriority = await Notification.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          unread: {
            $sum: {
              $cond: [{ $eq: ['$isRead', false] }, 1, 0]
            }
          }
        }
      }
    ])

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentActivity = await Notification.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ])

    res.status(200).json({
      success: true,
      data: {
        total: totalNotifications,
        unread: unreadNotifications,
        read: readNotifications,
        readRate: totalNotifications > 0 ? ((readNotifications / totalNotifications) * 100).toFixed(1) : 0,
        byType: statsByType,
        byPriority: statsByPriority,
        recentActivity
      }
    })
  } catch (error) {
    console.error('Error fetching notification stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics',
      error: error.message
    })
  }
}

// Delete notification(s)
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params

    const notification = await Notification.findByIdAndDelete(notificationId)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    })
  }
}

// Delete all notifications (admin only)
export const deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({})

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} notifications`,
      data: { deletedCount: result.deletedCount }
    })
  } catch (error) {
    console.error('Error deleting all notifications:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete notifications',
      error: error.message
    })
  }
}
