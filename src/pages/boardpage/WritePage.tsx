import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

interface User {
    userId: number;
    loginId: string;
    loginPwd: string | null;
    nickname: string;
    height: number | null;
    weight: number | null;
    platform: string | null;
    gender: string | null;
    profilePicture: string | null;
    kakaoId: string | null;
}
const WritePage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('loginId');
        const nickname = localStorage.getItem('nickname');
        const loginPwd = localStorage.getItem('loginPwd');
        const height = localStorage.getItem('height');
        const weight = localStorage.getItem('weight');
        const platform = localStorage.getItem('platform');
        const gender = localStorage.getItem('gender');

        if (userId && nickname) {
            setUser({
                userId: Number(userId),
                loginId: userId,
                loginPwd,
                nickname,
                height: height ? Number(height) : null,
                weight: weight ? Number(weight) : null,
                platform,
                gender,
                profilePicture: null,
                kakaoId: null
            });
        }
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handlePostSubmit = async () => {
        const date = new Date().toISOString();

        if (title && content && user) {
            try {
                const response = await axios.post('/api/posts', {
                    title,
                    content,
                    date,
                    imageUrl: null,
                    likes: 0,
                    user
                });
                console.log('게시글 작성 성공:', response.data);
                navigate('/board');
            } catch (error) {
                console.error('게시글 작성에 실패했습니다', error);
            }
        } else {
            console.error('제목과 내용은 필수입니다.');
        }
    };

    // const handlePostWithImageSubmit = async () => {
    //     if (title && content && imageFile && user) {
    //         try {
    //             const formData = new FormData();
    //             formData.append('title', title);
    //             formData.append('content', content);
    //             formData.append('imageFile', imageFile);
    //             formData.append('user', JSON.stringify(user));
    //
    //             const response = await axios.post('/api/posts/withImage', formData, {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 },
    //             });
    //             console.log('이미지를 포함한 게시글 작성 성공:', response.data);
    //             navigate('/board');
    //         } catch (error) {
    //             console.error('이미지를 포함한 게시글 작성에 실패했습니다', error);
    //         }
    //     } else {
    //         console.error('제목, 내용, 이미지는 필수입니다.');
    //     }
    // };

    const handlePostWithImageSubmit = async () => {
        if (title && content && imageFile) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('imageFile', imageFile);

            try {
                const response = await axios.post('/api/posts/withImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('이미지를 포함한 게시글 작성 성공:', response.data);
                navigate('/board');
            } catch (error) {
                console.error('이미지를 포함한 게시글 작성에 실패했습니다', error);
            }
        } else {
            console.error('제목, 내용, 이미지는 필수입니다.');
        }
    };

    const handleBack = () => {
        navigate('/board');
    };

    // @ts-ignore
    // @ts-ignore
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
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-10/12 mb-2"
                />
                <div className="flex w-2/3">
                    <button
                        onClick={handlePostWithImageSubmit}
                        className="text-black border border-black rounded-lg w-10/12 p-2 mt-2 mr-3"
                    >
                        사진 게시글 등록
                    </button>
                    <button
                        onClick={handlePostSubmit}
                        className="text-black border border-black rounded-lg w-10/12 p-2 mt-2"
                    >
                        일반 게시글 등록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WritePage;