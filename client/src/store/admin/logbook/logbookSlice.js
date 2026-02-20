import { createSlice } from "@reduxjs/toolkit";
import { getRecentLogbookEntriesThunk } from "./logbookThunk";


const logbookSlice = createSlice({
  name: "logbook",
  initialState: {
    recentEntries:[],
    allEntries:[], 
    isLoading: false,
    error: null
  },
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecentLogbookEntriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRecentLogbookEntriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentEntries = action.payload;
        state.allEntries = action.payload;
      })
      .addCase(getRecentLogbookEntriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  
  
    }


});

export const {  } = logbookSlice.actions;
export default logbookSlice.reducer;