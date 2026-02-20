import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  markAsRead,
  markAllAsRead,
  clearAllRealtimeNotifications
} from '../../store/admin/notification/notificationSlice'

const AdminNotifications = () => {
  const dispatch = useDispatch()
  const { realtimeNotifications, unreadCount } = useSelector(
    (state) => state.adminNotifications
  )
  const { isConnected } = useSelector((state) => state.socket)

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const handleClearAll = () => {
    dispatch(clearAllRealtimeNotifications())
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now - time
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contact':
        return '📧'
      case 'complaint':
        return '🎫'
      case 'announcement':
        return '📢'
      default:
        return '🔔'
    }
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
              >
                Mark All Read
              </button>
            )}
            {realtimeNotifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors duration-200 w-full sm:w-auto"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 sm:space-y-4">
          {realtimeNotifications.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔔</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No notifications yet</h3>
              <p className="text-sm sm:text-base text-gray-500">New contact messages and updates will appear here</p>
            </div>
          ) : (
            realtimeNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border-l-4 p-4 sm:p-6 transition-all duration-200 hover:shadow-md cursor-pointer ${
                  notification.isRead 
                    ? 'border-gray-300 opacity-75' 
                    : notification.type === 'contact'
                      ? 'border-blue-500 bg-blue-50/30'
                      : 'border-purple-500 bg-purple-50/30'
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="text-xl sm:text-2xl flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-2">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
                      {notification.message}
                    </p>

                    {/* Additional data for contact messages */}
                    {notification.type === 'contact' && notification.data && (
                      <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex flex-col sm:flex-row">
                            <span className="font-medium text-gray-600">Email:</span>
                            <span className="sm:ml-2 text-gray-800 break-all">{notification.data.email}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row">
                            <span className="font-medium text-gray-600">Room:</span>
                            <span className="sm:ml-2 text-gray-800">{notification.data.room}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-gray-600">Full Message:</span>
                          <p className="mt-1 text-gray-800 bg-white p-2 sm:p-3 rounded border text-sm sm:text-base leading-relaxed break-words">
                            {notification.data.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminNotifications