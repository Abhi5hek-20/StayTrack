import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSocketConnected: false,
  isConnected: false,
  liveNotifications: [],
  connectionError: null
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketConnected: (state, action) => {
      state.isSocketConnected = action.payload
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload
    },
    addLiveNotification: (state, action) => {
      state.liveNotifications.unshift(action.payload)
      if (state.liveNotifications.length > 50) {
        state.liveNotifications = state.liveNotifications.slice(0, 50)
      }
    },
    clearLiveNotifications: (state) => {
      state.liveNotifications = []
    },
    setConnectionError: (state, action) => {
      state.connectionError = action.payload
    },
    clearSocket: (state) => {
      state.isSocketConnected = false
      state.isConnected = false
      state.connectionError = null
    }
  }
})

export const {
  setSocketConnected,
  setConnected,
  addLiveNotification,
  clearLiveNotifications,
  setConnectionError,
  clearSocket
} = socketSlice.actions

export default socketSlice.reducer