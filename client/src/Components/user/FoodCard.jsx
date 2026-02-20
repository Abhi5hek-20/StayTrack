import React from 'react'
import { Link } from 'react-router-dom'

const FoodMenu = () => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 flex flex-col min-h-62.5 sm:min-h-0">
      <div className="bg-linear-to-r from-indigo-600 to-cyan-600 text-white p-2 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-center">🍽️ Food Menu</h3>
      </div>
      <div className="p-3 md:p-6 flex-1">
        <div className="space-y-2 mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1.5 border-b border-slate-100">
            <span className="font-medium text-slate-700 text-sm">Breakfast:</span>
            <span className="text-slate-600 text-xs sm:text-sm">7:30 AM - 10:00 AM</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1.5 border-b border-slate-100">
            <span className="font-medium text-slate-700 text-sm">Lunch:</span>
            <span className="text-slate-600 text-xs sm:text-sm">12:30 PM - 2:00 PM</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1.5 border-b border-slate-100">
            <span className="font-medium text-slate-700 text-sm">Dinner:</span>
            <span className="text-slate-600 text-xs sm:text-sm">7:30 PM - 9:30 PM</span>
          </div>
        </div>
        <Link 
          to="/user/food-menu"
          className="block w-full bg-linear-to-r from-indigo-600 to-cyan-600 text-white py-2 px-3 rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 hover:-translate-y-1 text-sm text-center"
        >
          View Full Menu
        </Link>
      </div>
    </div>
  )
}

export default FoodMenu
