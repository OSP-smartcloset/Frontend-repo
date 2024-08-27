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
import NickNameChange from "./pages/mypage/nicknamechange/NickNameChange";
import PassWordChange from "./pages/mypage/passwordchange/PassWordChange";
import InformChange from "./pages/mypage/informchange/InformChange";
import EditPostPage from "./pages/boardpage/EditPostPage";
import AuthCallback from "./membership/login/AuthCallBack";


interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    date: string;
    commentsCount: number;
}

function App() {
    const [showLogo, setShowLogo] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLogo(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const addPost = (title: string, content: string, date: string) => {
        const newPost = {
            id: posts.length + 1,
            title,
            content,
            likes: 0,
            date,
            commentsCount: 0,
        };
        setPosts([...posts, newPost]);
    };

    const updatePostLikes = (postId: number, likes: number) => {
        setPosts(posts.map(post => post.id === postId ? { ...post, likes } : post));
    };

    const updatePost = (postId: number, updatedPost: Post) => {
        setPosts(posts.map(post => (post.id === postId ? updatedPost : post)));
    };

    const deletePost = (postId: number) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={showLogo ? <Logo /> : <Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/auth" element={<AuthCallback />} />
                <Route path="/board" element={<BoardPage />} />
                <Route path="/like" element={<LikePage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/write" element={<WritePage />} />
                <Route path="/post/:postId" element={<WriteDetailPage updatePostLikes={updatePostLikes} deletePost={deletePost}/>} />
                <Route path="/edit/:postId" element={<EditPostPage />}/>
                <Route path="/nickname" element={<NickNameChange/>}/>
                <Route path="/password" element={<PassWordChange/>}/>
                <Route path="/inform" element={<InformChange/>}/>
            </Routes>
        </Router>
    );
}

export default App;
