import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import FullLogBook from './FullLogBook.jsx'
import { getDashboardStatsThunk, getRoomOccupancyThunk, getRoomUsersThunk } from '../../store/admin/dashboard/dashboardThunk.js'
import { getRecentLogbookEntriesThunk } from '../../store/admin/logbook/logbookThunk.js'
import { getComplaintStatsThunk } from '../../store/admin/complaint/complaintThunk.js'
import RoomUsers from '../../Components/admin/RoomUsers.jsx'

const AdminDashBoard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFullLogBook, setShowFullLogBook] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  
  // Get data from Redux store
  const { 
    rooms, 
    stats, 
    isLoading: dashboardLoading 
  } = useSelector((state) => state.adminDashboard)
  
  const { 
    recentEntries, 
    isLoading: logbookLoading 
  } = useSelector((state) => state.adminLogbook)
  
  const { 
    stats: complaintStats, 
    isLoading: complaintsLoading 
  } = useSelector((state) => state.adminComplaint)

  // Fetch all data on mount
  useEffect(() => {
    dispatch(getRoomOccupancyThunk())
    dispatch(getDashboardStatsThunk())
    dispatch(getRecentLogbookEntriesThunk(5))
    dispatch(getComplaintStatsThunk())
  }, [dispatch])

  // Auto-refresh every 60 seconds for dashboard and complaints
  useEffect(() => {
    const dashboardInterval = setInterval(() => {
      dispatch(getRoomOccupancyThunk())
      dispatch(getDashboardStatsThunk())
      dispatch(getComplaintStatsThunk())
    }, 60000) // 60 seconds

    return () => clearInterval(dashboardInterval)
  }, [dispatch])

  // Auto-refresh every 30 seconds for logbook (more frequent)
  useEffect(() => {
    const logbookInterval = setInterval(() => {
      // dispatch(getRecentLogbookEntriesThunk(5))
    }, 30000) // 30 seconds

    return () => clearInterval(logbookInterval)
  }, [dispatch])

  // Refetch on window focus
  useEffect(() => {
    const handleFocus = () => {
      dispatch(getRoomOccupancyThunk())
      dispatch(getDashboardStatsThunk())
      dispatch(getRecentLogbookEntriesThunk(5))
      dispatch(getComplaintStatsThunk())
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [dispatch])

  // Filter rooms based on search
  const filteredRooms = (rooms || []).filter(room => 
    room.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Handle room click
  const handleRoomClick = async (room) => {
    try {
       setSelectedRoom(room?.roomNo)
    } catch (error) {
      console.error('Error fetching room users:', error)
      toast.error(error || 'Failed to load room data')
    }
  }

  const handleBackToRooms = () => {
    setSelectedRoom(null)
  }

  // If a room is selected, show the RoomUsers component
  if (selectedRoom) {
    return (
      <RoomUsers 
        roomNo= {selectedRoom}
        onBack={handleBackToRooms}
      />
    )
  }

  // If showing full logbook, render that component
  if (showFullLogBook) {
    return <FullLogBook onBack={() => setShowFullLogBook(false)} />
  }

  // Loading state
  if (dashboardLoading || logbookLoading || complaintsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by room number or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Statistics Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Hostel Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Strength:</span>
                <span className="font-bold text-blue-600">{stats?.totalStrength || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Present Students:</span>
                <span className="font-bold text-green-600">{stats?.presentStudents || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Absent Students:</span>
                <span className="font-bold text-red-600">{stats?.absentStudents || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Rooms:</span>
                <span className="font-bold text-purple-600">{stats?.totalRooms || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Occupied Rooms:</span>
                <span className="font-bold text-orange-600">{stats?.occupiedRooms || 0}</span>
              </div>
            </div>
          </div>

          {/* Complaints Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Complaints & Notifications</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Complaints</span>
                <span className="font-bold text-orange-600">{complaintStats?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-red-600">{complaintStats?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Resolved</span>
                <span className="font-bold text-green-600">{complaintStats?.resolved || 0}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/complaints')}
              className="w-full mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              View All Complaints
            </button>
          </div>

          {/* LogBook Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Recent LogBook Entries</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {(recentEntries || []).length > 0 ? (
                recentEntries.map((entry) => (
                  <div key={entry.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{entry.name}</p>
                        <p className="text-xs text-gray-600">Room {entry.room}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          entry.action === 'Check Out' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {entry.action}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{entry.time}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{entry.destination}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No recent logbook entries</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowFullLogBook(true)}
              className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              View Full LogBook
            </button>
          </div>
        </div>

        {/* Room Cards - 32 Cards, 4 per row */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Room Occupancy Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredRooms.map((room) => {
              const presentCount = room.present.filter(p => p).length
              const occupancyRate = (presentCount / room.members) * 100
              
              return (
                <div 
                  key={room.roomNo} 
                  onClick={() => handleRoomClick(room)}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-lg text-gray-900">Room {room.roomNo}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      presentCount === room.members 
                        ? 'bg-green-100 text-green-800' 
                        : presentCount === 0 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {presentCount}/{room.members}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="space-y-1">
                      {room.names
                        .filter((name, index) => room.present[index])
                        .map((name, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{name}</span>
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Show message if no rooms found */}
          {filteredRooms.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No rooms found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard