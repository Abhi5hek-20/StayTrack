import User from '../../models/user/user.model.js';

// Get room occupancy data
export const getRoomOccupancy = async (req, res) => {
  try {
    // Fetch all users with their room assignments
    const users = await User.find({}, 'fullName roomNo isPresent').lean();
    
    // Group users by room number
    const roomData = {};
    
    // Initialize the expected rooms (31 rooms total)
    // Floor 1-5: 101-106, 201-206, 301-306, 401-406, 501-506, and 507
    for (let floor = 1; floor <= 5; floor++) {
      let roomsOnFloor;
      if (floor === 5) {
        roomsOnFloor = 7; // 501-506 and 507
      } else {
        roomsOnFloor = 6; // 01-06 for floors 1-4
      }
      
      for (let room = 1; room <= roomsOnFloor; room++) {
        const roomNo = `${floor}${room.toString().padStart(2, '0')}`;
        roomData[roomNo] = {
          roomNo,
          members: 4, // Fixed capacity
          names: [],
          present: []
        };
      }
    }
    
    // Add any existing rooms from user data that don't match our expected format
    users.forEach(user => {
      if (user.roomNo && !roomData[user.roomNo]) {
        roomData[user.roomNo] = {
          roomNo: user.roomNo,
          members: 4, // Fixed capacity
          names: [],
          present: []
        };
      }
    });
    
    // Populate rooms with actual user data
    users.forEach(user => {
      if (user.roomNo && roomData[user.roomNo]) {
        roomData[user.roomNo].names.push(user.fullName);
        roomData[user.roomNo].present.push(user.isPresent || false);
      }
    });
    
    // Convert to array format and sort by room number
    const roomsArray = Object.values(roomData).sort((a, b) => {
      // Put standard format rooms first, then others
      const aIsStandard = /^[1-5]\d{2}$/.test(a.roomNo);
      const bIsStandard = /^[1-5]\d{2}$/.test(b.roomNo);
      
      if (aIsStandard && bIsStandard) {
        return a.roomNo.localeCompare(b.roomNo);
      } else if (aIsStandard) {
        return -1;
      } else if (bIsStandard) {
        return 1;
      } else {
        return a.roomNo.localeCompare(b.roomNo);
      }
    });
    
    res.status(200).json({
      success: true,
      rooms: roomsArray
    });
    
  } catch (error) {
    console.error('Error fetching room occupancy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room occupancy data'
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalStrength = 125; // Fixed total capacity
    const presentUsers = await User.countDocuments({ isPresent: true });
    const absentUsers = totalStrength - presentUsers;
    
    // Count occupied rooms (rooms with at least one user)
    const occupiedRooms = await User.distinct('roomNo', { roomNo: { $exists: true, $ne: null } });
    const totalRooms = 31; // Fixed total rooms
    
    const stats = {
      totalStrength: totalStrength,
      presentStudents: presentUsers,
      absentStudents: absentUsers,
      totalRooms: totalRooms,
      occupiedRooms: occupiedRooms.length
    };
    
    res.status(200).json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get detailed user data for a specific room
export const getRoomUsers = async (req, res) => {
  try {
    const { roomNo } = req.params;
    
    console.log('Fetching users for room:', roomNo);
    
    // Fetch all users in the specified room with detailed information
    const users = await User.find({ roomNo }, {
      password: 0 // Exclude password field
    }).lean();
    
    console.log('Found users:', users.length);
    console.log('Users data:', users);
    
    // Format the user data for the frontend
    const formattedUsers = users.map((user, index) => ({
      id: user._id,
      name: user.fullName || user.name || 'N/A',
      fullName: user.fullName || user.name || 'N/A',
      email: user.email || 'N/A',
      phno: user.phno || 'N/A',
      number: user.phno || 'N/A', // For backward compatibility
      studyYear: user.studyYear || 'N/A',
      roomNo: user.roomNo || roomNo,
      course: user.course || 'N/A',
      aadharNo: user.aadharNo || 'N/A',
      clgId: user.clgId || 'N/A',
      parentName: user.parentName || 'N/A',
      parentPhno: user.parentPhno || 'N/A',
      guardianName: user.guardianName || 'N/A',
      guardianPhno: user.guardianPhno || 'N/A',
      address: user.address || 'N/A',
      isPresent: user.isPresent || false,
      lastCheckIn: user.lastCheckIn || null,
      lastCheckOut: user.lastCheckOut || null,
      createdAt: user.createdAt || null,
      updatedAt: user.updatedAt || null,
      joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
    }));
    
    // console.log('Formatted users:', formattedUsers);
    
    // Create room data structure
    const roomData = {
      roomNo: roomNo,
      occupied: formattedUsers.filter(user => user.isPresent).length,
      capacity: 4, // Fixed capacity
      students: formattedUsers
    };
    
    res.status(200).json({
      success: true,
      room: roomData
    });
    
  } catch (error) {
    console.error('Error fetching room users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room user data'
    });
  }
};
