import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";

function EditProfile() {
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/edit-profile');
    }

    return (
        <div className="p-4">
            <div className="flex">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6"/>
                <h1 className="ml-5 text-xl font-bold">닉네임 변경</h1>
            </div>
            <div className="flex flex-col mt-10">
                <input
                    id="id"
                    name="id"
                    type="text"
                    placeholder="닉네임 입력"
                    value={nickname}
                    className="border rounded-lg w-full p-2 mb-4"
                    onChange={(e) => setNickname(e.target.value)}
                ></input>
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