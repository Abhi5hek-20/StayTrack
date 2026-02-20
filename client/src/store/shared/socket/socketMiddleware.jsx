import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import {
  setSocketConnected,
  setConnected,
  addLiveNotification,
  setConnectionError,
  clearSocket
} from './socketSlice'
import { getUserNotificationsThunk } from '../../user/notification/notificationThunk'
import { addRealtimeNotification } from '../../admin/notification/notificationSlice'

let socket = null
let listenersSetup = false

export const initializeSocket = (userId, userRole) => (dispatch) => {
  // Don't create multiple connections
  console.log("Initializing socket. Current socket:", socket, "UserRole:", userRole);
  
  if (socket?.connected) {
    console.log('Socket already connected')
    // Set up listeners if not already done
    if (!listenersSetup) {
      console.log('Setting up listeners for existing socket')
      setupEventListeners(socket, userRole, dispatch)
      listenersSetup = true
    }
    return socket
  }

  // Reset listeners flag when creating new connection
  listenersSetup = false

  // Initialize socket connection
  socket = io('http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  })

  // Store socket connection status
  dispatch(setSocketConnected(true))

  // Connection established
  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket server')
    dispatch(setConnected(true))
    dispatch(setConnectionError(null))
    
    // Join appropriate room based on user role
    if (userId) {
      if (userRole === 'admin') {
        socket.emit('join-admin', userId)
        console.log(`📍 Joined admin room: admin_${userId}`)
      } else {
        socket.emit('join-user', userId)
        console.log(`📍 Joined user room: user_${userId}`)
      }
    }
  })

  // Disconnection
  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected from WebSocket:', reason)
    dispatch(setConnected(false))
    dispatch(setSocketConnected(false))
  })

  // Connection error
  socket.on('connect_error', (error) => {
    console.error('🚫 Socket connection error:', error)
    dispatch(setConnectionError(error.message))
    dispatch(setSocketConnected(false))
  })

  // Setup event listeners only once
  if (!listenersSetup) {
    setupEventListeners(socket, userRole, dispatch)
    listenersSetup = true
  }

  return socket
}

// Separate function to set up all event listeners
const setupEventListeners = (socket, userRole, dispatch) => {
  console.log("🎧 Setting up event listeners for role:", userRole)

  // ==========================================
  // USER EVENT LISTENERS
  // ==========================================
  
  if (userRole !== 'admin') {
    // Listen for new announcements (user)
    socket.on('new-announcement', (data) => {
      console.log('📢 New announcement received:', data)
      
      dispatch(addLiveNotification({
        ...data,
        timestamp: new Date().toISOString()
      }))
      
      toast((t) => (
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <span className="text-2xl">📢</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              New {data.category} announcement
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {data.title}
            </p>
          </div>
          <button
            onClick={() => {
              toast.dismiss(t.id)
              window.location.href = '/user/notifications'
            }}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            View
          </button>
        </div>
      ), {
        duration: 6000,
        position: 'top-right',
        style: {
          background: '#fff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px'
        }
      })
      
      dispatch(getUserNotificationsThunk())
    })

    // Listen for user-specific notifications
    socket.on('user-notification', (notification) => {
      console.log('🔔 User notification received:', notification)
      
      dispatch(addLiveNotification({
        ...notification,
        timestamp: new Date().toISOString()
      }))
      
      toast.success(notification.message, {
        duration: 5000,
        position: 'top-right',
        icon: '🔔'
      })
      
      dispatch(getUserNotificationsThunk())
    })

    // Listen for announcement deletions
    socket.on('announcement-deleted', (data) => {
      console.log('🗑️ Announcement deleted:', data)
      toast.success('An announcement has been removed')
      dispatch(getUserNotificationsThunk())
    })
  }

  // ==========================================
  // ADMIN EVENT LISTENERS
  // ==========================================
  
  if (userRole === 'admin') {
    console.log("📧 Setting up admin socket listeners");
    // Contact message notifications
    socket.on('new-contact-message', (contactData) => {
      console.log('📧 New contact message received:', contactData)
      
      const notification = {
        id: contactData.id,
        type: 'contact',
        title: 'New Contact Message',
        message: `${contactData.name} (Room ${contactData.room}) sent: "${contactData.message.substring(0, 50)}${contactData.message.length > 50 ? '...' : ''}"`,
        data: contactData,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      dispatch(addRealtimeNotification(notification))
      
      toast.success(`New contact message from ${contactData.name}`, {
        duration: 4000,
        icon: '📧',
        position: 'top-right'
      })
    })

    // Complaint resolution notifications
    socket.on('complaint-resolved', (complaintData) => {
      console.log('🎫 Complaint resolved:', complaintData)
      
      const notification = {
        id: `complaint-${complaintData.id}-${Date.now()}`,
        type: 'complaint',
        title: 'Complaint Update',
        message: `Complaint by ${complaintData.userName} has been ${complaintData.status}`,
        data: complaintData,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      dispatch(addRealtimeNotification(notification))
      
      toast.success(`Complaint ${complaintData.status}`, {
        duration: 3000,
        icon: '🎫',
        position: 'top-right'
      })
    })

    // New complaint notifications
    socket.on('new-complaint', (complaintData) => {
      console.log('🆕 New complaint received:', complaintData)
      
      const notification = {
        id: `complaint-new-${complaintData.id}-${Date.now()}`,
        type: 'complaint',
        title: 'New Complaint',
        message: `New complaint from ${complaintData.userName}: ${complaintData.subject}`,
        data: complaintData,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      dispatch(addRealtimeNotification(notification))
      
      toast.error(`New complaint from ${complaintData.userName}`, {
        duration: 5000,
        icon: '🆕',
        position: 'top-right'
      })
    })
  }
}

export const disconnectSocket = () => (dispatch) => {
  if (socket) {
    socket.disconnect()
    socket = null
    listenersSetup = false
    dispatch(clearSocket())
    console.log('🔌 Socket disconnected')
  }
}

export const emitSocketEvent = (eventName, data) => () => {
  if (socket && socket.connected) {
    socket.emit(eventName, data)
    console.log(`📤 Emitted event: ${eventName}`, data)
  } else {
    console.warn('⚠️ Socket not connected, cannot emit event')
  }
}

export const getSocketInstance = () => socket