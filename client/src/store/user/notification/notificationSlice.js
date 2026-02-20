import { createSlice } from '@reduxjs/toolkit'
import {
  getUserNotificationsThunk,
  markNotificationAsReadThunk,
  markAllNotificationsAsReadThunk,
  deleteNotificationThunk,
  getUnreadNotificationCountThunk
} from './notificationThunk'

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Manual actions if needed
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get user notifications
      .addCase(getUserNotificationsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getUserNotificationsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter(n => !n.isRead).length
      })
      .addCase(getUserNotificationsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Mark as read
      .addCase(markNotificationAsReadThunk.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload.notificationId)
        if (notification) {
          notification.isRead = true
          state.unreadCount = state.notifications.filter(n => !n.isRead).length
        }
      })

      // Mark all as read
      .addCase(markAllNotificationsAsReadThunk.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({
          ...n,
          isRead: true
        }))
        state.unreadCount = 0
      })

      // Delete notification
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          n => n._id !== action.payload.notificationId
        )
        state.unreadCount = state.notifications.filter(n => !n.isRead).length
      })

      // Get unread count
      .addCase(getUnreadNotificationCountThunk.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count || 0
      })
  }
})

export const { clearNotifications, clearError } = notificationSlice.actions
export default notificationSlice.reducer