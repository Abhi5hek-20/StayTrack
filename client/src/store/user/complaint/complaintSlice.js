import { createSlice } from "@reduxjs/toolkit";
import { createComplaintThunk, getUserComplaintsThunk, getComplaintStatsThunk } from "./complaintThunk.js";

const complaintSlice = createSlice({
  name: "complaint",
  initialState: {
    complaints: [],     // Array of complaint objects
    isLoading: false,   // Loading state for async operations
    error: null 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Complaint
    builder
      .addCase(createComplaintThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComplaintThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add new complaint at the beginning (most recent first)
        if (action.payload?.complaint) {
          state.complaints.unshift(action.payload.complaint);
        }
      })
      .addCase(createComplaintThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get User Complaints
    builder
      .addCase(getUserComplaintsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserComplaintsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Backend returns complaints sorted by createdAt: -1 (most recent first)
        // Replace the entire array instead of pushing
        state.complaints = action.payload?.complaints || [];
      })
      .addCase(getUserComplaintsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get Complaint Stats
    builder
      .addCase(getComplaintStatsThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(getComplaintStatsThunk.fulfilled, (state, action) => {
        // Store stats if needed in future
      })
      .addCase(getComplaintStatsThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError } = complaintSlice.actions;
export default complaintSlice.reducer;