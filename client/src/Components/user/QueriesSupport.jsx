import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { createComplaintThunk, getUserComplaintsThunk } from '../../store/user/complaint/complaintThunk'

const QueriesSupport = () => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [complaint, setComplaint] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Get state from Redux store
  const { user: authUser } = useSelector((state) => state.auth)
  const { complaints, isLoading } = useSelector((state) => state.complaint)

  // Fetch complaints on component mount
  useEffect(() => {
    dispatch(getUserComplaintsThunk())
  }, [dispatch])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getUserComplaintsThunk())
    }, 30000)

    return () => clearInterval(interval)
  }, [dispatch])

  // Calculate stats from real data
  const complaintsArray = complaints || []
  const openTickets = complaintsArray.filter(c => c.status === 'pending').length
  const resolvedTickets = complaintsArray.filter(c => c.status === 'resolved').length
  const latestComplaint = complaintsArray[0] // Most recent complaint

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!complaint.trim()) {
      toast.error('Please enter your complaint/query')
      return
    }

    if (complaint.trim().length < 10) {
      toast.error('Complaint must be at least 10 characters long')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Dispatch Redux thunk
      const response = await dispatch(createComplaintThunk({
        roomNo: authUser?.roomNo,
        complaint: complaint.trim()
      })).unwrap()
      
      toast.success('Your complaint has been submitted successfully!')
      setComplaint('')
      setIsModalOpen(false)
      
      // Refresh complaints data
      dispatch(getUserComplaintsThunk())
    } catch (error) {
      toast.error(error || 'Failed to submit complaint. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false)
      setComplaint('')
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 flex flex-col min-h-62.5 sm:min-h-0">
        <div className="bg-linear-to-r from-indigo-600 to-cyan-600 text-white p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold text-center">❓ Queries & Support</h3>
        </div>
        <div className="p-3 md:p-5 flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-around text-center mb-7">
                <div>
                  <div className="text-xl md:text-2xl font-bold text-indigo-600">{openTickets}</div>
                  <div className="text-xs text-slate-600">Open Tickets</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-emerald-500">{resolvedTickets}</div>
                  <div className="text-xs text-slate-600">Resolved</div>
                </div>
              </div>
              
              {latestComplaint ? (
                <div className="bg-slate-50 p-2.5 rounded-lg mb-3">
                  <p className="text-xs text-slate-700 mb-1">
                    Latest: {latestComplaint?.complaint?.length > 30 
                      ? latestComplaint?.complaint?.substring(0, 30) + '...' 
                      : latestComplaint?.complaint}
                  </p>
                  <p className={`text-xs font-medium ${
                    latestComplaint.status === 'pending' ? 'text-indigo-600' :
                    latestComplaint.status === 'resolved' ? 'text-emerald-600' :
                    'text-rose-600'
                  }`}>
                    Status: {latestComplaint?.status === 'pending' ? 'In Progress' : 
                            latestComplaint?.status?.charAt(0).toUpperCase() + latestComplaint?.status?.slice(1)}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 p-2.5 rounded-lg mb-3">
                  <p className="text-xs text-slate-700 text-center">No complaints submitted yet</p>
                </div>
              )}
            </>
          )}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-linear-to-r from-indigo-600 to-cyan-600 text-white py-2 px-3 rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 hover:-translate-y-1 text-sm"
          >
            Submit New Query
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-indigo-600 to-cyan-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Submit New Query</h2>
                <button
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Display user info */}
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Submitting from:</h4>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Room:</span> {authUser?.roomNo || 'Loading...'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="complaint" className="block text-sm font-medium text-slate-700 mb-2">
                  Describe your complaint/query *
                </label>
                <textarea
                  id="complaint"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="Please describe your issue or query in detail..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={6}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Minimum 10 characters required
                </p>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg mb-4 text-center">
                <p className="text-sm text-indigo-800 font-medium">
                  Sorry for the trouble! We will resolve your issue as soon as possible.Thank you for your patience.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || complaint.trim().length < 10}
                  className="flex-1 bg-linear-to-r from-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Query'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default QueriesSupport