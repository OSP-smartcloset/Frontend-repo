import React from 'react'
// @ts-ignore
import searchIcon from '../../image/search.png';

// 검색 모달 컴포넌트
// @ts-ignore
const SearchModal = ({ isOpen, onClose, searchTerm, setSearchTerm, handleSearchTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">검색</h2>
                    <button onClick={onClose} className="text-gray-500">&times;</button>
                </div>
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchTitle()}
                        placeholder="제목을 입력해 주세요."
                        className="w-full mt-2 pl-10 mb-3 border-0 rounded"
                    />
                    <img
                        src={searchIcon}
                        alt="Search"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                        onClick={handleSearchTitle}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchModal;