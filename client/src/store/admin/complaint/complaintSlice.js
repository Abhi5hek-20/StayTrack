import { createSlice } from "@reduxjs/toolkit";
import {
  getComplaintsThunk,
  updateComplaintStatusThunk,
  getComplaintStatsThunk
} from "./complaintThunk";

const complaintSlice = createSlice({
  name: "adminComplaint",
  initialState: {
    complaints: [],      // list of all complaints
    stats: null,         // { total, pending, resolved, rejected }
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* =======================
         GET ALL COMPLAINTS
      ======================= */
      .addCase(getComplaintsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComplaintsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload; // backend already transformed
      })
      .addCase(getComplaintsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =======================
         UPDATE COMPLAINT STATUS
      ======================= */
      .addCase(updateComplaintStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComplaintStatusThunk.fulfilled, (state, action) => {
        state.loading = false;

        const updatedComplaint = action.payload.complaint;

        // Update complaint in-place
        state.complaints = state.complaints.map((c) =>
          c.id === updatedComplaint.id ? updatedComplaint : c
        );
      })
      .addCase(updateComplaintStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =======================
         GET COMPLAINT STATS
      ======================= */
      .addCase(getComplaintStatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComplaintStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getComplaintStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default complaintSlice.reducer;
