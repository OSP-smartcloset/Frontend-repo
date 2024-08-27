import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import {FaArrowLeft} from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import Modal from './profileimagechange/ProfileImageChange'
import ConfirmModal from './WithDraw'
import axios from "axios";

function EditProfile() {
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [user, setUser] = useState({ nickname: '', loginId: '', weight: '', height: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const nickname = localStorage.getItem('nickname');
        const loginId = localStorage.getItem('loginId');
        const weight = localStorage.getItem('weight');
        const height = localStorage.getItem('height');

        if (nickname && loginId && weight && height) {
            setUser({ nickname, loginId, weight, height });
        }
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

    const handleChangeNickName = () => {
        navigate('/nickname');
    }

    const handlePassWordChange = () => {
        navigate('/password')
    }

    const handleInformChange = () => {
        navigate('/inform');
    }

    const handleBack = () => {
        navigate('/mypage');
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    const handleLogoutBtn = () => {
        navigate('/');
    };

    const handleConfirmDelete = async () => {
        try {
            // 서버에 회원탈퇴 요청
            const response = await axios.delete('/api/users/profile/delete');
            if (response.status === 200) {
                // 성공적으로 삭제되었을 경우
                localStorage.removeItem('token');  // 토큰 제거
                alert("회원탈퇴가 완료되었습니다.");
                navigate('/');  // 홈으로 리디렉션
            } else {
                alert("회원탈퇴에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원탈퇴 중 오류 발생:", error);
            alert("회원탈퇴 중 오류가 발생했습니다.");
        }

        closeConfirmModal();
    };

    return (
        <div className="p-4">
            <FaArrowLeft onClick={handleBack} className="w-6 h-6"/>
            <div className="flex items-center border-black w-full p-4 mt-3">
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
            </div>
            <div className="flex mt-3">
                <button className="w-full text-black border border-black rounded-lg mr-2" onClick={openModal}>
                    프로필 이미지 변경
                </button>
                <button className="w-full border border-black py-2 rounded-lg" onClick={handleChangeNickName}>
                    닉네임 변경
                </button>
            </div>
            <div className="flex">
                <button
                    className="border-b p-2 w-full mt-7 text-xl text-left"
                    onClick={handlePassWordChange}
                >비밀번호 변경
                </button>
                <IoIosArrowForward className="fixed right-0 w-6 h-6 mt-9 mr-3"/>
            </div>
            <div className="flex flex-col">
                <button className="p-2 w-full mt-7 text-xl text-left"
                        onClick={handleInformChange}>내 정보 수정
                </button>
                <p className="ml-2 -mt-2 text-gray-400 text-xs">키, 몸무게 설정</p>
                <hr/>
                <IoIosArrowForward className="fixed right-0 w-6 h-6 mt-9 mr-3"/>
            </div>
            <div className="flex">
                <button className="border-b p-2 w-full mt-7 text-xl text-left" onClick={openConfirmModal}>회원탈퇴</button>
                <IoIosArrowForward className="fixed right-0 w-6 h-6 mt-9 mr-3"/>
            </div>
            <div className="flex">
                <button className="border-b p-2 w-full mt-7 text-xl text-left" onClick={handleLogoutBtn}>로그아웃</button>
                <IoIosArrowForward className="fixed right-0 w-6 h-6 mt-9 mr-3"/>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}/>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default EditProfile;