import React, {useEffect} from 'react';
import './index.css'
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Login from "./membership/login/Login";
import SignUp from "./membership/signup/SignUp";
import HomePage from "./pages/homepage/HomePage";
import BoardPage from "./pages/boardpage/BoardPage";
import LikePage from "./pages/likepage/LikePage";
import MyPage from "./pages/mypage/MyPage";
import Logo from "./startlogo/start_logo"
import EditProfile from "./pages/mypage/EditProfile";


function App() {
    const [showLogo, setShowLogo] = React.useState(true);

    // 로고 보이는 시간 정하는 코드
    useEffect(()=>{
        const timer = setTimeout(()=> {
            setShowLogo(false);
        }, 3000);

        return () => clearTimeout(timer);
    },[]);

  return (
      <Router>
          <Routes>
              <Route path="/" element={showLogo ? <Logo /> : <Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/board" element={<BoardPage/>} />
              <Route path="/like" element={<LikePage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
      </Router>
  );
}

export default App;
