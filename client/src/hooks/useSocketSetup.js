import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeSocket, disconnectSocket } from '../store/shared/socket/socketMiddleware.jsx'

/**
 * Custom hook to initialize and manage WebSocket connection
 * Should be called once in the root component (App.jsx)
 */
export const useSocketSetup = () => {
  const dispatch = useDispatch()
  const { user, admin, isAuthenticated, role } = useSelector((state) => state.auth)
  const { isConnected } = useSelector((state) => state.socket)
  // console.log("useSocketSetup - isAuthenticated:", isAuthenticated, "Role:", role, "UserID:",user?._id, "adminId:", admin?._id);
  useEffect(() => {
    // Only connect if user is authenticated
    if (isAuthenticated && (user?._id || admin?._id)) {
      dispatch(initializeSocket(user?._id == null ? admin._id : user._id, role))
    }

    // Cleanup on unmount or logout
    return () => {
      if (isAuthenticated) {
        dispatch(disconnectSocket())
      }
    }
  }, [isAuthenticated, user?._id, admin?._id, role, dispatch])
  return { isConnected }
}