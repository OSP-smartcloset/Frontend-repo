import React, { useRef, useState } from 'react';
import axios from 'axios';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleChangeImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 파일 입력 클릭
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            setLoading(true);
            setError("");

            try {
                const response = await axios.put('/api/users/profile-picture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // 필요 시 인증 헤더 추가
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // 사용자 인증 토큰 추가
                    },
                });

                if (response.status === 200) {
                    alert('프로필 사진이 성공적으로 변경되었습니다.');
                    onClose(); // 변경 후 모달 닫기
                } else {
                    setError('파일 업로드에 실패했습니다.');
                }
            } catch (error) {
                setError('파일 업로드 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-80">
                <h2 className="text-lg font-bold mb-1">프로필 이미지 변경</h2>
                <hr className="w-full"/>
                <button
                    onClick={handleChangeImage}
                    className="text-black text-lg mb-4 mt-3"
                >
                    이미지 변경
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" // 숨기기
                />
                {loading && <p>업로드 중...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-black text-white px-4 py-2 rounded-lg">닫기</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
