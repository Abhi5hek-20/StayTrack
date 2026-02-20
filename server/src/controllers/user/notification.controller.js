import Notification from '../../models/notification.model.js'

// Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query
    const userId = req.user._id

    const filter = { userId }
    if (unreadOnly === 'true') {
      filter.isRead = false
    }

    const notifications = await Notification.find(filter)
      .populate('announcementId', 'title category priority')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await Notification.countDocuments(filter)
    const unreadCount = await Notification.countDocuments({ userId, isRead: false })

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        unreadCount
      }
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    })
  }
}

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params
    const userId = req.user._id

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }

    res.status(200).json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    })
  }
}

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id

    await Notification.updateMany(
      { userId, isRead: false },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    )

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    })
  }
}

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id
    const count = await Notification.countDocuments({ userId, isRead: false })

    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    })
  } catch (error) {
    console.error('Error getting unread count:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    })
  }
}

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params
    const userId = req.user._id

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    })

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
