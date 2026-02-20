import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logout from './Logout.jsx'
import { useDispatch } from 'react-redux'
import { userLogoutThunk } from '../../store/auth/authThunk.js'

const UserNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      await dispatch(userLogoutThunk()).unwrap()
    } catch (error) {
    }
    setShowLogoutModal(false)
    setIsMobileMenuOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <nav className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section - Left */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-2 rounded-lg">
                  <span className="text-white font-bold text-xl">🏠</span>
                </div>
                <span className="ml-2 text-xl font-bold text-slate-800 hidden sm:block">
                  LOGO
                </span>
                <span className="ml-2 text-lg font-bold text-slate-800 sm:hidden">
                  HM
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Right */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/user/home" 
              className="text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-indigo-50"
            >
              Home
            </Link>
            <Link 
              to="/user/contact" 
              className="text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-indigo-50"
            >
              Contact
            </Link>
            
            {/* Profile Button */}
            <Link 
              to="/user/profile"
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </Link>

            {/* Desktop Logout Button */}
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-200 hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-slate-900/95 z-50">
            <div className="h-full flex flex-col">
              {/* Close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-slate-300 p-2"
                >
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="space-y-4 text-center max-w-sm mx-auto">
                {/* Main Navigation */}
                <Link 
                  to="/user/home" 
                  className="text-white hover:text-cyan-300 flex items-center justify-center text-xl font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl mr-3">🏠</span>
                  Home
                </Link>
                <Link 
                  to="/user/contact" 
                  className="text-white hover:text-cyan-300 flex items-center justify-center text-xl font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl mr-3">📞</span>
                  Contact
                </Link>
                
                {/* Divider */}
                <div className="py-2">
                  <hr className="border-slate-700" />
                </div>
                
                {/* Sidebar Items */}
                <Link 
                  to="/user/notifications" 
                  className="text-white hover:text-cyan-300 flex items-center justify-center text-xl font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl mr-3">🔔</span>
                  Notifications
                </Link>
                <Link 
                  to="/user/facilities" 
                  className="text-white hover:text-cyan-300 flex items-center justify-center py-3 text-xl font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl mr-3">🏢</span>
                  Facilities
                </Link>
                <Link 
                  to="/user/logbook" 
                  className="text-white hover:text-cyan-300 flex items-center justify-center py-3 text-xl font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl mr-3">📝</span>
                  LogBook
                </Link>
                <Link 
                  to="/user/about" 
                  className="text-white hover:text-cyan-300 flex items-center justify-center py-3 text-xl font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl mr-3">ℹ️</span>
                  About
                </Link>
                
                {/* Divider */}
                <div className="py-2">
                  <hr className="border-slate-700" />
                </div>
                
                {/* Profile Button */}
                <Link 
                  to="/user/profile"
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 py-4 rounded-lg text-xl font-medium hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center space-x-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-4 rounded-lg text-xl font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      <Logout 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </nav>
  )
}

export default UserNavbar;