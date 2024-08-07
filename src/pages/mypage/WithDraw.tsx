import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const WithDraw: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-80">
                <h2 className="text-lg font-bold mb-4">회원탈퇴 확인</h2>
                <p className="mb-4">정말로 회원탈퇴를 하시겠습니까?</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onConfirm} className="bg-black text-white px-4 py-2 rounded-lg">
                        네
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                        아니오
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithDraw;
