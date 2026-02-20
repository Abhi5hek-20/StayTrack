import React from 'react'

const UserProfile = ({ user, onBack }) => {
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-slate-500">No user data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Room
            </button>
          )}
          
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Student Profile</h2>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-indigo-50 to-cyan-50 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-linear-to-r from-indigo-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {(user.fullName || user.name || '').split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{user.fullName || user.name || 'N/A'}</h3>
                <div className="flex items-center space-x-4">
                  <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-800 text-sm font-medium rounded-full">
                    {user.studyYear || 'N/A'}
                  </span>
                  <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                    Room {user.roomNo || 'N/A'}
                  </span>
                  {user.isPresent !== undefined && (
                    <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
                      user.isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {user.isPresent ? 'Present' : 'Absent'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                  <p className="text-slate-900 font-medium">{user.fullName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
                  <p className="text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors">{user.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Phone Number</label>
                  <p className="text-slate-900 font-medium">{user.phno || user.number || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Aadhar Number</label>
                  <p className="text-slate-900 font-medium">{user.aadharNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">College ID</label>
                  <p className="text-slate-900 font-medium">{user.clgId || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Academic Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Study Year</label>
                  <p className="text-slate-900 font-medium">{user.studyYear || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Course</label>
                  <p className="text-slate-900 font-medium">{user.course || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Room Number</label>
                  <p className="text-slate-900 font-medium">{user.roomNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Registration Date</label>
                  <p className="text-slate-900 font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 
                     user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Family Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Family Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Parent Name</label>
                  <p className="text-slate-900 font-medium">{user.parentName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Parent Phone</label>
                  <p className="text-slate-900 font-medium">{user.parentPhno || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Guardian Name</label>
                  <p className="text-slate-900 font-medium">{user.guardianName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Guardian Phone</label>
                  <p className="text-slate-900 font-medium">{user.guardianPhno || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Address</label>
                  <p className="text-slate-900 font-medium">{user.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile