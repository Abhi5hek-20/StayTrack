import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser,loginAdmin } from "../store/auth/authThunk";


const Login = () => {
  const [role, setRole] = useState("user");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit =  (e) => {
    e.preventDefault();
    if(role === "admin") {
      // Dispatch admin login action
    
       dispatch(loginAdmin(loginData));
       setLoginData({ email: "", password: "" });
    } else {
      // Dispatch user login action
       dispatch(loginUser(loginData));
       setLoginData({ email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl px-8 py-10 transition-all">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">🏠</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {role === "admin" ? "Admin Login" : "Student Login"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to continue
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex mb-8 rounded-2xl bg-gray-100 p-1">
            {["user", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => {setRole(r); setLoginData({ email: "", password: "" })}}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  role === r
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                {r === "user" ? "Student" : "Admin"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={loginData.email}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/60 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 transition"
                >
                  👁️
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 hover:shadow-lg transition-all"
            >
              Sign In
            </button>
          </form>

          {/* Signup */}
          {role === "user" && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/user/signup"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
