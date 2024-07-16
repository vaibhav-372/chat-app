import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const initialValues = {
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    flag:0,
  };

  const otpInitialValues = {
    email:"",
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
    email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(/@gmail\.com$/, "Email must be a Gmail address"), // Adding email validation
    otp: Yup.string().required("OTP is required"),
  });

  const sendOtp = async (values, { setSubmitting }) => {
    try {
      const dataToSend = { ...values, statusCode: 200 };
      const response = await axios.post("http://localhost:5000/send-otp", dataToSend);
      const { data, status } = response;
      if (status === 200 && data.statusCode === 200) {
        handleResponse(data);
        setOtpSent(true);
        setToastType("success");
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setMessage(`Error sending OTP: ${error.response?.data?.message || error.message}`);
      setToastType("error");
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyOtp = async (values, { setSubmitting }) => {
    try {
      const otpToSend = { email: values.email, otp: values.otp, statusCode: 200 };
      const response = await axios.post("http://localhost:5000/verify-otp", otpToSend);
      if (response && response.data) {
        handleResponse(response.data);
        setToastType("success");
        if (response.data.statusCode === 200) {
          setOtpVerified(true);
          // resetForm(); // Reset the OTP form fields
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setMessage(`Error verifying OTP: ${error.response?.data?.message || error.message}`);
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
      {showToast && (
        <div
          className={`max-w-xs border rounded-lg shadow-lg fixed top-4 right-4 z-50 ${
            toastType === "success"
              ? "bg-green-100 border-green-200 text-green-800"
              : "bg-red-100 border-red-200 text-red-800"
          }`}
          role="alert"
        >
          <div className="flex p-4">
            <div>{message}</div>
            <div className="ml-auto">
              <button
                type="button"
                className="inline-flex justify-center items-center w-5 h-5 rounded-full text-gray-800 hover:opacity-100 focus:outline-none"
                onClick={closeToast}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {!otpSent ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={sendOtp}
        >
          {({ isSubmitting }) => (
            <>
              <h2 className="text-2xl font-bold mb-4">Register</h2>
              <Form className="mb-3 w-full max-w-sm">
                <div className="mb-4">
                  <Field
                    type="email"
                    name="email"
                    className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <Field
                    type="text"
                    name="name"
                    className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <Field
                    type="password"
                    name="password"
                    className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    Send OTP
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={otpInitialValues}
          validationSchema={otpValidationSchema}
          onSubmit={verifyOtp}
        >
          {({ isSubmitting }) => (
            <>
              <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
              <Form className="mb-3 w-full max-w-sm">
                <div className="mb-4">
                  <Field
                    type="text"
                    name="otp"
                    className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter OTP"
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  >
                    Verify OTP
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      )}
      {otpVerified && (
        <p className="mt-4 text-green-500">OTP verified successfully!</p>
      )}
    </div>
  );
};

export default Register;
