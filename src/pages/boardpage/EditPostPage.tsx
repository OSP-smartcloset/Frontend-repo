import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {FaArrowLeft} from "react-icons/fa6";

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    date: string;
    imageUrl?: string;
    commentsCount: number;
}

interface EditPostPageProps {
    posts: Post[];
    updatePost: (postId: number, updatedPost: Post) => void;
}

const EditPostPage: React.FC<EditPostPageProps> = ({ posts, updatePost }) => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const post = posts.find(p => p.id === parseInt(postId || '', 10));

    const [title, setTitle] = useState(post ? post.title : '');
    const [content, setContent] = useState(post ? post.content : '');

    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;
    }

    const handleSave = () => {
        const updatedPost = { ...post, title, content };
        updatePost(post.id, updatedPost);
        navigate(`/post/${post.id}`);
    };

    const handleBack = () => {
        navigate(`/post/${post.id}`);
    }

    return (
        <div className="p-4">
            <div className="flex">
            <FaArrowLeft onClick={handleBack} className="w-6 h-6"/>
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
