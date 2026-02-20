import React from 'react'

const About = () => {
  const teamMembers = [
    {
      name: "Abhishek",
      role: "Founder & Full Stack Developer",
      description: "Passionate full-stack developer with expertise in modern web technologies. Leading the technical vision and development of StayTrack.",
      skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "UI/UX"]
    },
    {
      name: "Rithin Rajpoot", 
      role: "Co-Founder & Designer",
      description: "Creative designer focused on user experience and visual aesthetics. Crafting intuitive interfaces that make hostel management seamless.",
      skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Prototyping", "User Research"]
    },
    {
      name: "Adarsh Chary",
      role: "Co-Founder & Manager", 
      description: "Strategic manager ensuring project delivery and team coordination. Bridging the gap between technical development and business objectives.",
      skills: ["Project Management", "Business Strategy", "Team Leadership", "Operations", "Planning"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hostel Information Section */}
        <div className="mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ankitha girls Hostel</h2>
              <p className="text-xl text-gray-600">A Modern Living Experience for Students</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Basic Info */}
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-blue-600">🏢</span>
                    Hostel Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-28 flex-shrink-0">Name:</span>
                      <span className="text-gray-600">Ankitha girls Hostel</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-28 flex-shrink-0">Established:</span>
                      <span className="text-gray-600">2024</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-28 flex-shrink-0">Type:</span>
                      <span className="text-gray-600">For Student Accommodation</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-28 flex-shrink-0">Capacity:</span>
                      <span className="text-gray-600">125</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-green-600">👥</span>
                    Management Team
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-28 flex-shrink-0">Owners:</span>
                      <span className="text-gray-600">A. Shashikala & A.Basavaraj</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-28 flex-shrink-0">Warden:</span>
                      <span className="text-gray-600">A. Ankitha</span>
                    </div>
                  
                  </div>
                </div>
              </div>

              {/* Right Column - Address & Facilities */}
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-purple-600">📍</span>
                    Address & Contact
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-28 flex-shrink-0">Address:</span>
                      <span className="text-gray-600">
                        Maisammaguda, opposite crazy backers road,<br />
                       
                        Hyderabad, Telangana - 500014
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-28 flex-shrink-0">Phone:</span>
                      <span className="text-gray-600">+91 78426 93349</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-28 flex-shrink-0">Email:</span>
                      <span className="text-gray-600">ankithagirlshostel@gmail.com</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-orange-600">🏠</span>
                    Key Facilities
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span className="text-gray-600 text-sm">24/7 Security</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span className="text-gray-600 text-sm">Wi-Fi Enabled</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span className="text-gray-600 text-sm">Mess Facility</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span className="text-gray-600 text-sm">Laundry Service</span>
                    </div>
                
                   
                    <div className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span className="text-gray-600 text-sm">Medical Aid</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span className="text-gray-600 text-sm">Parking Space</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg leading-relaxed max-w-4xl mx-auto">
                To provide a safe, comfortable, and technology-enabled living environment that supports students in their academic journey while fostering personal growth, community engagement, and lifelong friendships.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Developers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind StayTrack, dedicated to creating exceptional digital experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                {/* Image Placeholder - You can add images here */}
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built With Modern Technology</h2>
            <p className="text-gray-600">Leveraging cutting-edge technologies for optimal performance and user experience</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              { name: "React", icon: "⚛️" },
              { name: "Node.js", icon: "🟢" },
              { name: "MongoDB", icon: "🍃" },
              { name: "Express", icon: "🚀" },
              { name: "Tailwind", icon: "🎨" },
              { name: "JWT", icon: "🔐" },
              { name: "Socket.IO", icon: "🔌" }
            ].map((tech, index) => (
              <div key={index} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-3xl mb-2">{tech.icon}</div>
                <p className="text-sm font-medium text-gray-700">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you and discuss how StayTrack can benefit your institution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center">
              <span className="mr-2">📧</span>
              <span>abhishekamaragunda2004@gmail.com</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-2">📞</span>
              <span>+91 80882 66211</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default About
