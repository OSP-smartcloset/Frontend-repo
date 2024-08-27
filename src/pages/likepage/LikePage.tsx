import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../../footer/Footer";
// @ts-ignore
import exam from "../../image/exam.png";
import axios from "axios";

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    date: string;
    imageUrl: string; // 필요한 경우 추가
    commentsCount: number;
}


const LikePage: React.FC = () => {
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedPosts = () => {
            const likedPostsData = JSON.parse(localStorage.getItem('likedPosts') || '[]') as Post[];
            setLikedPosts(likedPostsData);
            setLoading(false);
        };

        fetchLikedPosts();
    }, []);

    useEffect(() => {
        // 서버에서 바이너리 프로필 이미지 로드하기
        const fetchProfileImage = async () => {
            try {
                const response = await axios.get('/api/users/profile-picture', {
                    responseType: 'blob' // 바이너리 데이터를 받아오기 위해 'blob' 타입 지정
                });

                if (response.data) {
                    // Blob 데이터를 URL로 변환
                    const imageUrl = URL.createObjectURL(response.data);
                    setProfileImageUrl(imageUrl); // 상태로 저장
                }
            } catch (error) {
                console.error('프로필 이미지를 불러오는 중 오류가 발생했습니다.', error);
            }
        };

        fetchProfileImage();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen">
            <header className="bg-white shadow-sm p-4">
                <h1 className="font-tenor text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text inline-block">
                    좋아요 한 게시물
                </h1>
            </header>
            <main className="container mx-auto p-4">
                {likedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {likedPosts.map((post, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                                 onClick={() => navigate(`/post/${post.id}`)}>
                                {post.imageUrl &&
                                    <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover"/>}
                                <div className="p-4">
                                    <div className="flex">
                                        {profileImageUrl && (
                                            <img src={profileImageUrl} alt={post.title} className="w-10 h-10 rounded-full" />
                                        )}
                                        <h3 className="text-xl font-bold ml-3 ">{post.id}</h3>
                                    </div>
                                    <h3 className="text-xl font-bold mt-2">{post.title}</h3>
                                    <p className="text-gray-600 mt-2 ml-1">{post.content}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <div>
                                            <span className="text-red-500">❤ {post.likes}</span>
                                            <span className="text-gray-500 ml-2">💬 {post.commentsCount}</span>
                                        </div>
                                        <span className="text-gray-400 text-sm">{post.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center">좋아요 한 게시물이 없습니다.</p>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default LikePage;
