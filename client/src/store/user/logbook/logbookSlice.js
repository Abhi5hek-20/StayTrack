import { createSlice } from "@reduxjs/toolkit";
import {
  checkOutThunk,
  checkInThunk,
  getLogEntriesThunk,
  getCurrentlyOutThunk,
  getLogStatsThunk,
} from "./logbookThunk";

const logbookSlice= createSlice({
  name: "logbook",
    initialState: {
    entries: [],         // Array of log entries (paginated)
    currentlyOut: [],    // Array of users currently out (inTime is null)
    stats: {            // Statistics object
        currentlyOut: 0,
        returnedToday: 0,
        totalEntries: 0
    },
    pagination: {       // Pagination info
        current: 1,
        pages: 1,
        total: 0
    },
    isLoading: false,   // Global loading state
    error: null         // Error messages

  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check Out
    builder
      .addCase(checkOutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkOutThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add new entry at the beginning
        if (action.payload?.data) {
          state.entries.unshift(action.payload.data);
          state.currentlyOut.unshift(action.payload.data);
        }
      })
      .addCase(checkOutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Check In
    builder
      .addCase(checkInThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkInThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedEntry = action.payload?.data;
        if (updatedEntry) {
          // Remove from currentlyOut
          state.currentlyOut = state.currentlyOut.filter(
            (entry) => entry._id !== updatedEntry._id
          );
          // Update in entries
          const index = state.entries.findIndex(
            (entry) => entry._id === updatedEntry._id
          );
          if (index !== -1) {
            state.entries[index] = updatedEntry;
          }
        }
      })
      .addCase(checkInThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get Log Entries
    builder
      .addCase(getLogEntriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLogEntriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getLogEntriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get Currently Out
    builder
      .addCase(getCurrentlyOutThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(getCurrentlyOutThunk.fulfilled, (state, action) => {
        state.currentlyOut = action.payload?.data || [];
      })
      .addCase(getCurrentlyOutThunk.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Get Log Stats
    builder
      .addCase(getLogStatsThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(getLogStatsThunk.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.stats = action.payload.data;
        }
      })
      .addCase(getLogStatsThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError } = logbookSlice.actions;
export default logbookSlice.reducer;