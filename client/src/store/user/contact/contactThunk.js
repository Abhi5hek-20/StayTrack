import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../../lib/axiosInstance'



// Create a new contact message
export const createContactThunk = createAsyncThunk(
  'contact/create',
  async (message, { rejectWithValue }) => {
    try {
      console.log("createContactThunk message: ", message);
      const response = await axiosInstance.post('/user/contact', { message })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create contact')
    }
  }
)

// Get user's contact messages
export const getUserContactsThunk = createAsyncThunk(
  'contact/getUserContacts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/contact', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts')
    }
  }
)

// Get specific contact by ID
export const getContactByIdThunk = createAsyncThunk(
  'contact/getById',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/contact/${contactId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact')
    }
  }
)