import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from "../../footer/Footer";
// @ts-ignore
import search from '../../image/search.png';
import { CiBellOn, CiSearch, CiSquarePlus } from "react-icons/ci";
import AlarmModal from "../../component/modal/AlarmModal";
import SearchModal from "../../component/modal/SearchModal";
// @ts-ignore
import exam from '../../image/exam.png'
import {FaRegUserCircle} from "react-icons/fa";

interface User {
    userId: number;
    loginId: string;
    nickname: string;
    profilePicture: string | null;
    height: number;
    weight: number;
    platform: string;
    gender: string;
    date: string;
    kakaold: string | null;
}

interface PostResponse {
    id: number;
    title: string;
    content: string;
    likes: number;
    date: string;
    imageUrl: string | null;
    commentsCount: number;
    nickname : string;
    userId: number;
}

const BASE_URL = 'http://ec2-13-124-254-196.ap-northeast-2.compute.amazonaws.com:8080'; // 서버의 기본 URL

const postsPerPage = 5;

const BoardPage: React.FC = () => {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<PostResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false); // 로딩 상태 추가
    const [hasMorePosts, setHasMorePosts] = useState(true); // 더 로드할 게시물이 있는지 확인하는 상태
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [user, setUser] = useState({ nickname: '', loginId: '', weight: '', height: '' });
    const observer = useRef<IntersectionObserver | null>(null);

    const navigate = useNavigate();

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleSearchModal = () => {
        setIsSearchModalOpen(!isSearchModalOpen);
    };

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

    const fetchPosts = async () => {
        try {
            const response = await axios.get<PostResponse[]>('/api/posts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('API Response:', response.data);
            const postsData = response.data; // 데이터를 상태로 설정
            setPosts(postsData);
            setFilteredPosts(postsData);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const fetchMorePosts = async () => {
        if (isLoadingMore || !hasMorePosts) return; // 이미 로딩 중이거나 더 이상 로드할 게시물이 없을 때 중지
        setIsLoadingMore(true); // 로딩 상태 표시

        try {
            const lastPostId = posts[posts.length - 1]?.id || 0; // 마지막 게시물의 ID
            const response = await axios.get<PostResponse[]>(`/api/posts/loadMore`, {
                params: {
                    lastPostId,
                    limit: postsPerPage
                }
            });

            const morePosts = response.data;

            if (morePosts.length < postsPerPage) {
                setHasMorePosts(false); // 더 이상 로드할 게시물이 없음을 알림
            }

            setPosts([...posts, ...morePosts]); // 추가된 게시물 목록을 기존 게시물에 합치기
            setFilteredPosts([...posts, ...morePosts]); // 필터링된 목록도 업데이트
        } catch (error) {
            console.error('추가 게시물을 가져오는데 실패했습니다', error);
        } finally {
            setIsLoadingMore(false); // 로딩 상태 해제
        }
    };
    useEffect(() => {
        // 서버에서 바이너리 프로필 이미지 로드하기
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
                    // Blob 데이터를 URL로 변환
                    const imageUrl = URL.createObjectURL(response.data);
                    setProfileImageUrl(imageUrl); // 상태로 저장
                }
            } catch (error) {
                setProfileImageUrl(profileImageUrl);
            }
        };

        fetchProfileImage();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        setFilteredPosts(posts);
    }, [posts]);

    useEffect(() => {
        if (!isLoadingMore && hasMorePosts) {
            const options = {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 1.0 // 100% 보일 때
            };

            const callback = (entries: IntersectionObserverEntry[]) => {
                if (entries[0].isIntersecting) {
                    fetchMorePosts(); // 관찰된 요소가 보일 때 추가 게시물 로드
                }
            };

            observer.current = new IntersectionObserver(callback, options);
            const target = document.querySelector('#load-more-trigger');
            if (target) {
                observer.current.observe(target);
            }

            return () => {
                if (observer.current) observer.current.disconnect();
            };
        }
    }, [isLoadingMore, hasMorePosts, posts]);

    const handleSearchTitle = async () => {
        try {
            if (!searchTerm.trim()) {
                // 검색어가 없을 경우, 전체 게시물을 다시 가져옴
                fetchPosts();
            } else {
                const token = localStorage.getItem('token'); // 토큰 가져오기
                const response = await axios.get('/api/posts/search', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        title: searchTerm // 검색어 전달
                    }
                });
                setFilteredPosts(response.data); // 서버에서 검색된 게시물 목록을 설정
            }
        } catch (error) {
            console.error('게시글 검색에 실패했습니다.', error);
        }
    };


    return (
        <div className="min-h-screen">
            <header className="bg-white shadow-sm p-4">
                <h1 className="font-tenor text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text inline-block">
                    코디'ing
                </h1>
                <div className="relative flex justify-end items-center -mt-8 p-1">
                    <CiSearch className="w-8 h-8 cursor-pointer mr-2" onClick={toggleSearchModal}/>
                    <CiSquarePlus onClick={() => navigate('/write')} className="font-bold w-8 h-8 cursor-pointer mr-2"/>
                    <CiBellOn className="w-8 h-8 cursor-pointer" onClick={toggleModal}/>
                </div>
            </header>

            <main className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                             onClick={() => navigate(`/post/${post.id}`)}>
                            {post?.imageUrl &&
                                <img src={`${BASE_URL}${post.imageUrl}`} alt={post.title} className="w-full h-48 object-cover"/>}
                            <div className="p-4">
                                <div className="flex">
                                    {profileImageUrl ? (
                                        <img src={profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full mr-4 object-cover" />
                                    ) : (
                                        <FaRegUserCircle className="w-8 h-8 mr-4" />
                                    )}
                                    <h3 className="text-xl font-bold ">{post.nickname || 'Anonymous'}</h3>
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

                {/* 스크롤 끝 감지용 요소 */}
                <div id="load-more-trigger" style={{height: '20px'}}></div>
            </main>

            <AlarmModal isOpen={isModalOpen} onClose={toggleModal}/>
            <SearchModal isOpen={isSearchModalOpen} onClose={toggleSearchModal} searchTerm={searchTerm}
                         setSearchTerm={setSearchTerm} handleSearchTitle={handleSearchTitle}/>
            <Footer/>
        </div>
    );
};

export default BoardPage;
