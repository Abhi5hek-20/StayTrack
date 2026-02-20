import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../lib/axiosInstance.js";


/**
 * Create a new complaint
 */
export const createComplaintThunk = createAsyncThunk(
  "complaint/create",
  async (complaintData, { rejectWithValue }) => {
    try {
      console.log("createComplaintThunk complaintData:", complaintData);      
      const response = await axiosInstance.post(
        "/complaints/create",
        complaintData
      );
      console.log("createComplaintThunk response:", response?.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create complaint"
      );
    }
  }
);

/**
 * Get logged-in user's complaints
 */
export const getUserComplaintsThunk = createAsyncThunk(
  "complaint/getUserComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/complaints/my-complaints");
      console.log("getUserComplaintsThunk response:", response?.data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch complaints"
      );
    }
  }
);

/**
 * Get complaint statistics
 */
export const getComplaintStatsThunk = createAsyncThunk(
  "complaint/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/complaints/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch complaint stats"
      );
    }
  }
);
