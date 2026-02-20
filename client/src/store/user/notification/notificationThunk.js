import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../lib/axiosInstance'


/**
 * Get user notifications (announcements)
 * Handles localStorage for read/deleted state
 */
export const getUserNotificationsThunk = createAsyncThunk(
  'notification/getUserNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/announcements')
      
      // Get read and deleted notifications from localStorage
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]')
      const deletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications') || '[]')
      
      // Transform announcements to notification format
      const announcements = response.data.data || []
      const notifications = announcements
        .filter(announcement => !deletedNotifications.includes(announcement._id))
        .map(announcement => ({
          _id: announcement._id,
          title: announcement.title,
          message: announcement.content,
          type: announcement.category,
          priority: announcement.priority,
          category: announcement.category,
          isRead: readNotifications.includes(announcement._id),
          createdAt: announcement.createdAt,
          startDate: announcement.createdDate,
          expiryDate: announcement.expiryDate,
          createdBy: announcement.createdBy,
          updatedBy: announcement.updatedBy,
          isActive: announcement.isActive,
          announcementId: announcement._id
        }))
      
      return notifications
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notifications'
      )
    }
  }
)

/**
 * Mark notification as read (local storage)
 */
export const markNotificationAsReadThunk = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      // Get current notifications from localStorage
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]')
      
      if (!readNotifications.includes(notificationId)) {
        readNotifications.push(notificationId)
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications))
      }
      
      return { success: true, notificationId }
    } catch (error) {
      return rejectWithValue('Failed to mark notification as read')
    }
  }
)

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsReadThunk = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get all current notifications from Redux state
      const { notifications } = getState().user.notification
      const allNotificationIds = notifications.map(n => n._id)
      
      localStorage.setItem('readNotifications', JSON.stringify(allNotificationIds))
      
      return { success: true, allNotificationIds }
    } catch (error) {
      return rejectWithValue('Failed to mark all notifications as read')
    }
  }
)

/**
 * Delete notification (hide locally)
 */
export const deleteNotificationThunk = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      // Get current deleted notifications from localStorage
      const deletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications') || '[]')
      
      if (!deletedNotifications.includes(notificationId)) {
        deletedNotifications.push(notificationId)
        localStorage.setItem('deletedNotifications', JSON.stringify(deletedNotifications))
      }
      
      return { success: true, notificationId }
    } catch (error) {
      return rejectWithValue('Failed to delete notification')
    }
  }
)

/**
 * Get unread notification count
 */
export const getUnreadNotificationCountThunk = createAsyncThunk(
  'notification/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/notifications/unread-count')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch unread count'
      )
    }
  }
)