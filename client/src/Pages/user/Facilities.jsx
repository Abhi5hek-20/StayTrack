import React from 'react'

const Facilities = () => {
  const facilities = [
    {
      id: 1,
      title: "Hot Water",
      icon: "🚿",
      description: "All rooms are equipped with reliable hot water supply, ensuring comfort and convenience for residents.",
      features: [
        "Morning & evening hot water availability",
        "Solar-powered water heating system",
        "Backup electric heating",
        "Energy-efficient system"
      ],
      bgColor: "from-red-400 to-orange-500"
    },
    {
      id: 2,
      title: "Water 24/7",
      icon: "💧",
      description: "Uninterrupted water supply throughout the day. Clean, safe water available at all times for drinking and daily use.",
      features: [
        "Continuous water supply",
        "RO filtered drinking water",
        "Water storage tanks",
        "Emergency backup systems"
      ],
      bgColor: "from-blue-400 to-cyan-500"
    },
    {
      id: 3,
      title: "Homely Food",
      icon: "🍽️",
      description: "Homely meals prepared with proper care. We strive to provide the comfort of home-cooked food every day.",
      features: [
        "Fresh, home-style cooking",
        "Vegetarian & non-vegetarian options",
        "Hygienic and balanced meal preparation",
        "Fixed meal timings and variety"
      ],
      bgColor: "from-green-400 to-emerald-500"
    },
    {
      id: 4,
      title: "Security",
      icon: "🛡️",
      description: "Your safety is our priority. Comprehensive security measures ensure a safe and secure living environment.",
      features: [
        "24/7 security personnel",
        "CCTV surveillance",
        "Secure entry & exit points",
        "Emergency responses "
      ],
      bgColor: "from-purple-400 to-indigo-500"
    },
    {
      id: 5,
      title: "Washing Machines",
      icon: "🧺",
      description: "Modern washing machines and laundry facilities make keeping your clothes clean convenient and hassle-free.",
      features: [
        "Coin-operated washing machines",
        "Drying facilities available",
        "Detergent vending machines",
        "Separate modes for different loads",
        
      ],
      bgColor: "from-teal-400 to-blue-500"
    },
    {
      id: 6,
      title: "Lockers",
      icon: "🔐",
      description: "Secure personal storage lockers to keep your valuables and important documents safe and organized.",
      features: [
        "Individual secure lockers",
        "Secure key-based lock system for all rooms",
        "Durable and secure storage facilities",
        "Spacious, lockable storage for personal belongings"
      ],
      bgColor: "from-yellow-400 to-orange-500"
    }
  ]

  const additionalAmenities = [
    { name: "Wi-Fi Internet", icon: "📶" },
    { name: "Parking", icon: "🚗" },
    { name: "Medical First Aid", icon: "🏥" },
    { name: "Housekeeping", icon: "🧹" },
    { name: "Power Backup", icon: "⚡" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Hostel <span className="text-blue-600">Facilities</span>
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience comfort, convenience, and safety with our comprehensive range of 
            world-class facilities designed to make your stay memorable and hassle-free.
          </p>
        </div>

        {/* Main Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {facilities.map((facility) => (
            <div key={facility.id} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
                
                {/* Header with Gradient */}
                <div className={`bg-gradient-to-r ${facility.bgColor} p-6 text-white`}>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-5xl">{facility.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-center">{facility.title}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {facility.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    {facility.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Amenities Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Amenities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              More conveniences to enhance your living experience
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {additionalAmenities.map((amenity, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-32">
                <div className="text-center">
                  <div className="text-3xl mb-2">{amenity.icon}</div>
                  <p className="text-sm font-medium text-gray-700">{amenity.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Premium Quality</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              All our facilities are maintained to the highest standards with regular 
              inspections and upgrades. We believe in providing only the best for our residents.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">24/7 Availability</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Most of our essential facilities like water, security, and hot water are 
              available round-the-clock to ensure your comfort at any time of the day.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Our Facilities?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-blue-100">Water & Security</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-blue-100">Power Backup</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <p className="text-blue-100">Core Facilities</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-blue-100">Support Available</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Facilities
