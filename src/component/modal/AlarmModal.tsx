import React, { useState, useEffect } from 'react';

// @ts-ignore
const AlarmModal = ({ isOpen, onClose }) => {
    const [isAlarmOn, setIsAlarmOn] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">알림 설정</h2>
                    <button onClick={onClose} className="text-gray-500">&times;</button>
                </div>
                <div className="flex justify-between items-center">
                    <span>알림 설정</span>
                    <button
                        onClick={() => setIsAlarmOn(!isAlarmOn)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${
                            isAlarmOn ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ease-in-out ${
                            isAlarmOn ? 'translate-x-6' : ''
                        }`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlarmModal;