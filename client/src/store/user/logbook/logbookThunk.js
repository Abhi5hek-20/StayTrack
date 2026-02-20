import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../lib/axiosInstance.js";


/**
 * Check out (create log entry)
 */
export const checkOutThunk = createAsyncThunk(
  "logbook/checkOut",
  async (logData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/logbook/checkout", logData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check out"
      );
    }
  }
);

/**
 * Check in (update log entry)
 */
export const checkInThunk = createAsyncThunk(
  "logbook/checkIn",
  async (logId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/logbook/checkin/${logId}`, {
        inTime: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check in"
      );
    }
  }
);

/**
 * Get paginated log entries
 */
export const getLogEntriesThunk = createAsyncThunk(
  "logbook/getEntries",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/logbook/entries?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch log entries"
      );
    }
  }
);

/**
 * Get users currently out
 */
export const getCurrentlyOutThunk = createAsyncThunk(
  "logbook/getCurrentlyOut",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/logbook/currently-out");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch currently out users"
      );
    }
  }
);

/**
 * Get logbook statistics
 */
export const getLogStatsThunk = createAsyncThunk(
  "logbook/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/logbook/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch log stats"
      );
    }
  }
);
