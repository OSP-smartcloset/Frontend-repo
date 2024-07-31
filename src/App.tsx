import React from 'react';
import './index.css'
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Login from "./membership/login/Login";
import SignUp from "./membership/signup/SignUp";
import Home from "./pages/Home";
import BoardPage from "./pages/BoardPage";
import LikePage from "./pages/LikePage";
import MyPage from "./pages/MyPage";


function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<Home />} />
              <Route path="/board" element={<BoardPage/>} />
              <Route path="/like" element={<LikePage />} />
              <Route path="/mypage" element={<MyPage />} />
          </Routes>
      </Router>
  );
}

export default App;
