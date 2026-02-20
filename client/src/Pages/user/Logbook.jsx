import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { checkInThunk, checkOutThunk, getCurrentlyOutThunk, getLogEntriesThunk, getLogStatsThunk } from '../../store/user/logbook/logbookThunk'


const LogBook = () => {
  const dispatch = useDispatch()
  
  // Get state from Redux store
  const { user: authUser } = useSelector((state) => state.auth)
  const { 
    entries, 
    currentlyOut, 
    stats, 
    isLoading 
  } = useSelector((state) => state.logbook)
  
  const [showOutForm, setShowOutForm] = useState(false)
  const [showInForm, setShowInForm] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [outFormData, setOutFormData] = useState({
    name: '',
    phoneNumber: '',
    permission: '',
    outTime: '',
    reason: ''
  })

  // Helper function to format datetime consistently
  const formatDateTime = (dateInput) => {
    const date = dateInput ? new Date(dateInput) : new Date()
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Load data from database on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Populate form with user data when opening check out form
  useEffect(() => {
    if (showOutForm && authUser) {
      setOutFormData(prev => ({
        ...prev,
        name: authUser.fullName || '',
        phoneNumber: authUser.phno || ''
      }))
    }
  }, [showOutForm, authUser])

  const loadData = async () => {
    try {
      // Dispatch all thunks in parallel
      await Promise.all([
        dispatch(getLogEntriesThunk()),
        dispatch(getCurrentlyOutThunk()),
        dispatch(getLogStatsThunk())
      ])
    } catch (error) {
      console.error('Error loading data in Logbook:', error)
      toast.error('Failed to load log data')
    }
  }

  const handleOutSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      
      const logData = {
        name: outFormData.name,
        phoneNumber: outFormData.phoneNumber,
        permission: outFormData.permission,
        outTime: outFormData.outTime || new Date().toISOString(),
        reason: outFormData.reason || ''
      }

      // Dispatch checkout thunk
      await dispatch(checkOutThunk(logData)).unwrap()
      
      toast.success('Check out recorded successfully!')
      setOutFormData({
        name: '',
        phoneNumber: '',
        permission: '',
        outTime: '',
        reason: ''
      })
      setShowOutForm(false)
      
      // Reload data to get updated entries
      loadData()
    } catch (error) {
      console.error('Check out error:', error)
      toast.error(error || 'Failed to record check out')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCheckIn = async (entryId) => {
    try {
      setSubmitting(true)
      
      // Dispatch checkin thunk
      await dispatch(checkInThunk(entryId)).unwrap()
      
      toast.success('Check in recorded successfully!')
      setSelectedEntry(null)
      setShowInForm(false)
      
      // Reload data to get updated entries
      loadData()
    } catch (error) {
      console.error('Check in error:', error)
      toast.error(error || 'Failed to record check in')
    } finally {
      setSubmitting(false)
    }
  }

  const openInForm = (entry) => {
    setSelectedEntry(entry)
    setShowInForm(true)
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading LogBook...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Hostel <span className="text-blue-600">LogBook</span>
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Track resident movements for security and safety. Register when going out and check in when returning.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setShowOutForm(true)}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            📤 Check Out
          </button>
          <button
            onClick={() => setShowInForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            📥 Check In
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">{stats?.currentlyOut || 0}</div>
            <p className="text-gray-600">Currently Out</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">{stats?.returnedToday || 0}</div>
            <p className="text-gray-600">Returned Today</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">{stats?.totalEntries || 0}</div>
            <p className="text-gray-600">Total Entries</p>
          </div>
        </div>

        {/* Pending Returns */}
        {currentlyOut && currentlyOut.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
              Currently Out ({currentlyOut.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentlyOut.map(entry => (
                <div key={entry._id} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{entry.name}</h3>
                      <p className="text-gray-600">{entry.phoneNumber}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      OUT
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>Permission:</strong> {entry.permission}</p>
                    <p><strong>Out Time:</strong> {formatDateTime(entry.outTime)}</p>
                  </div>
                  <button
                    onClick={() => openInForm(entry)}
                    disabled={submitting}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Mark as Returned'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Entries */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            Recent Entries
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Permission</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Out Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">In Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entries && entries.slice(0, 10).map(entry => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{entry.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.permission}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDateTime(entry.outTime)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.inTime ? formatDateTime(entry.inTime) : '-'}</td>
                       <td className="px-6 py-4 text-sm text-gray-600">{entry.reason ? entry.reason : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Check Out Modal */}
        {showOutForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Check Out Form</h3>
              <form onSubmit={handleOutSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={outFormData.name}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Loading user name..."
                  />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={outFormData.phoneNumber}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Loading phone number..."
                  />
                 
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permission From *</label>
                  <select
                    required
                    value={outFormData.permission}
                    onChange={(e) => setOutFormData({...outFormData, permission: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select permission authority</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Out Time</label>
                  <input
                    type="datetime-local"
                    value={outFormData.outTime}
                    onChange={(e) => setOutFormData({...outFormData, outTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={getCurrentDateTime()}
                  />
                </div>
                {/* New Reason Field  */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Going Out</label>
                  <textarea
                    value={outFormData.reason}
                    onChange={(e) => setOutFormData({...outFormData, reason: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter reason for going out" required/>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowOutForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Checking Out...' : 'Check Out'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Check In Modal */}
        {showInForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Check In</h3>
              {selectedEntry ? (
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="font-semibold text-gray-900">{selectedEntry.name}</p>
                    <p className="text-gray-600">{selectedEntry.phoneNumber}</p>
                    <p className="text-sm text-gray-500">Out since: {formatDateTime(selectedEntry.outTime)}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowInForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCheckIn(selectedEntry._id)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Checking In...' : 'Confirm Check In'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-6">Select a person to check in from the "Currently Out" section above.</p>
                  <button
                    onClick={() => setShowInForm(false)}
                    className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default LogBook