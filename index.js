import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Register from "../src/register-components/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Login from "./login-component/Login";
import Home from "./home-component/home";



ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="home" element={<Home />} />
    </Routes>
    
  </BrowserRouter>,
  document.getElementById("root")
);
