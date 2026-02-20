import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  announcementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement',
    default: null
  },
  type: {
    type: String,
    enum: ['announcement', 'complaint', 'contact', 'general'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
})

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1 })
notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ type: 1, createdAt: -1 })

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ userId, isRead: false })
}

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { userId, isRead: false },
    { isRead: true, updatedAt: new Date() }
  )
}

// Static method to create notification for all users (for announcements)
notificationSchema.statics.createForAllUsers = async function(notificationData) {
  const User = mongoose.model('User')
  const users = await User.find({ isActive: true }, '_id')
  
  const notifications = users.map(user => ({
    ...notificationData,
    userId: user._id
  }))
  
  return await this.insertMany(notifications)
}

// Static method to create notification for specific users
notificationSchema.statics.createForUsers = async function(userIds, notificationData) {
  const notifications = userIds.map(userId => ({
    ...notificationData,
    userId
  }))
  
  return await this.insertMany(notifications)
}

// Static method to delete notifications by announcement ID
notificationSchema.statics.deleteByAnnouncementId = async function(announcementId) {
  return await this.deleteMany({ announcementId })
}

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
