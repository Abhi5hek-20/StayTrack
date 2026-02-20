import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRoomUsersThunk } from '../../store/admin/dashboard/dashboardThunk'
import UserProfile from './UserProfile.jsx'
import { getPaymentHistoryOfSingleUserThunk } from '../../store/admin/payment/paymentThunk.js'
import { useNavigate } from 'react-router-dom'

const RoomUsers = ({ roomNo, onBack }) => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const navigate = useNavigate()

  // Get room users from Redux state
  const { roomUsers, isLoading } = useSelector((state) => state.adminDashboard)
  const users = roomUsers || []
  // console.log('Room Users:', users)

  // Fetch room users when component mounts or room changes
  useEffect(() => {
    if (roomNo) {
      dispatch(getRoomUsersThunk(roomNo))
    }
  }, [dispatch, roomNo])

  // Filter users based on search term
  const filteredUsers = users?.filter(user =>
    (user.name || user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.roomNo && user.roomNo.includes(searchTerm)) ||
    (user.studyYear || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleHistoryClick = async (user) => {

      const response =  await dispatch(getPaymentHistoryOfSingleUserThunk(user.id))
      // console.log("Payment history response in component:", response);
       if(response.payload.success){
         navigate(`/admin/user-payment-history`)
       }
    // Add history functionality here
  }

  const handleProfileClick = (user) => {
    setSelectedUser(user)
  }

  const handleBackToRoom = () => {
    setSelectedUser(null)
  }

  // If a user is selected for profile view, show the UserProfile component
  if (selectedUser) {
    return (
      <UserProfile 
        user={selectedUser} 
        onBack={handleBackToRoom}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Rooms
              </button>
            )}
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {roomNo ? `Room ${parseInt(roomNo)} - Users` : 'Room Users'}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-slate-600">Loading users...</p>
        </div>
      )}

      {/* Users Grid */}
      {!isLoading && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-indigo-200"
              >
                {/* Header with Name and Year */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {user.fullName || user.name || 'N/A'}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                      {user.studyYear || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">CONTACT</h4>
                  <div className="space-y-2">
                    <p className="text-slate-900 font-medium">{user.phno || user.number || 'N/A'}</p>
                    <p className="text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors">
                      {user.email || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Room & Course Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">ROOM & COURSE</h4>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-bold text-lg">Room {user.roomNo || 'N/A'}</p>
                    <p className="text-slate-600 text-sm">{user.course || 'N/A'}</p>
                  </div>
                </div>

                {/* Activity Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">ACTIVITY</h4>
                  <p className="text-slate-700">Joined {user.joinedDate || 'N/A'}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleHistoryClick(user)}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    History
                  </button>
                  
                  <button
                    onClick={() => handleProfileClick(user)}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293L16 14.586a1 1 0 01-.707.293h-2.586a1 1 0 00-.707.293L9 18.586a1 1 0 01-.707.293H6" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
              <p className="text-slate-600">No users match your search criteria. Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RoomUsers