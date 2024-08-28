import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../../footer/Footer";
import { CiBellOn } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import axios from 'axios';
import AlarmModal from '../../component/modal/AlarmModal';

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    date: string;
    imageUrl?: string;
    commentsCount: number;
}

function MyPage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [user, setUser] = useState({ nickname: '', loginId: '', weight: '', height: '' });

    // 로컬스토리지에서 사용자 정보 가져오기
    useEffect(() => {
        const nickname = localStorage.getItem('nickname');
        const loginId = localStorage.getItem('loginId');
        const weight = localStorage.getItem('weight');
        const height = localStorage.getItem('height');
        const storedProfileImageUrl = localStorage.getItem('profile_image'); // 프로필 이미지 가져오기

        if (nickname && loginId && weight && height) {
            setUser({ nickname, loginId, weight, height });
        }
        if (storedProfileImageUrl) {
            setProfileImageUrl(storedProfileImageUrl); // 로컬스토리지에서 가져온 프로필 이미지 설정
        }
    }, []);

    const fetchUserPosts = async () => {
        try {
            const token = localStorage.getItem('token'); // 로그인 토큰 확인
            if (!token) {
                console.error('토큰이 없습니다.');
                return;
            }

            const response = await axios.get('/api/posts/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('성공 응답:', response);
            console.log('응답 데이터:', response.data);

            setPosts(response.data); // 사용자의 게시글 상태에 저장
        } catch (error: any) {
            console.error('사용자의 게시글을 가져오는데 실패했습니다', error);
            if (error.response) {
                console.log('에러 응답:', error.response);
                console.log('에러 응답 데이터:', error.response.data);
                console.log('에러 상태 코드:', error.response.status);
            }
        }
    };


    useEffect(() => {
        fetchUserPosts();
    }, []);

    // 프로필 이미지를 서버에서 불러오는 함수
    useEffect(() => {
        const fetchProfileImage = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/api/users/profile-picture', {
                    responseType: 'blob',// 바이너리 데이터를 받아오기 위해 'blob' 타입 지정
                    headers: {
                        'Authorization': `Bearer ${token}`, // 인증 헤더 추가
                    },
                });

                if (response.data) {
                    const imageUrl = URL.createObjectURL(response.data);
                    setProfileImageUrl(imageUrl); // 상태에 프로필 이미지 저장
                }
            } catch (error) {
                console.error('프로필 이미지를 불러오는 중 오류가 발생했습니다.', error);
            }
        };

        fetchProfileImage();
    }, []);

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="pb-16">
            <div className="bg-white shadow-sm">
                <h1 className="font-tenor text-2xl p-4 ml-2 font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text inline-block">
                    코디'ing
                </h1>
            </div>
            <div>
                <CiBellOn className="fixed w-8 h-8 mr-1 mt-4 top-0 right-2" onClick={toggleModal} />
            </div>
            <div className="flex items-center border-b border-black w-full p-4 mt-3">
                {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="w-16 h-16 rounded-full mr-4 object-cover" />
                ) : (
                    <FaRegUserCircle className="w-16 h-16 mr-4" />
                )}
                <div className="flex flex-col">
                    <p className="font-bold">{user.nickname}</p>
                    <p>{user.height}cm {user.weight}kg</p>
                    <p>{user.loginId}</p>
                </div>
                <button
                    className="ml-auto border border-black rounded-xl p-2 text-sm"
                    onClick={handleEditProfile}
                >
                    프로필 수정
                </button>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-bold ml-4 mb-2">내 게시글</h2>
                <div className="grid grid-cols-3 gap-1">
                    {posts.map(post => (
                        <img key={post.id} src={post.imageUrl} alt="Post" className="w-full h-32 object-cover" />
                    ))}
                </div>
            </div>
            <AlarmModal isOpen={isModalOpen} onClose={toggleModal} />
            <Footer />
        </div>
    );
}

export default MyPage;
