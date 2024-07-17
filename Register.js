import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import OtpVerificationForm from "./OtpVerificationForm";
import Toast from "../Toast";
// import Home from "../home-component/home";

const Register = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [email, setEmail] = useState(""); // New state variable to store email

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  };

  const otpInitialValues = {
    email, // Removed the assignment from initialValues.email
    otp: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required")
      .matches(/@gmail\.com$/, "Email must be a Gmail address"),
    name: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const otpValidationSchema = Yup.object({
    otp: Yup.string().required("OTP is required"),
  });

  const sendOtp = async (values, { setSubmitting }) => {
    try {
      const dataToSend = { ...values, statusCode: 200 };
      const response = await axios.post(
        "http://localhost:5000/send-otp",
        dataToSend
      );
      const { data, status } = response;
      if (status === 200 && data.statusCode === 200) {
        handleResponse(data);
        setOtpSent(true);
        setEmail(values.email); // Store email in state
        setToastType("success");
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setMessage(
        `Error sending OTP: ${error.response?.data?.message || error.message}`
      );
      setToastType("error");
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyOtp = async (values, { setSubmitting, resetForm }) => {
    try {
      const { otp } = values; // Destructure otp from form values
      const dataToSend = { email, otp, statusCode: 200 }; // Construct data to send

      console.log(dataToSend);

      const response = await axios.post(
        "http://localhost:5000/verify-otp",
        dataToSend
      );

      if (response && response.data) {
        handleResponse(response.data);
        setToastType("success");
        if (response.data.statusCode === 200) {
          setOtpVerified(true);
          resetForm();
          navigate("/home") // Redirect to home page
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setMessage(
        `Error verifying OTP: ${error.response?.data?.message || error.message}`
      );
      setToastType("error");
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResponse = (data) => {
    setMessage(data.message);
    setToastType(data.statusCode === 200 ? "success" : "error");
    setShowToast(true);
  };

  const closeToast = () => {
    setShowToast(false);
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <Toast
        showToast={showToast}
        message={message}
        toastType={toastType}
        closeToast={closeToast}
      />
      {!otpSent ? (
        <RegisterForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={sendOtp}
        />
      ) : (
        <OtpVerificationForm
          otpInitialValues={otpInitialValues}
          otpValidationSchema={otpValidationSchema}
          onSubmit={verifyOtp}
        />
      )}
      {otpVerified}
    </div>
  );
};

export default Register;
