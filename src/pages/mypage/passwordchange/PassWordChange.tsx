import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";

function PasswordChange() {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/edit-profile');
    }

    return (
        <div className="p-4">
            <div className="flex">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6"/>
                <h1 className="ml-5 text-xl font-bold">비밀번호 변경</h1>
            </div>
            <div className="flex flex-col mt-10">
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    value={password}
                    className="border rounded-lg w-full p-2 mb-4"
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="변경할 비밀번호 입력"
                    value={newPassword}
                    className="border rounded-lg w-full p-2 mb-4"
                    onChange={(e) => setNewPassword(e.target.value)}
                ></input>
                <button
                    className="w-full flex justify-center m-auto mt-5 bg-black text-white p-3 mb-3 rounded-lg"
                >변경하기
                </button>
            </div>

        </div>
    );
}

export default PasswordChange;