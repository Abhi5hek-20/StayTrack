import react, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import UserHome from "./Pages/user/UserHome.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import RequireUser from "./auth/RequireUser.jsx";
import { useDispatch, useSelector } from "react-redux";
import UserSignUp from "./Pages/user/UserSignUp.jsx";
import Login from "./Pages/Login.jsx";
import { checkAuth } from "./store/auth/authThunk.js";
import RequireAdmin from "./auth/RequireAdmin.jsx";
import UserProfile from "./Pages/user/UserProfile.jsx";
import UserContact from "./Pages/user/UserContact.jsx";

import UserFoodMenu from "./Components/user/FoodMenu.jsx";
import UserFacilities from "./Pages/user/Facilities.jsx";
import UserLogBook from "./Pages/user/Logbook.jsx";
import UserNotifications from "./Pages/user/Notifications.jsx";
import About from "./Pages/user/About.jsx";
import { useSocketSetup } from "./hooks/useSocketSetup.js";
import AdminDashBoard from "./Pages/admin/AdminDashBoard.jsx";
import AdminComplaint from "./Pages/admin/AdminComplaint.jsx";
import AdminProfile from "./Pages/admin/AdminProfile.jsx";
import AdminNotifications from "./Pages/admin/AdminNotifications.jsx";
import AdminAnnouncement from "./Pages/admin/AdminAnnouncement.jsx";
import PaymentHistory from "./Components/user/PaymentHistory.jsx";
import HandlePaymentsAdmin from "./Components/admin/HandlePayments.jsx";

function App() {
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [isAuthenticated, role, loading]);

  
  // Initialize WebSocket connection
  const { isConnected } = useSocketSetup()

  // Optional: Show connection status in dev mode
  useEffect(() => {
    console.log('🔌 Socket connection status:', isConnected ? 'Connected' : 'Disconnected')
  }, [isConnected])




  console.log(
    "Auth User in App.jsx:",
    isAuthenticated,
    "Role:",
    role,
    "Loading:",
    loading
  );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === "admin" ? (
                <Navigate to="/admin/home" />
              ) : (
                <Navigate to="/user/home" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login Route for Both */}
        <Route
          path="login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={role === "admin" ? "/admin/home" : "/user/home"} />
            )
          }
        />

        <Route path="/user">
          {/* Public User Routes */}
          <Route
            path="signup"
            element={
              !isAuthenticated ? <UserSignUp /> : <Navigate to="/user/home" />
            }
          />

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            {" "}
            // Protect all user routes
            <Route element={<RequireUser />}>
              {" "}
              // Protect user role routes
                  <Route path="home" element={<UserHome />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="contact" element={<UserContact />} />
                  <Route path="food-menu" element={<UserFoodMenu />} />
                  <Route path="facilities" element={<UserFacilities />} />
                  <Route path="logbook" element={<UserLogBook />} />
                  <Route path="notifications" element={<UserNotifications />} />
                  <Route path="about" element={<About />} />
                  <Route path="payment-history" element={<PaymentHistory />} />
              </Route>
            </Route>
          </Route>



        {/* Admin Routes */}

        <Route path="/admin">
          <Route element={<RequireAuth />}>
            {/* Protected Routes */}
            <Route element={<RequireAdmin />}>
              {" "}
              // Protect all admin routes
              <Route path="home" element={<AdminDashBoard />} />
              <Route path="complaints" element={<AdminComplaint />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="announcements" element={<AdminAnnouncement />} />
              <Route path="user-payment-history" element={<HandlePaymentsAdmin />} />
              
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
