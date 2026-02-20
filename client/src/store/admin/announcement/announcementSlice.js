import { createSlice } from '@reduxjs/toolkit'
import {
  getAnnouncementsThunk,
  getAnnouncementStatsThunk,
  createAnnouncementThunk,
  updateAnnouncementThunk,
  deleteAnnouncementThunk
} from './announcementThunk'

const adminAnnouncementSlice = createSlice({
  name: 'adminAnnouncements',
  initialState: {
    announcements: [],
    stats: {
      totalAnnouncements: 0,
      activeAnnouncements: 0,
      expiredAnnouncements: 0,
      highPriorityAnnouncements: 0
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Get All Announcements
    builder
      .addCase(getAnnouncementsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAnnouncementsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.announcements = action.payload.announcements || action.payload || []
        state.error = null
      })
      .addCase(getAnnouncementsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Get Announcement Stats
    builder
      .addCase(getAnnouncementStatsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAnnouncementStatsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload.overview || action.payload || state.stats
        state.error = null
      })
      .addCase(getAnnouncementStatsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Create Announcement
    builder
      .addCase(createAnnouncementThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createAnnouncementThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.announcements.unshift(action.payload)
        state.stats.totalAnnouncements += 1
        state.error = null
      })
      .addCase(createAnnouncementThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Update Announcement
    builder
      .addCase(updateAnnouncementThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateAnnouncementThunk.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.announcements.findIndex(a => a._id === action.payload._id)
        if (index !== -1) {
          state.announcements[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateAnnouncementThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Delete Announcement
    builder
      .addCase(deleteAnnouncementThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteAnnouncementThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.announcements = state.announcements.filter(a => a._id !== action.payload.id)
        state.stats.totalAnnouncements = Math.max(0, state.stats.totalAnnouncements - 1)
        state.error = null
      })
      .addCase(deleteAnnouncementThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = adminAnnouncementSlice.actions
export default adminAnnouncementSlice.reducer