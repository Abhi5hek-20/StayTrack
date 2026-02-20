import React from 'react'
import { Link } from 'react-router-dom'
import FoodCard from '../../Components/user/FoodCard'
import ImageCard from '../../Components/user/ImageCard'
import QueriesSupport from '../../Components/user/QueriesSupport'
import PaymentStatus from '../../Components/user/PaymentStatus'


const UserHome = () => {

  return (
    <div className="flex h-[calc(100vh-10vh)] w-screen bg-slate-100 overflow-hidden ">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex md:w-60 bg-gradient-to-br from-slate-900 via-indigo-900 to-cyan-800 text-white shadow-xl">
        <div className="flex flex-col h-full w-full">

          {/* Navigation */}
          <nav className="flex-1 p-3">
            <ul className="space-y-1">
              <li>
                <Link to="/user/notifications" className="flex items-center p-2.5 rounded-lg hover:bg-white/10 transition-all duration-200 hover:translate-x-1 border-l-2 border-transparent hover:border-cyan-200">
                  <span className="text-lg mr-3">🔔</span>
                  <span className="font-medium text-sm">Notifications</span>
                </Link>
              </li>
              <li>
                <Link to="/user/facilities" className="flex items-center p-2.5 rounded-lg hover:bg-white/10 transition-all duration-200 hover:translate-x-1 border-l-2 border-transparent hover:border-cyan-200">
                  <span className="text-lg mr-3">🏢</span>
                  <span className="font-medium text-sm">Facilities</span>
                </Link>
              </li>
              <li>
                <Link to="/user/logbook" className="flex items-center p-2.5 rounded-lg hover:bg-white/10 transition-all duration-200 hover:translate-x-1 border-l-2 border-transparent hover:border-cyan-200">
                  <span className="text-lg mr-3">📝</span>
                  <span className="font-medium text-sm">LogBook</span>
                </Link>
              </li>
              <li>
                <Link to="/user/about" className="flex items-center p-2.5 rounded-lg hover:bg-white/10 transition-all duration-200 hover:translate-x-1 border-l-2 border-transparent hover:border-cyan-200">
                  <span className="text-lg mr-3">ℹ️</span>
                  <span className="font-medium text-sm">About</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-0 h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        {/* Dashboard Content */}
        <main className="flex-1 p-3 md:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
              
              {/* Food Menu Card */}
              <FoodCard />
              
              {/* Remaining Days Card */}
              <ImageCard />

              {/* Queries & Support Card */}
              <QueriesSupport />

              {/* Payment Status Card */}
              <PaymentStatus />

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserHome
