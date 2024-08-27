import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

function EditProfile() {
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [nicknameAvailable, setNicknameAvailable] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || {};
    const [users, setUser] = useState({ nickname: '', loginId: '' });

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        const loginId = localStorage.getItem('loginId');

        if (storedNickname && loginId) {
            setUser({ nickname: storedNickname, loginId });
            setNickname(storedNickname); // 현재 닉네임 상태를 업데이트
        }
    }, []);

    const handleBack = () => {
        navigate('/edit-profile');
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.patch('/api/users/change/nickname', {
                newNickname: nickname,
            });

            if (response.status === 200) {
                // 성공적으로 닉네임을 변경한 경우
                localStorage.setItem('nickname', nickname); // 로컬 스토리지 업데이트
                setUser(prevState => ({ ...prevState, nickname })); // 상태 업데이트
                alert("닉네임이 성공적으로 변경되었습니다.");
                navigate('/edit-profile'); // 페이지 이동
            } else {
                setError(response.data);
            }
        } catch (error) {
            setError("닉네임 변경 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const checkNicknameAvailability = async () => {
        if (nickname.trim() === '') {
            alert('닉네임을 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch(`/api/users/check/nickname?nickname=${encodeURIComponent(nickname)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('닉네임 중복 확인 실패');
            }

            const data = await response.json();
            setNicknameAvailable(data.available);
            alert(data.available ? '닉네임 사용 가능' : '닉네임 이미 사용 중');
        } catch (error: any) {
            alert(`닉네임 중복 확인 에러: ${error.message}`);
        }
    };

    return (
        <div className="p-4">
            <div className="flex">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6" />
                <h1 className="ml-5 text-xl font-bold">닉네임 변경</h1>
            </div>
            <div className="flex flex-col mt-8">
                <div className="w-full mb-3">
                    <div className="relative">
                        <input
                            id="nickname"
                            name="nickname"
                            type="text"
                            value={nickname}
                            placeholder="닉네임을 입력해주세요."
                            className="border rounded-lg w-full p-2 pr-20"
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        <button
                            className="absolute border rounded-2xl border-black p-1 right-2 top-1/2 transform -translate-y-1/2 text-black text-sm"
                            onClick={checkNicknameAvailability}
                        >
                            중복확인
                        </button>
                    </div>
                </div>
                <p className="ml-2 -mt-2 text-gray-400 text-xs">현재 닉네임: {users.nickname || 'TEST'}</p>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    className="w-full flex justify-center m-auto mt-5 bg-black text-white p-3 mb-3 rounded-lg"
                    onClick={handleSubmit}
                    disabled={loading} // 로딩 중 버튼 비활성화
                >
                    {loading ? "변경 중..." : "변경하기"}
                </button>
            </div>
        </div>
    );
}

export default EditProfile;
