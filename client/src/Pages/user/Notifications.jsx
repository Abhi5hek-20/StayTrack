import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'

import { 
  BellIcon, 
  CheckIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'

import { 
  BellIcon as BellSolidIcon,
  CheckIcon as CheckSolidIcon
} from '@heroicons/react/24/solid'

import { deleteNotificationThunk,
         getUserNotificationsThunk,
        markAllNotificationsAsReadThunk,
        markNotificationAsReadThunk 
} from '../../store/user/notification/notificationThunk'


const Notifications = () => {
  const dispatch = useDispatch()
  
  // Get state from Redux store
  const { notifications, unreadCount, isLoading, error } = useSelector(
    (state) => state.notification
  )

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(getUserNotificationsThunk())
  }, [dispatch])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getUserNotificationsThunk())
    }, 30000)

    return () => clearInterval(interval)
  }, [dispatch])

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markNotificationAsReadThunk(notificationId)).unwrap()
      toast.success('Notification marked as read')
      // Refresh notifications to update UI
      dispatch(getUserNotificationsThunk())
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsReadThunk()).unwrap()
      toast.success('All notifications marked as read')
      // Refresh notifications to update UI
      dispatch(getUserNotificationsThunk())
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  // Delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await dispatch(deleteNotificationThunk(notificationId)).unwrap()
      toast.success('Notification deleted')
      // Refresh notifications to update UI
      dispatch(getUserNotificationsThunk())
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  // Get priority icon and color
  const getPriorityDetails = (priority) => {
    switch (priority) {
      case 'high':
        return { 
          icon: ExclamationTriangleIcon, 
          color: 'text-red-500', 
          bgColor: 'bg-red-50 border-red-200' 
        }
      case 'medium':
        return { 
          icon: InformationCircleIcon, 
          color: 'text-black', 
          bgColor: 'bg-green-50 border-green-600' 
        }
      case 'low':
        return { 
          icon: InformationCircleIcon, 
          color: 'text-blue-500', 
          bgColor: 'bg-blue-50 border-blue-200' 
        }
      default:
        return { 
          icon: SpeakerWaveIcon, 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-50 border-gray-200' 
        }
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    
    return date.toLocaleDateString()
  }

  // Format date without time (just date)
  const formatDateOnly = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">Failed to load notifications</p>
          <button 
            onClick={() => dispatch(getUserNotificationsThunk())}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8 border border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <BellSolidIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up! 🎉'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
              >
                <CheckSolidIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium">Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <BellIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No notifications yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                When you receive announcements from the admin, they'll appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const { icon: PriorityIcon, color, bgColor } = getPriorityDetails(notification.priority)
              
              return (
                <div
                  key={notification._id}
                  className={`bg-white rounded-xl shadow-lg border-l-4 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] sm:hover:scale-[1.02] ${
                    notification.isRead ? 'border-gray-300 opacity-75' : 'border-blue-500'
                  } ${bgColor} relative overflow-hidden`}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 opacity-5">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full transform translate-x-8 sm:translate-x-12 -translate-y-8 sm:-translate-y-12"></div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 relative">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col space-y-3 sm:space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className={`text-lg sm:text-lg font-bold mb-2 sm:mb-1 break-words ${
                              notification.isRead ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className={`text-sm leading-relaxed break-words ${
                              notification.isRead ? 'text-gray-600' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                          </div>
                          
                          {/* Buttons at top right for both mobile and desktop */}
                          <div className="flex items-start space-x-2 ml-2 flex-shrink-0">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
                                title="Mark as read"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteNotification(notification._id)}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                              title="Delete notification"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            notification.type === 'urgent' ? 'bg-red-100 text-red-800 border border-red-200' :
                            notification.type === 'maintenance' ? 'bg-gray-200 text-black-800' :
                            notification.type === 'event' ? 'bg-green-100 text-green-800 border border-green-200' :
                            notification.type === 'emergency' ? 'bg-red-100 text-red-800 border border-red-200' :
                            notification.type === 'facility' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {notification.category || notification.type}
                          </span>
                          {notification.startDate && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                              📅 Start: {formatDateOnly(notification.startDate)}
                            </span>
                          )}
                          {notification.expiryDate && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                              ⏰ End: {formatDateOnly(notification.expiryDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications