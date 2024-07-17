import React, { useState } from "react";
import axios from "axios";
import LoginForm from "./LoginForm";
import Toast from "../Toast";
import Home from "../home-component/home";

const Login = () => {
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:5000/login", values);
      const { data, status } = response;
      if (status === 200) {
        setMessage(data.message);
        setToastType("success");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setToastType("error");
    } finally {
      setShowToast(true);
      setSubmitting(false);
    }
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
      {!handleLogin?(
          <LoginForm onSubmit={handleLogin} />
      ):(
      <Home/>
      )}
    </div>
  );
};

export default Login;
