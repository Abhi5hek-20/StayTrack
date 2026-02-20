import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../lib/axiosInstance'


/**
 * Get all announcements with filters
 */
export const getAnnouncementsThunk = createAsyncThunk(
  'admin/announcements/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/announcements', { params })
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch announcements'
      )
    }
  }
)

/**
 * Get announcement statistics
 */
export const getAnnouncementStatsThunk = createAsyncThunk(
  'admin/announcements/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/announcements/stats')
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch announcement stats'
      )
    }
  }
)

/**
 * Create new announcement
 */
export const createAnnouncementThunk = createAsyncThunk(
  'admin/announcements/create',
  async (announcementData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin/announcements', announcementData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create announcement'
      )
    }
  }
)

/**
 * Update announcement
 */
export const updateAnnouncementThunk = createAsyncThunk(
  'admin/announcements/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/announcements/${id}`, data)
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update announcement'
      )
    }
  }
)

/**
 * Delete announcement
 */
export const deleteAnnouncementThunk = createAsyncThunk(
  'admin/announcements/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/admin/announcements/${id}`)
      return { id, ...response.data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete announcement'
      )
    }
  }
)