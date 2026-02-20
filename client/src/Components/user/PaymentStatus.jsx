import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makePaymentThunk } from '../../store/user/payment/paymentThunk'
import { useNavigate } from 'react-router-dom'

const PaymentStatus = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const {user} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const handleMakePayment = () => {
    setShowPaymentModal(true)
  }
  
  const handlePaymentDone = () => {
    // Here you can add logic to verify payment or update status
    
    dispatch(makePaymentThunk())
    setShowPaymentModal(false)
    // You might want to show a success toast here
   
  }
  
  const handleCloseModal = () => {
    setShowPaymentModal(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 flex flex-col min-h-[250px] sm:min-h-0">
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold text-center">💳 Payment Status</h3>
        </div>
        <div className="p-3 md:p-4 flex-1">
          <div className="flex items-center mb-4">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2"></span>
            <span className="text-slate-700 font-medium text-sm">Current Month: Paid</span>
          </div>
          <div className="space-y-1.5 mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
              <span className="font-medium text-slate-700">Last Payment:</span>
              <span className="text-slate-600">₹8,500</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
              <span className="font-medium text-slate-700">Next Due:</span>
              <span className="text-slate-600">March 1, 2025</span>
            </div>
          </div>
          <div className="mt-15 space-y-2 sm:space-y-0 sm:space-x-2 sm:flex">
            <button 
              onClick={handleMakePayment}
              className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-2 px-3 rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 hover:-translate-y-1 text-sm"
            >
              Make Payment
            </button>
            <button onClick={() => navigate("/user/payment-history")} className="w-full sm:flex-1 bg-slate-100 text-indigo-700 py-2 px-3 rounded-lg font-medium border-2 border-indigo-700 hover:bg-indigo-50 transition-all duration-200 hover:-translate-y-1 text-sm">
              View History
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white p-4 sm:p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">💳 Scan to Pay</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              {/* Payment Amount */}
              <div className="text-center mb-4">
                <p className="text-slate-600 text-sm mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-indigo-600">₹6,500</p>
                <p className="text-slate-500 text-xs mt-1">Hostel Fee - March 2026</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg shadow-md border-2 border-slate-200">
                  {/* QR Code Placeholder - Replace with actual QR code */}
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white flex items-center justify-center">
                    {/* Simple QR Code Pattern */}
                    <img className="w-full h-full" src="/qr-code.jpeg" alt="qr-code" />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-indigo-800 text-center">
                  📱 Scan this QR code using any UPI app<br />
                  <span className="text-xs">(Google Pay, PhonePe, Paytm, etc.)</span>
                </p>
              </div>

              {/* Payment Done Button */}
              <button
                onClick={handlePaymentDone}
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Payment Done</span>
              </button>

              {/* Note */}
              <p className="text-xs text-slate-500 text-center mt-3">
                Note: Click "Payment Done" after completing the payment
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PaymentStatus
