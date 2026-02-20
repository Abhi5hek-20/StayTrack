import { createSlice } from '@reduxjs/toolkit'
import {
  getDashboardStatsThunk,
  getRoomOccupancyThunk,
  getRoomUsersThunk
} from './dashboardThunk'

const initialState = {
  stats: {
    totalStrength: 0,
    presentStudents: 0,
    absentStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0
  },
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  roomUsers: [],
  error: null
}

const dashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    clearSelectedRoom: (state) => {
      state.selectedRoom = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard stats
      .addCase(getDashboardStatsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getDashboardStatsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(getDashboardStatsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get room occupancy
      .addCase(getRoomOccupancyThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRoomOccupancyThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.rooms = action.payload
      })
      .addCase(getRoomOccupancyThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get room users
      .addCase(getRoomUsersThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRoomUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedRoom = action.payload
        // console.log('Room users fetched slice:', action.payload)
        state.roomUsers = action.payload.room.students
        // console.log('Room users list slice:', state.roomUsers)
      })
      .addCase(getRoomUsersThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearSelectedRoom, clearError } = dashboardSlice.actions
export default dashboardSlice.reducer