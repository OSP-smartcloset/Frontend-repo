import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaArrowLeft} from "react-icons/fa";

interface WritePageProps {
    addPost: (title: string, content: string) => void;
}

const WritePage: React.FC<WritePageProps> = ({ addPost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handlePostSubmit = () => {
        if (title && content) {
            addPost(title, content);
            navigate('/board');
        }
    };

    const handleBack = () => {
        navigate('/board'); // 게시글 목록 페이지로 이동
    };

    return (
        <div className="mt-4">
            <div className="flex items-center justify-center mb-4">
            <FaArrowLeft onClick={handleBack} className="w-6 h-6 cursor-pointer fixed left-3 -mt-3"/>
            <h2 className="text-2xl font-bold ml-4 mb-2">게시글 작성</h2>
            </div>
            <div className="flex flex-col items-center">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력해 주세요."
                    className="w-10/12 p-2 mb-4 border border-black rounded-lg"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력해주세요."
                    className="w-10/12 p-2 mb-2 border border-black rounded-lg h-32"
                />
                <div className="flex w-2/3">
                <button
                    onClick={handlePostSubmit}
                    className="text-black border border-black rounded-lg w-10/12 p-2 mt-2 mr-3"
                >
                    사진 추가
                </button>
                <button
                    onClick={handlePostSubmit}
                    className="text-black border border-black rounded-lg w-10/12 p-2 mt-2"
                >
                    게시글 작성
                </button>
            </div>
            </div>
        </div>
    );
}

export default WritePage;
