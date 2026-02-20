import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPaymentHistoryOfSingleUserThunk, updatePaymentThunk } from '../../store/admin/payment/paymentThunk'

const updatePayment = (payload) => ({
  type: 'adminHandlePayment/updatePayment',
  payload
})

const HandlePayments = () => {
  const dispatch = useDispatch()

  const { userPaymentHistory, loading } = useSelector(state => state.adminPaymentsHandle)


  const [editingPayment, setEditingPayment] = useState(null)
  const [localPayments, setLocalPayments] = useState([])
  const [updateForm, setUpdateForm] = useState({
    status: '',
    amount: '',
    method: ''
  })


  useEffect(() => {
    setLocalPayments(userPaymentHistory || [])
  }, [userPaymentHistory])


  const payments = localPayments || []

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800'
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'failed':
        return 'bg-rose-100 text-rose-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const formatPaymentTime = (dateString) => {
    try {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = months[date.getMonth()]
      const year = date.getFullYear()
      
      let hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12 || 12
      
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`
    } catch {
      return 'N/A'
    }
  }

  const handleEditClick = (payment) => {
    setEditingPayment(payment._id)
    setUpdateForm({
      status: payment.status,
      amount: payment.amount,
      method: payment.method
    })
  }

  const handleCancelEdit = () => {
    setEditingPayment(null)
    setUpdateForm({ status: '', amount: '', method: '' })
  }

  const handleUpdateSubmit = (paymentId) => {
    const updatedValues = {
      amount: Number(updateForm.amount),
      method: updateForm.method,
      status: updateForm.status
    }

    setLocalPayments((prev) =>
      prev.map((payment) =>
        payment._id === paymentId
          ? { ...payment, ...updatedValues }
          : payment
      )
    )

    dispatch(
      updatePaymentThunk([
        paymentId,
        updatedValues
      ])
    )
    setEditingPayment(null)
    setUpdateForm({ status: '', amount: '', method: '' })
  }

  const handleInputChange = (field, value) => {
    setUpdateForm(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-cyan-700 p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            💳 All Payment History
          </h2>
        </div>

        <div className="overflow-x-auto">
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                No payment history found
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-200">
                {payments.map((payment) => (
                  <tr key={payment._id}>

                    <td className="px-4 py-4">
                      {editingPayment === payment._id ? (
                        <input
                          type="number"
                          value={updateForm.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
                        />
                      ) : (
                        <>₹{payment.amount?.toLocaleString('en-IN')}</>
                      )}
                    </td>

                    <td className="px-4 py-4 uppercase">
                      {editingPayment === payment._id ? (
                        <select
                          value={updateForm.method}
                          onChange={(e) => handleInputChange('method', e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-sm"
                        >
                          <option value="upi">UPI</option>
                          <option value="cash">Cash</option>
                        </select>
                      ) : (
                        payment.method
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {editingPayment === payment._id ? (
                        <select
                          value={updateForm.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                          <option value="failed">Failed</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {formatPaymentTime(payment.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      {editingPayment === payment._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateSubmit(payment._id)}
                            className="bg-emerald-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-slate-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(payment)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

export default HandlePayments
