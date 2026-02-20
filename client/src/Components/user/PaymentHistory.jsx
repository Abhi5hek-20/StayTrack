import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPaymentHistoryThunk } from '../../store/user/payment/paymentThunk'

const PaymentHistory = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { paymentHistory } = useSelector((state) => state.userPayments)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      dispatch(getPaymentHistoryThunk()).finally(() => {
        setLoading(false)
      })
  }, [dispatch])

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
    } catch (error) {
      return 'N/A'
    }
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
            💳 Payment History
          </h2>
          <p className="text-cyan-100 text-sm mt-1">
            View all your payment transactions
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {(!paymentHistory || paymentHistory.length === 0) ? (
            <div className="text-center py-12">
              <div className="text-slate-400 text-5xl mb-4">📭</div>
              <p className="text-slate-600 text-lg">No payment history found</p>
              <p className="text-slate-500 text-sm mt-2">
                Your transactions will appear here
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Payment Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {paymentHistory.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-900 uppercase">
                          {payment.method === 'upi' ? '📱 UPI' : '💵 Cash'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-900">
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">
                        {formatPaymentTime(payment.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer with summary */}
        {paymentHistory && paymentHistory.length > 0 && (
          <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
              <span>Total Transactions: <strong>{paymentHistory.length}</strong></span>
              <span>
                Total Amount: <strong className="text-indigo-600">
                  ₹{paymentHistory.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentHistory
