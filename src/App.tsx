import React, { useEffect, useState } from 'react';
import './index.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./membership/login/Login";
import SignUp from "./membership/signup/SignUp";
import HomePage from "./pages/homepage/HomePage";
import BoardPage from "./pages/boardpage/BoardPage";
import LikePage from "./pages/likepage/LikePage";
import MyPage from "./pages/mypage/MyPage";
import Logo from "./startlogo/start_logo";
import EditProfile from "./pages/mypage/EditProfile";
import WritePage from "./pages/boardpage/WritePage";
import WriteDetailPage from "./pages/boardpage/WriteDetailPage";

function App() {
    const [showLogo, setShowLogo] = useState(true);
    const [posts, setPosts] = useState<{ id: number; title: string; content: string }[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLogo(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // 로컬 스토리지에서 게시글 로드
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts));
        }
    }, []);

    useEffect(() => {
        // 로컬 스토리지에 게시글 저장
        localStorage.setItem('posts', JSON.stringify(posts));
    }, [posts]);

    const addPost = (title: string, content: string) => {
        const newPost = {
            id: posts.length + 1,
            title,
            content
        };
        setPosts([...posts, newPost]);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={showLogo ? <Logo /> : <Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/board" element={<BoardPage posts={posts} />} />
                <Route path="/like" element={<LikePage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/write" element={<WritePage addPost={addPost} />} />
                <Route path="/post/:postId" element={<WriteDetailPage posts={posts} />} />
            </Routes>
        </Router>
    );
}

export default App;
