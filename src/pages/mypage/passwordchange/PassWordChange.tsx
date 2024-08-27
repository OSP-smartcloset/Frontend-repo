import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

function PasswordChange() {
    const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호 상태
    const [newPassword, setNewPassword] = useState(""); // 새 비밀번호 상태
    const [error, setError] = useState(""); // 에러 메시지 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/edit-profile');
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        setError(""); // 에러 초기화
        setLoading(true); // 로딩 상태 활성화

        try {
            const response = await axios.patch('api/users/change/password', {
                currentPassword,
                newPassword,
            });

            if (response.status === 200) {
                // 성공적인 응답 처리
                alert("비밀번호가 성공적으로 변경되었습니다.");
                navigate('/edit-profile');
            } else {
                // 응답에 포함된 에러 메시지 처리
                setError(response.data);
            }
        } catch (error) {
            // 예기치 않은 에러 처리
            setError("비밀번호 변경 중 오류가 발생했습니다.");
        } finally {
            setLoading(false); // 로딩 상태 비활성화
        }
    };

    return (
        <div className="p-4">
            <div className="flex">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6" />
                <h1 className="ml-5 text-xl font-bold">비밀번호 변경</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col mt-10">
                <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    value={currentPassword}
                    className="border rounded-lg w-full p-2 mb-4"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="변경할 비밀번호 입력"
                    value={newPassword}
                    className="border rounded-lg w-full p-2 mb-4"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                {error && <p className="text-red-500">{error}</p>} {/* 에러 메시지 표시 */}
                <button
                    type="submit"
                    className="w-full flex justify-center m-auto mt-5 bg-black text-white p-3 mb-3 rounded-lg"
                    disabled={loading} // 로딩 중에는 버튼 비활성화
                >
                    {loading ? "변경 중..." : "변경하기"}
                </button>
            </form>
        </div>
    );
}

export default PasswordChange;
