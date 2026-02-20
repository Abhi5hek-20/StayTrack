import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../lib/axiosInstance'


/**
 * Get all complaints
 */
export const getComplaintsThunk = createAsyncThunk(
  'admin/complaint/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/complaints')
      return response.data.complaints
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch complaints'
      )
    }
  }
)

/**
 * Update complaint status
 */
export const updateComplaintStatusThunk = createAsyncThunk(
  'admin/complaint/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/complaints/${id}/status`, {
        status: status
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update complaint status'
      )
    }
  }
)

/**
 * Get complaint statistics
 */
export const getComplaintStatsThunk = createAsyncThunk(
  'admin/complaint/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/complaints/stats')
      return response.data.stats
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch complaint stats'
      )
    }
  }
)