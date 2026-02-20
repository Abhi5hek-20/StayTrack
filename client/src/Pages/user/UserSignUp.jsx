import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../../store/auth/authThunk";

const UserSignUp = () => {
  const dispatch = useDispatch();
  const { loading, error: signupError } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [localError, setLocalError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phno: "",
    studyYear: "",
    roomNo: "",
    parentName: "",
    parentPhno: "",
    guardianName: "",
    guardianPhno: "",
    aadharNo: "",
    clgId: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const allowedRoomNumbers = new Set([
    ...Array.from({ length: 6 }, (_, i) => String(101 + i)),
    ...Array.from({ length: 6 }, (_, i) => String(201 + i)),
    ...Array.from({ length: 6 }, (_, i) => String(301 + i)),
    ...Array.from({ length: 6 }, (_, i) => String(401 + i)),
    ...Array.from({ length: 7 }, (_, i) => String(501 + i)),
  ]);

  const isValidRoomNo = (roomNo) => allowedRoomNumbers.has(String(roomNo).trim());

  const error = signupError || localError;
  console.log(formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError("");
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (
          !formData.fullName ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          setLocalError("Please fill all personal details");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setLocalError("Passwords do not match");
          return false;
        }
        break;
      case 2:
        if (
          !formData.phno ||
          !formData.studyYear ||
          !formData.roomNo ||
          !formData.clgId
        ) {
          setLocalError("Please fill all academic details");
          return false;
        }
        if (!isValidRoomNo(formData.roomNo)) {
          setLocalError("User roomNo invalid");
          return false;
        }
        break;
      case 3:
        if (
          !formData.parentName ||
          !formData.parentPhno ||
          !formData.guardianName ||
          !formData.guardianPhno
        ) {
          setLocalError("Please fill all family details");
          return false;
        }
        break;
      case 4:
        if (!formData.aadharNo || !formData.address) {
          setLocalError("Please fill all verification details");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const nextStep = () =>
    validateStep(currentStep) && setCurrentStep((p) => p + 1);
  const prevStep = () => setCurrentStep((p) => p - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    if (!isValidRoomNo(formData.roomNo)) {
      setLocalError("User roomNo invalid");
      return;
    }
    const { confirmPassword, ...payload } = formData;
    dispatch(signUpUser(payload));
  };

  const stepTitles = [
    "Personal Information",
    "Academic Details",
    "Family Information",
    "Verification Details",
  ];

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 " +
    "focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
    "transition-all duration-200 text-gray-800 placeholder-gray-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl mb-4">
            <span className="text-white text-2xl font-bold">🏠</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            {stepTitles[currentStep - 1]}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round((currentStep / 4) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-blue-600 to-purple-700 transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStep === 1 && (
              <>
                <input
                  className={inputClass}
                  placeholder="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <input
                  className={inputClass}
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <input
                  className={inputClass}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <input
                  className={inputClass}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <input
                  className={inputClass}
                  placeholder="Phone Number"
                  name="phno"
                  value={formData.phno}
                  onChange={handleInputChange}
                />
                <select
                  className={inputClass}
                  name="studyYear"
                  value={formData.studyYear}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Study Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>

                <input
                  className={inputClass}
                  placeholder="Room Number"
                  name="roomNo"
                  value={formData.roomNo}
                  onChange={handleInputChange}
                />
                <input
                  className={inputClass}
                  placeholder="College ID"
                  name="clgId"
                  value={formData.clgId}
                  onChange={handleInputChange}
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                <input
                  className={inputClass}
                  placeholder="Parent Name"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                />
                <input
                  className={inputClass}
                  placeholder="Parent Phone"
                  name="parentPhno"
                  value={formData.parentPhno}
                  onChange={handleInputChange}
                />
                <input
                  className={inputClass}
                  placeholder="Guardian Name"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                />
                <input
                  className={inputClass}
                  placeholder="Guardian Phone"
                  name="guardianPhno"
                  value={formData.guardianPhno}
                  onChange={handleInputChange}
                />
              </>
            )}

            {currentStep === 4 && (
              <>
                <input
                  className={inputClass}
                  placeholder="Aadhar Number"
                  name="aadharNo"
                  value={formData.aadharNo}
                  onChange={handleInputChange}
                />
                <textarea
                  className={`${inputClass} resize-none`}
                  rows="3"
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Previous
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-blue-600 to-purple-700 hover:shadow-lg transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-2.5 rounded-xl text-white font-medium bg-gradient-to-r from-green-600 to-emerald-700 hover:shadow-lg transition disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;
