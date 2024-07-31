import React from 'react';
import './index.css'
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Login from "./membership/login/Login";
import SignUp from "./membership/signup/SignUp";
import Home from "./main/Home";


function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<Home />} />
          </Routes>
      </Router>
  );
}

export default App;
