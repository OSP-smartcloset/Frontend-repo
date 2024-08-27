import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import axios from 'axios';

function InformChange() {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/edit-profile');
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token'); // JWT 토큰 가져오기

            // 숫자 형식으로 변환 후 API에 전달
            const updatedHeight = parseFloat(height);
            const updatedWeight = parseFloat(weight);

            // API 요청
            const response = await axios.patch(
                '/api/users/profile/update',
                { height: updatedHeight, weight: updatedWeight },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // 성공적으로 프로필 업데이트 후 로컬 스토리지에 저장
            localStorage.setItem('height', updatedHeight.toString());
            localStorage.setItem('weight', updatedWeight.toString());

            // 성공 시 알림 또는 리다이렉트 처리
            console.log('프로필 수정 성공:', response.data);
            alert('프로필이 성공적으로 수정되었습니다!');
            navigate('/edit-profile'); // 원하는 페이지로 리다이렉트
        } catch (error: any) {
            console.error('프로필 수정 실패:', error);
            if (error.response) {
                console.log('에러 응답 데이터:', error.response.data);
                alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6 cursor-pointer" />
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
                    <p className="absolute right-2 top-1/2 mr-1 text-black text-sm">cm</p>
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
                        <p className="absolute right-2 top-1/4 mr-1 text-black text-sm">kg</p>
                    </div>
                </div>
                <button
                    className="w-full flex justify-center m-auto mt-5 bg-black text-white p-3 mb-3 rounded-lg"
                    onClick={handleSubmit} // 변경 사항 적용 버튼
                >
                    변경하기
                </button>
            </div>
        </div>
    );
}

export default InformChange;
