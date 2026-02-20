import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../lib/axiosInstance'
import { toast } from 'react-hot-toast'

/**
 * Make a payment
 */
export const makePaymentThunk = createAsyncThunk(
  'payment/makePayment',
  async (_, { rejectWithValue }) => {
    try {
     
         const response = await axiosInstance.post('/user/payments/make-payment')
         console.log("Payment response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error message')
    }
  }
)

export const getPaymentHistoryThunk = createAsyncThunk(
  'payment/getPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
     
         const response = await axiosInstance.get('/user/payments/payment-history')
         console.log("Payment response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error message')
    }
  }
)
