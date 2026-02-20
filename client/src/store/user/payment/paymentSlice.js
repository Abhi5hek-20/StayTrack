import { createSlice } from "@reduxjs/toolkit";
import { 
    makePaymentThunk,
    getPaymentHistoryThunk
   } from "./paymentThunk";



const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentHistory: [],
    
  },
  reducers: {
     

    
  },
  extraReducers: (builder) => {

       builder
             // Get user notifications
             .addCase(makePaymentThunk.fulfilled, (state, action) => {
                console.log("Payment successful in slice:", action.payload);
             })

       builder
             // Get user notifications
             .addCase(getPaymentHistoryThunk.fulfilled, (state, action) => {
                console.log("Payment history fetched in slice:", action.payload);
                state.paymentHistory = action.payload.paymentHistory;
             })


  
    }


});

export const {  } = paymentSlice.actions;
export default paymentSlice.reducer;