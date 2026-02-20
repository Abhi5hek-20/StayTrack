import Announcement from '../../models/admin/announcement.model.js'
import Admin from '../../models/admin/admin.model.js'
import Notification from '../../models/notification.model.js'

// Get all announcements with filtering and pagination
export const getAnnouncements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      priority,
      category,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    // Build filter object
    const filter = {}
    
    if (priority) filter.priority = priority
    if (category) filter.category = category
    if (isActive !== undefined) filter.isActive = isActive === 'true'
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Get announcements with pagination
    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    // Get total count for pagination
    const totalCount = await Announcement.countDocuments(filter)
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit))
    const hasNextPage = parseInt(page) < totalPages
    const hasPrevPage = parseInt(page) > 1

    res.status(200).json({
      success: true,
      data: {
        announcements,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    })
  }
}

// Get active announcements for users
export const getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.getActiveAnnouncements()
      .populate('createdBy', 'fullName')
      .lean()

    res.status(200).json({
      success: true,
      data: announcements
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active announcements',
      error: error.message
    })
  }
}

// Get announcement by ID
export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params
    
    const announcement = await Announcement.findById(id)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .populate('viewedBy.user', 'fullName email')

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      })
    }

    res.status(200).json({
      success: true,
      data: announcement
    })
  } catch (error) {
    console.error('Error fetching announcement:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement',
      error: error.message
    })
  }
}

// Create new announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority, category, expiryDate, createdDate } = req.body
    const adminId = req.user._id // Changed from req.admin._id to req.user._id

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      })
    }

    // Create announcement
    const announcementData = {
      title: title.trim(),
      content: content.trim(),
      priority: priority || 'medium',
      category: category || 'general',
      createdBy: adminId
    }

    // Add custom creation date if provided
    if (createdDate) {
      const created = new Date(createdDate)
      // Admin can set any date - no restrictions
      announcementData.createdDate = created
    }

    // Add expiry date if provided
    if (expiryDate) {
      const expiry = new Date(expiryDate)
      const compareDate = createdDate ? new Date(createdDate) : new Date()
      
      if (expiry < compareDate) {
        return res.status(400).json({
          success: false,
          message: 'Expiry date must be on or after the created date'
        })
      }
      announcementData.expiryDate = expiry
    }

    const announcement = new Announcement(announcementData)
    await announcement.save()

    // Populate creator info for response
    await announcement.populate('createdBy', 'fullName email')

    // Create notifications for all users
    try {
      const notificationData = {
        title: `New ${category} announcement`,
        message: content, // Use the full announcement content instead of just title
        type: category,
        priority: priority || 'medium',
        announcementId: announcement._id
      }

      // Create notifications for all users
      await Notification.createForAllUsers(notificationData)

      // Send real-time notification via Socket.io
      if (global.io) {
        global.io.emit('new-announcement', {
          id: announcement._id,
          title: announcement.title,
          message: announcement.content,
          category: announcement.category,
          priority: announcement.priority,
          createdAt: announcement.createdAt,
          type: 'announcement'
        })
      }
    } catch (notificationError) {
      // Don't fail the announcement creation if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    })
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message
    })
  }
}

// Update announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, priority, category, expiryDate, createdDate, isActive } = req.body
    const adminId = req.user._id // Changed from req.admin._id to req.user._id

    // Find announcement
    const announcement = await Announcement.findById(id)
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      })
    }

    // Update fields
    if (title !== undefined) announcement.title = title.trim()
    if (content !== undefined) announcement.content = content.trim()
    if (priority !== undefined) announcement.priority = priority
    if (category !== undefined) announcement.category = category
    if (isActive !== undefined) announcement.isActive = isActive
    
    // Handle created date
    if (createdDate !== undefined) {
      if (createdDate === null || createdDate === '') {
        announcement.createdDate = new Date() // Reset to current time
      } else {
        const created = new Date(createdDate)
        // Admin can set any date - no restrictions
        announcement.createdDate = created
      }
    }
    
    // Handle expiry date
    if (expiryDate !== undefined) {
      if (expiryDate === null || expiryDate === '') {
        announcement.expiryDate = null
      } else {
        const expiry = new Date(expiryDate)
        const compareDate = announcement.createdDate
        
        if (expiry < compareDate) {
          return res.status(400).json({
            success: false,
            message: 'Expiry date must be on or after the created date'
          })
        }
        announcement.expiryDate = expiry
      }
    }

    // Set updatedBy
    announcement.updatedBy = adminId

    await announcement.save()

    // Populate for response
    await announcement.populate([
      { path: 'createdBy', select: 'fullName email' },
      { path: 'updatedBy', select: 'fullName email' }
    ])

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    })
  } catch (error) {
    console.error('Error updating announcement:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update announcement',
      error: error.message
    })
  }
}

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params

    const announcement = await Announcement.findById(id)
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      })
    }

    // Delete the announcement
    await Announcement.findByIdAndDelete(id)

    // Delete all related notifications
    try {
      const deletedNotifications = await Notification.deleteByAnnouncementId(id)

      // Send real-time notification to all users about deleted announcement
      if (global.io) {
        global.io.emit('announcement-deleted', {
          announcementId: id,
          title: announcement.title,
          message: 'An announcement has been removed'
        })
      }
    } catch (notificationError) {
      // Don't fail the announcement deletion if notification deletion fails
    }

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
      error: error.message
    })
  }
}

// Toggle announcement active status
export const toggleAnnouncementStatus = async (req, res) => {
  try {
    const { id } = req.params
    const adminId = req.user._id // Changed from req.admin._id to req.user._id

    const announcement = await Announcement.findById(id)
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      })
    }

    announcement.isActive = !announcement.isActive
    announcement.updatedBy = adminId
    await announcement.save()

    res.status(200).json({
      success: true,
      message: `Announcement ${announcement.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: announcement.isActive }
    })
  } catch (error) {
    console.error('Error toggling announcement status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to toggle announcement status',
      error: error.message
    })
  }
}

// Get announcement statistics
export const getAnnouncementStats = async (req, res) => {
  try {
    const totalAnnouncements = await Announcement.countDocuments()
    const activeAnnouncements = await Announcement.countDocuments({ isActive: true })
    const expiredAnnouncements = await Announcement.countDocuments({
      expiryDate: { $lte: new Date() }
    })
    const highPriorityAnnouncements = await Announcement.countDocuments({
      priority: 'high',
      isActive: true
    })

    // Get expiring announcements (within 7 days)
    const expiringAnnouncements = await Announcement.getExpiringAnnouncements(7)

    // Get recent announcements (last 5)
    const recentAnnouncements = await Announcement.find({ isActive: true })
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    // Get category breakdown
    const categoryStats = await Announcement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Get priority breakdown
    const priorityStats = await Announcement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalAnnouncements,
          activeAnnouncements,
          expiredAnnouncements,
          highPriorityAnnouncements,
          expiringCount: expiringAnnouncements.length
        },
        expiringAnnouncements,
        recentAnnouncements,
        categoryStats,
        priorityStats
      }
    })
  } catch (error) {
    console.error('Error fetching announcement statistics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement statistics',
      error: error.message
    })
  }
}

// Mark announcement as viewed by user (for user-side usage)
export const markAnnouncementAsViewed = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id // Assuming user authentication middleware

    const announcement = await Announcement.findById(id)
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      })
    }

    await announcement.markAsViewed(userId)

    res.status(200).json({
      success: true,
      message: 'Announcement marked as viewed'
    })
  } catch (error) {
    console.error('Error marking announcement as viewed:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to mark announcement as viewed',
      error: error.message
    })
  }
}

// Get announcements by category
export const getAnnouncementsByCategory = async (req, res) => {
  try {
    const { category } = req.params

    const announcements = await Announcement.getByCategory(category)
      .populate('createdBy', 'fullName')
      .lean()

    res.status(200).json({
      success: true,
      data: announcements
    })
  } catch (error) {
    console.error('Error fetching announcements by category:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements by category',
      error: error.message
    })
  }
}

// Get announcements by priority
export const getAnnouncementsByPriority = async (req, res) => {
  try {
    const { priority } = req.params

    const announcements = await Announcement.getByPriority(priority)
      .populate('createdBy', 'fullName')
      .lean()

    res.status(200).json({
      success: true,
      data: announcements
    })
  } catch (error) {
    console.error('Error fetching announcements by priority:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements by priority',
      error: error.message
    })
  }
}
