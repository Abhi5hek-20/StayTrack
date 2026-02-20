import LogBook from '../../models/user/logbook.model.js';
import User from '../../models/user/user.model.js';

// Get recent logbook entries
export const getRecentLogbookEntries = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default to 10, allow customization
    // Get the most recent logbook entries
    const logbookEntries = await LogBook.find()
      .populate('userId', 'fullName roomNo')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Format the data for the frontend
    const formattedEntries = logbookEntries.map(entry => {
      const isCurrentlyOut = entry.inTime === null;
      
      return {
        id: entry._id,
        name: entry.userId?.fullName || entry.name,
        room: entry.userId?.roomNo || 'N/A',
        action: isCurrentlyOut ? 'Check Out' : 'Check In',
        outTime: new Date(entry.outTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        inTime: entry.inTime 
          ? new Date(entry.inTime).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            })
          : null, // Show null if not checked in yet
        destination: entry.permission || 'Not specified',
        reason: entry.reason || 'NA',
        timestamp: entry.inTime || entry.outTime
      };
    });

    res.status(200).json({
      success: true,
      entries: formattedEntries
    });

  } catch (error) {
    console.error('Error fetching logbook entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logbook entries'
    });
  }
};

// Get logbook statistics
export const getLogbookStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEntriestoday = await LogBook.countDocuments({
      createdAt: { $gte: today }
    });
    
    const currentlyOut = await LogBook.countDocuments({
      inTime: null
    });
    
    const checkedInToday = await LogBook.countDocuments({
      inTime: { $gte: today, $ne: null }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalEntriesToday: totalEntriestoday,
        currentlyOut: currentlyOut,
        checkedInToday: checkedInToday
      }
    });

  } catch (error) {
    console.error('Error fetching logbook stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logbook statistics'
    });
  }
};
