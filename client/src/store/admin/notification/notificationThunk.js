import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../lib/axiosInstance'


/**
 * Get all notifications with filters
 */
export const getAllNotificationsThunk = createAsyncThunk(
  'admin/notifications/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/notifications', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notifications'
      )
    }
  }
)

/**
 * Get notification statistics
 */
export const getNotificationStatsThunk = createAsyncThunk(
  'admin/notifications/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/notifications/stats')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notification stats'
      )
    }
  }
)

/**
 * Create notification for specific users
 */
export const createNotificationThunk = createAsyncThunk(
  'admin/notifications/create',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin/notifications/create', notificationData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create notification'
      )
    }
  }
)

/**
 * Create notification for all users
 */
export const createNotificationForAllUsersThunk = createAsyncThunk(
  'admin/notifications/createForAll',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin/notifications/create-all', notificationData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create notification for all users'
      )
    }
  }
)

/**
 * Delete specific notification
 */
export const deleteNotificationThunk = createAsyncThunk(
  'admin/notifications/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/admin/notifications/${notificationId}`)
      return { notificationId, ...response.data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete notification'
      )
    }
  }
)

/**
 * Delete all notifications
 */
export const deleteAllNotificationsThunk = createAsyncThunk(
  'admin/notifications/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete('/admin/notifications/all/clear')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete all notifications'
      )
    }
  }
)