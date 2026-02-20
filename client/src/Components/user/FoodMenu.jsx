import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FoodMenu = () => {
  const [selectedDay, setSelectedDay] = useState('monday')
  const navigate = useNavigate()

  const weeklyMenu = {
    monday: {
      breakfast: {
        time: "8:00 AM - 10:30 AM",
        items: ["Idly","Chutney"]
      },
      lunch: {
        time: "12:30 PM - 2:00 PM",
        items: ["Rice","fry/curry","Dal"]
      },
      dinner: {
        time: "7:30 PM - 9:30 PM",
        items: ["Rice", "Curry"]
      }
    },
    tuesday: {
      breakfast: {
        time: "8:00 AM - 10:30 AM",
        items: ["Dosa"]
      },
      lunch: {
        time: "12:30 PM - 2:00 PM",
        items: ["Rice","fry/curry","Dal"]
      },
      dinner: {
        time: "7:30 PM - 9:30 PM",
        items: ["Egg burji", "Rice"]
      }
    },
    wednesday: {
      breakfast: {
        time: "8:00 AM - 10:30 AM",
        items: ["Punugulu"]
      },
      lunch: {
        time: "12:30 PM - 2:00 PM",
        items: ["Rice","fry/curry","Dal"]
      },
      dinner: {
        time: "7:30 PM - 9:30 PM",
        items: ["Rice","Chicken curry"]
      }
    },
    thursday: {
      breakfast: {
        time: "8:00 AM - 10:30 AM",
        items: ["Chapati","Curry"]
      },
      lunch: {
        time: "12:30 PM - 2:00 PM",
        items: ["Rice","fry/curry","Dal"]
      },
      dinner: {
        time: "7:30 PM - 9:30 PM",
        items: ["Rice","fry/curry","Dal"]
        // items: ["Biryani", "Chicken Curry", "Raita", "Chapati", "Boiled Egg", "Kheer"]
      }
    },
    friday: {
      breakfast: {
        time: "8:00 AM - 10:30 AM",
        items: ["Uthappam"]
      },
      lunch: {
        time: "12:30 PM - 2:00 PM",
        items: ["Rice","fry/curry","Dal"]
      },
      dinner: {
        time: "7:30 PM - 9:30 PM",
        items: ["Veg fried rice","Egg fried rice"]
      }
    },
    saturday: {
      breakfast: {
        time: "8:00 AM - 10:30 AM",
        items: ["Puri"]
      },
      lunch: {
        time: "12:30 PM - 2:00 PM",
        items: ["Rice","fry/curry","Dal"]
      },
      dinner: {
        time: "7:30 PM - 9:30 PM",
        items: ["Rice","Sambar","Curd rice","Curry"]
      }
    },
    sunday: {
      breakfast: {
        time: "8:00 AM - 10:30 AM",
        items: ["Tiger rice / Upma"]
      },
      lunch: {
        time: "12:30 PM - 2:00 PM",
        items: ["Rice","fry/curry","Dal"]
      },
      dinner: {
        time: "7:30 PM - 9:30 PM",
        items: ["Rice","Chicken curry"]
      }
    }
  }
  
  const snacksMenu = {
    time: "4:00 PM - 6:00 PM",
    note: "Available on alternate days",
    items: ["Chips", "Biscuits", "Samosa", "Fruits", "Noodles", "Manchuria"]
  }

  const specialMenu = {
    note: "Monthly special items",
    items: [
      "Biryani (Every month end)",
      "Chicken Fried Rice (Once per month)",
      "Paratha & Chicken (2nd week of month)"
    ]
  }

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  const currentMenu = weeklyMenu[selectedDay]

  const MealCard = ({ mealType, mealData, icon, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{icon}</span>
        <div>
          <h3 className="text-xl font-bold text-slate-800 capitalize">{mealType}</h3>
          <p className="text-sm text-slate-600 font-medium">{mealData.time}</p>
        </div>
      </div>
      <div className="space-y-2">
        {mealData.items.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
            <span className="text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const SnacksCard = () => (
    <div className="bg-linear-to-br from-cyan-100 to-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">🍿</span>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Evening Snacks</h3>
          <p className="text-sm text-slate-600 font-medium">{snacksMenu.time}</p>
          
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-indigo-700 mb-3">Available on alternate days</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              <span className="text-slate-700">Chips</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              <span className="text-slate-700">Samosa</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              <span className="text-slate-700">Noodles</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              <span className="text-slate-700">Biscuits</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              <span className="text-slate-700">Fruits</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              <span className="text-slate-700">Manchuria</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-indigo-700 mb-3">Available everyday</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              <span className="text-slate-700">Tea</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              <span className="text-slate-700">Milk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const SpecialMenuCard = () => (
    <div className="bg-linear-to-br from-indigo-100 to-cyan-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">⭐</span>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Monthly Specials</h3>
          <p className="text-sm text-slate-600 font-medium">{specialMenu.time}</p>
          <p className="text-xs text-indigo-700 font-semibold mt-1">{specialMenu.note}</p>
        </div>
      </div>
      <div className="space-y-2">
        {specialMenu.items.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
            <span className="text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 relative">
          <button
            onClick={() => navigate("/user/home")}
            className="hidden md:flex absolute left-0 top-0 items-center px-4 py-2 text-slate-600 hover:text-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            🍽️ Hostel Food Menu
          </h1>
          <p className="text-slate-600 text-lg">
            Delicious meals served fresh every day
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            Select Day
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {days.map((day) => (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedDay === day.key
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800 capitalize">
            {selectedDay}'s Menu
          </h2>
          <div className="w-24 h-1 bg-indigo-500 mx-auto mt-2 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <MealCard
            mealType="breakfast"
            mealData={currentMenu.breakfast}
            icon="🌅"
            bgColor="bg-gradient-to-br from-indigo-100 to-cyan-100"
          />
          <MealCard
            mealType="lunch"
            mealData={currentMenu.lunch}
            icon="☀️"
            bgColor="bg-gradient-to-br from-cyan-100 to-sky-100"
          />
          <MealCard
            mealType="dinner"
            mealData={currentMenu.dinner}
            icon="🌙"
            bgColor="bg-gradient-to-br from-violet-100 to-indigo-100"
          />
        </div>

        <div className="text-center mb-6">
         
          <div className="w-32 h-1 bg-linear-to-r from-indigo-500 to-cyan-500 mx-auto mt-2 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-3xl font-bold text-slate-800 mb-4 text-center">
              🍿 Snack Menu
            </h3>
            <SnacksCard />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800 mb-4 text-center">
              ⭐ Monthly Specials
            </h3>
            <SpecialMenuCard />
          </div>
        </div>


      </div>
    </div>
  )
}

export default FoodMenu