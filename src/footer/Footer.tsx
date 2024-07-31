import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'text-xl font-bold' : '';
    };

    return (
        <footer className="flex fixed bottom-0 left-0 right-0 items-center bg-white border-t p-4 justify-between space-x-4">
            <Link to="/home" className={`flex flex-col items-center space-y-1 ml-3 ${isActive('/home')}`}>
                <svg className={`w-6 h-6 ${isActive('/home')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className={isActive('/home')}>홈</span>
            </Link>
            <Link to="/board" className={`flex flex-col items-center space-y-1 ${isActive('/board')}`}>
                <svg className={`w-6 h-6 ${isActive('/board')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className={isActive('/board')}>게시판</span>
            </Link>
            <Link to="/like" className={`flex flex-col items-center space-y-1 ${isActive('/like')}`}>
                <svg className={`w-6 h-6 ${isActive('/like')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className={isActive('/like')}>좋아요</span>
            </Link>
            <Link to="/mypage" className={`flex flex-col items-center space-y-1 -ml-4 -mr-3${isActive('/mypage')}`}>
                <svg className={`w-6 h-6 ${isActive('/mypage')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={isActive('/mypage')}>마이페이지</span>
            </Link>
        </footer>
    );
};

export default Footer;
