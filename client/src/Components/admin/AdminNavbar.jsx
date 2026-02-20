import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { adminLogoutThunk } from '../../store/auth/authThunk'

const AdminNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Local state for UI management
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  // Get state from Redux store
  const { isAuthenticated, admin } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Dispatch logout action
      await dispatch(adminLogoutThunk()).unwrap()
      
      // Show success message
      toast.success("Logged out successfully!")
      
      // Force navigation immediately 
      window.location.href = "/login"
    } catch (error) {
      console.error('Logout error:', error)
      
      // Show success message anyway
      toast.success("Logged out successfully!")
      
      // Force navigation even on error
      window.location.href = "/login"
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    setShowLogoutModal(false)
    handleLogout()
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuItemClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/admin/home" className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-linear-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">🏠</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-linear-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  StayTrack Admin
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Home Button */}
            <Link 
              to="/admin/home"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>

            {/* Profile Button */}
            <Link 
              to="/admin/profile"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </Link>

            {/* Notifications Button */}
            <Link 
              to="/admin/notifications"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 font-medium relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5 5 5h-5m-5-10V7a3 3 0 016 0v3m-6 0l6 6" />
              </svg>
              <span>Notifications</span>
            </Link>

            {/* Announcement Button */}
            <Link 
              to="/admin/announcements"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span>Announcement</span>
            </Link>

            {/* Logout Button */}
            <button 
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-2">
              {/* Home Link */}
              <Link 
                to="/admin/home"
                onClick={handleMenuItemClick}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </Link>

              {/* Profile Link */}
              <Link 
                to="/admin/profile"
                onClick={handleMenuItemClick}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </Link>

              {/* Notifications Link */}
              <Link 
                to="/admin/notifications"
                onClick={handleMenuItemClick}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 font-medium relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5 5 5h-5m-5-10V7a3 3 0 016 0v3m-6 0l6 6" />
                </svg>
                <span>Notifications</span>
              </Link>

              {/* Announcement Link */}
              <Link 
                to="/admin/announcements"
                onClick={handleMenuItemClick}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Announcement</span>
              </Link>

              {/* Logout Button */}
              <button 
                onClick={() => {
                  handleMenuItemClick()
                  handleLogoutClick()
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-rose-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              
              {/* Modal Title */}
              <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">
                Confirm Logout
              </h3>
              
              {/* Modal Message */}
              <p className="text-slate-600 text-center mb-6">
                Are you sure you want to logout? You will be redirected to the login page and will need to sign in again.
              </p>
              
              {/* Modal Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default AdminNavbar
