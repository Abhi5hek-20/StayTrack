import LogBook from '../../models/user/logbook.model.js'

// Create a new log entry (Check Out)
export const checkOut = async (req, res) => {
  try {
    const { name, phoneNumber, permission, outTime, reason } = req.body
    const userId = req.user._id

    const logEntry = new LogBook({
      name,
      phoneNumber,
      permission,
      outTime: outTime ? new Date(outTime) : new Date(),
      reason,
      userId
    })

    await logEntry.save()

    res.status(201).json({
      success: true,
      message: 'Check out recorded successfully',
      data: logEntry
    })
  } catch (error) {
    console.error('Check out error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to record check out',
      error: error.message
    })
  }
}

// Update log entry with check in time
export const checkIn = async (req, res) => {
  try {
    const { logId } = req.params
    const { inTime } = req.body
    const userId = req.user._id

    const logEntry = await LogBook.findOne({ _id: logId, userId })
    
    if (!logEntry) {
      return res.status(404).json({
        success: false,
        message: 'Log entry not found'
      })
    }

    if (logEntry.inTime) {
      return res.status(400).json({
        success: false,
        message: 'User has already checked in'
      })
    }

    logEntry.inTime = inTime ? new Date(inTime) : new Date()
    await logEntry.save()

    res.status(200).json({
      success: true,
      message: 'Check in recorded successfully',
      data: logEntry
    })
  } catch (error) {
    console.error('Check in error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to record check in',
      error: error.message
    })
  }
}

// Get all log entries for a user
export const getLogEntries = async (req, res) => {
  try {
    const userId = req.user._id
    const { page = 1, limit = 20, status } = req.query

    let query = { userId }
    
    // Filter by status if provided
    if (status === 'out') {
      query.inTime = null
    } else if (status === 'in') {
      query.inTime = { $ne: null }
    }

    const logEntries = await LogBook.find(query)
      .sort({ outTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'fullName email')

    const total = await LogBook.countDocuments(query)

    res.status(200).json({
      success: true,
      data: logEntries,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Get log entries error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch log entries',
      error: error.message
    })
  }
}

// Get currently out users
export const getCurrentlyOut = async (req, res) => {
  try {
    const userId = req.user._id

    const currentlyOut = await LogBook.find({
      userId,
      inTime: null
    }).sort({ outTime: -1 })

    res.status(200).json({
      success: true,
      data: currentlyOut
    })
  } catch (error) {
    console.error('Get currently out error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch currently out entries',
      error: error.message
    })
  }
}

// Get log statistics
export const getLogStats = async (req, res) => {
  try {
    const userId = req.user._id

    const currentlyOut = await LogBook.countDocuments({
      userId,
      inTime: null
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const returnedToday = await LogBook.countDocuments({
      userId,
      inTime: { $gte: today, $lt: tomorrow }
    })

    const totalEntries = await LogBook.countDocuments({ userId })

    res.status(200).json({
      success: true,
      data: {
        currentlyOut,
        returnedToday,
        totalEntries
      }
    })
  } catch (error) {
    console.error('Get log stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch log statistics',
      error: error.message
    })
  }
}
