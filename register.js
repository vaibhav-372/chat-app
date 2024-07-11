import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const sendOtp = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      try {
        const response = await axios.post("http://localhost:5000/send-otp", {
          email,
        });
        setMessage(response.data.message);
        setOtpSent(true);
      } catch (error) {
        setMessage(`Error sending OTP: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", {
        email,
        name,
        password,
        otp,
      });
      setMessage(response.data.message);
      if (response.data.message.includes("OTP verified")) {
        setOtpVerified(true);
      }
    } catch (error) {
      setMessage(`Error verifying OTP: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {message && <p className="mb-4 text-purple-500">{message}</p>}
      {!otpSent ? (
        <div className="mb-3 w-full max-w-sm">
          <input
            type="email"
            className="form-input w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            className="form-input w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            className="form-input w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="form-input w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="w-full">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={sendOtp}
            >
              Send OTP
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <input
            type="text"
            className="form-input w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={verifyOtp}
          >
            Verify OTP
          </button>
        </div>
      )}
      {otpVerified && (
        <p className="mt-4 text-green-500">OTP verified successfully!</p>
      )}
    </div>
  );
};

export default Register;
