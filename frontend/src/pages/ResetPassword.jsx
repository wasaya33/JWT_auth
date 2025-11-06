import React, { useContext, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendurl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  // --------------------
  // OTP Input Handling
  // --------------------
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("Text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // --------------------
  // Step 1: Send Reset Email
  // --------------------
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendurl}/api/auth/send-reset-otp`, { email });
      data.Success ? toast.success(data.message) : toast.error(data.message);
      if (data.Success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // --------------------
  // Step 2: Submit OTP
  // --------------------
  const onSubmitOtp = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el.value).join("");
    setOtp(otpArray);
    setIsOtpSubmitted(true);
  };

  // --------------------
  // Step 3: Submit New Password
  // --------------------
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendurl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      data.Success ? toast.success(data.message) : toast.error(data.message);
      if (data.Success) navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    }
  };

  // --------------------
  // Render
  // --------------------
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 cursor-pointer"
      />

      {/* Step 1: Email Form */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="shadow-lg w-96 text-sm bg-slate-900 p-8 rounded-lg"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3"
          >
            Submit
          </button>
        </form>
      )}

      {/* Step 2: OTP Form */}
      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOtp}
          className="shadow-lg w-96 text-sm bg-slate-900 p-8 rounded-lg"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Enter OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email.
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full"
          >
            Verify OTP
          </button>
        </form>
      )}

      {/* Step 3: New Password Form */}
      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className="shadow-lg w-96 text-sm bg-slate-900 p-8 rounded-lg"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password below.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none text-white w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
