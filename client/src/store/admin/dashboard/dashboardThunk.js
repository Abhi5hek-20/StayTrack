import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../lib/axiosInstance'


/**
 * Get dashboard statistics
 */
export const getDashboardStatsThunk = createAsyncThunk(
  'admin/dashboard/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/stats')
      return response.data.stats
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      )
    }
  }
)

/**
 * Get room occupancy data
 */
export const getRoomOccupancyThunk = createAsyncThunk(
  'admin/dashboard/getRoomOccupancy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/rooms')
      return response.data.rooms
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch room occupancy'
      )
    }
  }
)

/**
 * Get room users by room number
 */
export const getRoomUsersThunk = createAsyncThunk(
  'admin/dashboard/getRoomUsers',
  async (roomNo, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/dashboard/rooms/${roomNo}/users`)
      return {success:true, room: response.data.room}
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch room users'
      )
    }
  }
)