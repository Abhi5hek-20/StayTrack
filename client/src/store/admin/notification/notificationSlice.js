import { createSlice } from '@reduxjs/toolkit'
import {
  getAllNotificationsThunk,
  getNotificationStatsThunk,
  createNotificationThunk,
  createNotificationForAllUsersThunk,
  deleteNotificationThunk,
  deleteAllNotificationsThunk
} from './notificationThunk'

const loadNotificationsFromStorage = () => {
  try {
    const saved = localStorage.getItem('adminNotifications')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    localStorage.removeItem('adminNotifications')
    return []
  }
}

const saveNotificationsToStorage = (notifications) => {
  if (notifications.length > 0) {
    localStorage.setItem('adminNotifications', JSON.stringify(notifications))
  } else {
    localStorage.removeItem('adminNotifications')
  }
}

const adminNotificationSlice = createSlice({
  name: 'adminNotifications',
  initialState: {
    realtimeNotifications: loadNotificationsFromStorage(),
    unreadCount: loadNotificationsFromStorage().filter(n => !n.isRead).length,
    dbNotifications: [],
    stats: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    addRealtimeNotification: (state, action) => {
      state.realtimeNotifications.unshift(action.payload)
      state.unreadCount += 1
      saveNotificationsToStorage(state.realtimeNotifications)
    },
    
    markAsRead: (state, action) => {
      const notification = state.realtimeNotifications.find(n => n.id === action.payload)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
        saveNotificationsToStorage(state.realtimeNotifications)
      }
    },
    
    markAllAsRead: (state) => {
      state.realtimeNotifications.forEach(n => n.isRead = true)
      state.unreadCount = 0
      saveNotificationsToStorage(state.realtimeNotifications)
    },
    
    clearAllRealtimeNotifications: (state) => {
      state.realtimeNotifications = []
      state.unreadCount = 0
      localStorage.removeItem('adminNotifications')
    },
    
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Get All Notifications
    builder
      .addCase(getAllNotificationsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllNotificationsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.dbNotifications = action.payload
        state.error = null
      })
      .addCase(getAllNotificationsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Get Notification Stats
    builder
      .addCase(getNotificationStatsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getNotificationStatsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
        state.error = null
      })
      .addCase(getNotificationStatsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Create Notification
    builder
      .addCase(createNotificationThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createNotificationThunk.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(createNotificationThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Create Notification For All
    builder
      .addCase(createNotificationForAllUsersThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createNotificationForAllUsersThunk.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(createNotificationForAllUsersThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Delete Notification
    builder
      .addCase(deleteNotificationThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.dbNotifications = state.dbNotifications.filter(
          n => n.id !== action.payload.notificationId
        )
        state.error = null
      })
      .addCase(deleteNotificationThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Delete All Notifications
    builder
      .addCase(deleteAllNotificationsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteAllNotificationsThunk.fulfilled, (state) => {
        state.isLoading = false
        state.dbNotifications = []
        state.error = null
      })
      .addCase(deleteAllNotificationsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const {
  addRealtimeNotification,
  markAsRead,
  markAllAsRead,
  clearAllRealtimeNotifications,
  clearError
} = adminNotificationSlice.actions

export default adminNotificationSlice.reducer