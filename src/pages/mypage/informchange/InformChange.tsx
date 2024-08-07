import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";

function InformChange() {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/edit-profile');
    }

    return (
        <div className="p-4">
            <div className="flex">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6"/>
                <h1 className="ml-5 text-xl font-bold">내 정보 수정</h1>
            </div>
            <div className="w-full mt-3 mb-3 flex flex-col">
                <div className="w-full mr-2 relative">
                    <label htmlFor="height">키</label>
                    <input
                        id="height"
                        name="height"
                        type="number"
                        value={height}
                        className="border rounded-lg w-full p-2 text-center"
                        onChange={(e) => setHeight(e.target.value)}
                    />
                    <p
                        className="absolute right-2 top-1/2 mr-1 text-black text-sm">cm
                    </p>
                </div>
                <div className="w-full mt-3">
                    <label htmlFor="weight">몸무게</label>
                    <div className="relative">
                        <input
                            id="weight"
                            name="weight"
                            type="number"
                            value={weight}
                            className="border rounded-lg w-full p-2 text-center"
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <p
                            className="absolute right-2 top-1/4 mr-1 text-black text-sm">kg
                        </p>
                    </div>
                </div>
                <button
                    className="w-full flex justify-center m-auto mt-5 bg-black text-white p-3 mb-3 rounded-lg"
                >변경하기
                </button>
            </div>
        </div>
    )
        ;
}

export default InformChange;