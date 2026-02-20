import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../lib/axiosInstance'


/**
 * Get admin profile
 */
export const getAdminProfileThunk = createAsyncThunk(
  'admin/profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/profile')
      return response.data.admin
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch admin profile'
      )
    }
  }
)

/**
 * Update admin profile (email)
 */
export const updateAdminProfileThunk = createAsyncThunk(
  'admin/profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/admin/profile', profileData)
      return response.data.admin
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      )
    }
  }
)

/**
 * Update admin password
 */
export const updateAdminPasswordThunk = createAsyncThunk(
  'admin/profile/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/admin/profile/password', passwordData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update password'
      )
    }
  }
)