import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../lib/axiosInstance'


/**
 * Get recent logbook entries
 */
export const getRecentLogbookEntriesThunk = createAsyncThunk(
  'admin/logbook/getRecentEntries',
  async (limit = 10, { rejectWithValue }) => {
    try {
      console.log('Fetching recent logbook entries with limit:', limit)
      const response = await axiosInstance.get(`/admin/dashboard/logbook?limit=${limit}`)
      console.log('Recent logbook entries response:', response.data)
      return response.data.entries
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch logbook entries'
      )
    }
  }
)

/**
 * Get all logbook entries (for full logbook view)
 */