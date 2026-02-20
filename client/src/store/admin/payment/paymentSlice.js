import { createSlice } from "@reduxjs/toolkit";
import { getPaymentHistoryOfSingleUserThunk, updatePaymentThunk } from "./paymentThunk";


const paymentSlice = createSlice({
  name: "adminHandlePayment",
  initialState: {
    userPaymentHistory: [],
  },
  reducers: {
    
  },
  extraReducers: (builder) => {

  builder
        .addCase(getPaymentHistoryOfSingleUserThunk.fulfilled, (state, action) => {
           state.userPaymentHistory = action.payload.userPaymentHistory
           console.log("Payment history updated in slice:", state.userPaymentHistory);
        })

        .addCase(updatePaymentThunk.fulfilled, (state, action) => {
           
        })
  
    },

});

export const {  } = paymentSlice.actions;
export default paymentSlice.reducer;