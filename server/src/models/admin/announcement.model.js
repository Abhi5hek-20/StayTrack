import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  content: {
    type: String,
    required: [true, 'Announcement content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be either low, medium, or high'
    },
    default: 'medium'
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['general', 'maintenance', 'facility', 'emergency', 'event'],
      message: 'Category must be one of: general, maintenance, facility, emergency, event'
    },
    default: 'general'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdDate: {
    type: Date,
    default: Date.now
    // Removed validation - admin can set any date
  },
  
  expiryDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(value) {
        // If expiryDate is provided, it should be on or after createdDate
        if (value && this.createdDate) {
          return value >= this.createdDate
        }
        return true
      },
      message: 'Expiry date must be on or after the created date'
    }
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Creator admin ID is required']
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  
  viewedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // For tracking announcement performance
  stats: {
    totalViews: {
      type: Number,
      default: 0
    },
    uniqueViews: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual field to check if announcement is expired
announcementSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false
  return new Date() > this.expiryDate
})

// Virtual field to get announcement age in days
announcementSchema.virtual('ageInDays').get(function() {
  const now = new Date()
  const created = this.createdAt
  const diffTime = Math.abs(now - created)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual field to get days until expiry
announcementSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null
  const now = new Date()
  const expiry = this.expiryDate
  const diffTime = expiry - now
  if (diffTime <= 0) return 0
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Index for better query performance
announcementSchema.index({ createdAt: -1 })
announcementSchema.index({ priority: 1, isActive: 1 })
announcementSchema.index({ category: 1, isActive: 1 })
announcementSchema.index({ expiryDate: 1 })
announcementSchema.index({ isActive: 1, createdAt: -1 })

// Pre-save middleware to update the updatedBy field
announcementSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date()
  }
  next()
})

// Pre-save middleware to automatically deactivate expired announcements
announcementSchema.pre('save', function(next) {
  if (this.expiryDate && new Date() > this.expiryDate) {
    this.isActive = false
  }
  next()
})

// Static method to get active announcements
announcementSchema.statics.getActiveAnnouncements = function() {
  return this.find({ 
    isActive: true,
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: new Date() } }
    ]
  }).sort({ priority: 1, createdAt: -1 })
}

// Static method to get announcements by priority
announcementSchema.statics.getByPriority = function(priority) {
  return this.find({ 
    priority: priority,
    isActive: true,
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: new Date() } }
    ]
  }).sort({ createdAt: -1 })
}

// Static method to get announcements by category
announcementSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category: category,
    isActive: true,
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: new Date() } }
    ]
  }).sort({ createdAt: -1 })
}

// Static method to get expiring announcements
announcementSchema.statics.getExpiringAnnouncements = function(days = 7) {
  const expiryThreshold = new Date()
  expiryThreshold.setDate(expiryThreshold.getDate() + days)
  
  return this.find({
    isActive: true,
    expiryDate: {
      $exists: true,
      $lte: expiryThreshold,
      $gt: new Date()
    }
  }).sort({ expiryDate: 1 })
}

// Instance method to mark as viewed by a user
announcementSchema.methods.markAsViewed = function(userId) {
  // Check if user already viewed this announcement
  const alreadyViewed = this.viewedBy.some(view => 
    view.user.toString() === userId.toString()
  )
  
  if (!alreadyViewed) {
    this.viewedBy.push({
      user: userId,
      viewedAt: new Date()
    })
    this.stats.uniqueViews += 1
  }
  
  this.stats.totalViews += 1
  return this.save()
}

// Instance method to toggle active status
announcementSchema.methods.toggleActive = function() {
  this.isActive = !this.isActive
  return this.save()
}

const Announcement = mongoose.model('Announcement', announcementSchema)

export default Announcement
