import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import {FaArrowLeft} from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import Modal from './profileimagechange/ProfileImageChange'
import ConfirmModal from './WithDraw'

function EditProfile() {
    const [nickname, setNickname] = useState('닉네임');
    const [height, setHeight] = useState('173');
    const [weight, setWeight] = useState('68');
    const [email, setEmail] = useState('test@kakao.com');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const navigate = useNavigate();

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

    const handleConfirmDelete = () => {
        // 실제 회원탈퇴 로직을 여기에 추가
        console.log("회원탈퇴 처리");
        closeConfirmModal();
    };

    return (
        <div className="p-4">
            <FaArrowLeft onClick={handleBack} className="w-6 h-6"/>
            <div className="flex items-center border-black w-full p-4 mt-3">
                <FaRegUserCircle className="w-16 h-16 mr-4"/>
                <div className="flex flex-col">
                    <p className="font-bold">닉네임</p>
                    <p>173cm 68kg</p>
                    <p>test@kakao.com</p>
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
                >비밀번호 변경</button>
                <IoIosArrowForward className="fixed right-0 w-6 h-6 mt-9 mr-3"/>
            </div>
            <div className="flex flex-col">
                <button className="p-2 w-full mt-7 text-xl text-left"
                onClick={handleInformChange}>내 정보 수정</button>
                <p className="ml-2 -mt-2 text-gray-400 text-xs">키, 몸무게 설정</p>
                <hr/>
                <IoIosArrowForward className="fixed right-0 w-6 h-6 mt-9 mr-3"/>
            </div>
            <div className="flex">
                <button className="border-b p-2 w-full mt-7 text-xl text-left" onClick={openConfirmModal}>회원탈퇴</button>
                <IoIosArrowForward className="fixed right-0 w-6 h-6 mt-9 mr-3"/>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} />
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default EditProfile;