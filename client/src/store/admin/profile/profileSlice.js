import { createSlice } from "@reduxjs/toolkit";
import { 
  getAdminProfileThunk, 
  updateAdminProfileThunk, 
  updateAdminPasswordThunk 
} from "./profileThunk";

const adminProfileSlice = createSlice({
  name: "adminProfile",
  initialState: {
    adminData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get Admin Profile
    builder
      .addCase(getAdminProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminData = action.payload;
        state.error = null;
      })
      .addCase(getAdminProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Admin Profile (Email)
    builder
      .addCase(updateAdminProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAdminProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminData = action.payload;
        state.error = null;
      })
      .addCase(updateAdminProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Admin Password
    builder
      .addCase(updateAdminPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAdminPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateAdminPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default adminProfileSlice.reducer;