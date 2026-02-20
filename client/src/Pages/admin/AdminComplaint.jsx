import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { getComplaintsThunk,
         updateComplaintStatusThunk, 
         getComplaintStatsThunk 
} from '../../store/admin/complaint/complaintThunk'

const AdminComplaint = () => {
  const dispatch = useDispatch()
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  
  // Get data from Redux state
  const { complaints, stats, loading } = useSelector((state) => state.adminComplaint)

  // Fetch complaints and stats on mount
  useEffect(() => {
    dispatch(getComplaintsThunk())
    dispatch(getComplaintStatsThunk())

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      dispatch(getComplaintsThunk())
      dispatch(getComplaintStatsThunk())
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [dispatch])

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      dispatch(getComplaintsThunk())
      dispatch(getComplaintStatsThunk())
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [dispatch])

  // Filter complaints
  const filteredComplaints = (complaints || []).filter(complaint => {
    const matchesStatus = selectedStatus === 'All' || complaint.status === selectedStatus
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.roomNumber.includes(searchTerm)
    
    return matchesStatus && matchesSearch
  })

  // Get status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-orange-100 text-orange-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Handle status update
  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await dispatch(updateComplaintStatusThunk({ id: complaintId, status: newStatus })).unwrap()
      toast.success('Complaint status updated successfully!')
      setSelectedComplaint(null)
      dispatch(getComplaintsThunk())
      dispatch(getComplaintStatsThunk())
    } catch (error) {
      toast.error('Failed to update complaint status')
      console.error('Error updating complaint:', error)
    }
  }

  // Get complaint statistics
  const complaintsStats = stats || {
    total: 0,
    pending: 0,
    resolved: 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
          <p className="text-gray-600 mt-2">Manage and resolve student complaints</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{complaintsStats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{complaintsStats.pending}</p>
              </div>
            </div>
          </div>
        
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{complaintsStats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search complaints, students, rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
        
           
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Complaints ({filteredComplaints.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredComplaints.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
                <p className="mt-1 text-sm text-gray-500">No complaints match your current filters.</p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{complaint.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>👤 {complaint.studentName}</span>
                        <span>🏠 Room {complaint.roomNumber}</span>
                        <span>📅 {formatDate(complaint.submittedAt)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {complaint.status !== 'Resolved' && (
                        <button 
                          onClick={() => handleStatusUpdate(complaint.id, 'Resolved')}
                          className="px-3 py-1 text-xs font-medium text-green-600 hover:text-green-700 border border-green-600 rounded hover:bg-green-50 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Complaint Details</h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedComplaint.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Description</h5>
                  <p className="text-sm text-gray-600 mt-1">{selectedComplaint.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Student</h5>
                    <p className="text-sm text-gray-600">{selectedComplaint.studentName}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Room Number</h5>
                    <p className="text-sm text-gray-600">{selectedComplaint.roomNumber}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Category</h5>
                    <p className="text-sm text-gray-600">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Priority</h5>
                    <p className="text-sm text-gray-600">{selectedComplaint.priority}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Submitted</h5>
                    <p className="text-sm text-gray-600">{formatDate(selectedComplaint.submittedAt)}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">Last Updated</h5>
                    <p className="text-sm text-gray-600">{formatDate(selectedComplaint.updatedAt)}</p>
                  </div>
                </div>
                
                {selectedComplaint.status !== 'Resolved' && (
                  <div className="flex space-x-2 pt-4 border-t">
                    {selectedComplaint.status !== 'In Progress' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedComplaint.id, 'In Progress')}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                      >
                        Mark In Progress
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusUpdate(selectedComplaint.id, 'Resolved')}
                      className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 rounded hover:bg-green-50 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminComplaint