import React, { useState } from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";

function EditProfile() {
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || {};
    const [id, setId] = React.useState(user.email || '');

    const handleBack = () => {
        navigate('/edit-profile');
    }

    return (
        <div className="p-4">
            <div className="flex">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6"/>
                <h1 className="ml-5 text-xl font-bold">닉네임 변경</h1>
            </div>
            <div className="flex flex-col mt-8">
                <div className="w-full mb-3">
                    <div className="relative">
                        <input
                            id="id"
                            name="id"
                            type="text"
                            value={id}
                            placeholder="닉네임을 입력해주세요."
                            className="border rounded-lg w-full p-2 pr-20"
                            onChange={(e) => setId(e.target.value)}
                            readOnly={!!user.email}
                        />
                        <button
                            className="absolute border rounded-2xl border-black p-1 right-2 top-1/2 transform -translate-y-1/2 text-black text-sm">중복확인
                        </button>
                    </div>
                </div>
                <p className="ml-2 -mt-2 text-gray-400 text-xs">현재 닉네임: TEST</p>
                <button
                    className="w-full flex justify-center m-auto mt-5 bg-black text-white p-3 mb-3 rounded-lg"
                >변경하기
                </button>
            </div>

        </div>
    );
}

export default EditProfile;