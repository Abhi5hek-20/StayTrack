import React from 'react'

const Logout = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-linear-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🚪</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Confirm Logout
          </h3>
          <p className="text-slate-600 mb-6">
            Are you sure you want to logout from your account?
          </p>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg font-medium border-2 border-slate-300 hover:bg-slate-200 transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 bg-linear-to-r from-rose-500 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Logout
