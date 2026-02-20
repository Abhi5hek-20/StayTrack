import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../lib/axiosInstance";

export const getPaymentHistoryOfSingleUserThunk = createAsyncThunk(
  "adminHandlePayment/getPaymentHistoryOfSingleUser",
  async (userId, thunkAPI) => {
    try {
        // console.log("getPaymentHistoryOfSingleUserThunk", userId);
    const response = await axiosInstance.get(`/admin/payments/user-payment-history/${userId}`)
    // console.log("Payment history response:", response.data);
    return response.data;   // goes to fulfilled
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const updatePaymentThunk = createAsyncThunk(
  "adminHandlePayment/updatePayment",
  async (arr, thunkAPI) => {
    try {
        // console.log("getPaymentHistoryOfSingleUserThunk", userId);
    const response = await axiosInstance.patch(`/admin/payments/update-payment-history/${arr[0]}`, arr[1])
    // console.log("Payment history response:", response.data);
    return response.data;   // goes to fulfilled
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


