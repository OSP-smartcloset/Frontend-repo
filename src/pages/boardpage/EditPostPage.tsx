import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    date: string;
    imageUrl?: string;
    commentsCount: number;
    nickname: string; // 추가된 필드
}

const EditPostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${postId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // 사용자 인증 토큰 추가
                    },
                });
                setPost(response.data);
                setTitle(response.data.title);
                setContent(response.data.content);
                setLoading(false);
            } catch (err) {
                setError('게시글을 가져오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSave = async () => {
        if (post) {
            try {
                const updatedPost = { ...post, title, content };
                await axios.put(`/api/posts/${post.id}`, updatedPost, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // 사용자 인증 토큰 추가
                    },
                });
                navigate(`/post/${post.id}`);
            } catch (err) {
                setError('게시글을 수정하는 데 실패했습니다.');
            }
        }
    };

    const handleBack = () => {
        navigate(`/post/${postId}`);
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="p-4">
            <div className="flex items-center">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6 cursor-pointer" />
                <h1 className="font-bold m-auto text-xl">게시글 수정</h1>
            </div>
            <hr className="w-full mt-2 mb-3" />
            <div className="mb-4">
                <label className="block mb-2 font-bold">제목</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-bold">내용</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-bold">작성자</label>
                <input
                    type="text"
                    value={post.nickname}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                />
            </div>
            {post.imageUrl && (
                <div className="mb-4">
                    <label className="block mb-2 font-bold">이미지</label>
                    <img src={post.imageUrl} alt="게시글 이미지" className="w-full h-auto" />
                </div>
            )}
            <button
                onClick={handleSave}
                className="bg-black w-full text-white px-4 py-2 rounded"
            >
                저장
            </button>
        </div>
    );
};

export default EditPostPage;
