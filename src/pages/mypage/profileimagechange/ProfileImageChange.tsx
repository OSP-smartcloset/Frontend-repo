import React, { useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleChangeImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 파일 입력 클릭
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // 여기서 파일을 처리합니다 (업로드, 미리보기 등)
            console.log(file.name);
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
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-black text-white px-4 py-2 rounded-lg">닫기</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
