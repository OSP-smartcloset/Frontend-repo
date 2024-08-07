import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../../footer/Footer";
import { CiBellOn } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";

// @ts-ignore
const AlarmModal = ({ isOpen, onClose }) => {
    const [isAlarmOn, setIsAlarmOn] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">알림 설정</h2>
                    <button onClick={onClose} className="text-gray-500">&times;</button>
                </div>
                <div className="flex justify-between items-center">
                    <span>알림 설정</span>
                    <button
                        onClick={() => setIsAlarmOn(!isAlarmOn)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            isAlarmOn ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ease-in-out ${
                            isAlarmOn ? 'translate-x-6' : ''
                        }`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

function MyPage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([
        { id: 1, imageUrl: 'https://image.msscdn.net/thumbnails/display/images/usersnap/2023/06/06/77188ddf38ad4e1ebd1325fb249a88de.jpg?w=780' },
        { id: 2, imageUrl: 'https://image.msscdn.net/thumbnails/display/images/usersnap/2024/03/10/c5cce57c39e340499146800e4cc682fd.jpg?w=780' },
        { id: 3, imageUrl: 'https://static.lookpin.co.kr/20220610190749-01af/f3925ce08397ab61a95388f4097231b8.jpg' },
        // 더 많은 게시물 추가 가능
    ]);

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="pb-16">
            <h1 className="font-tenor text-xl ml-2 font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text inline-block">
                smartcloset
            </h1>
            <div>
                <CiBellOn className="fixed w-8 h-8 mr-1 top-0 right-0" onClick={toggleModal}/>
            </div>
            <div className="flex items-center border-b border-black w-full p-4 mt-10">
                <FaRegUserCircle className="w-16 h-16 mr-4"/>
                <div className="flex flex-col">
                    <p className="font-bold">닉네임</p>
                    <p>173cm 68kg</p>
                    <p>test@kakao.com</p>
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
            <Footer/>
        </div>
    );
}

export default MyPage;
