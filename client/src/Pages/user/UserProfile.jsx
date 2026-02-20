import React, { useState } from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Unable to load profile
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "hostel", label: "Hostel Details", icon: "🏠" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.fullName}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Room {user.roomNo} • {user.studyYear}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200 px-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 text-sm font-medium flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* PERSONAL INFO */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    ["Full Name", user.fullName],
                    ["Email", user.email],
                    ["Phone", user.phno],
                    ["Study Year", user.studyYear],
                    ["College ID", user.clgId],
                    ["Aadhar", user.aadharNo]
                  ].map(([label, value]) => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <input
                        disabled
                        value={value || ""}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-4">Parent Details</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input disabled value={user.parentName} className="input-readonly" />
                    <input disabled value={user.parentPhno} className="input-readonly" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-4">Guardian Details</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input disabled value={user.guardianName} className="input-readonly" />
                    <input disabled value={user.guardianPhno} className="input-readonly" />
                  </div>
                </div>
              </div>
            )}

            {/* HOSTEL INFO */}
            {activeTab === "hostel" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input disabled value={user.roomNo} className="input-readonly" />
                  <input
                    disabled
                    value={new Date(user.createdAt).toLocaleDateString()}
                    className="input-readonly"
                  />
                  <input disabled value={user.studyYear} className="input-readonly" />
                  <input disabled value={user.clgId} className="input-readonly" />
                </div>

                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    disabled
                    rows={3}
                    value={user.address}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          .input-readonly {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            background-color: #f9fafb;
            color: #4b5563;
          }
        `}
      </style>
    </div>
  );
};

export default UserProfile;
