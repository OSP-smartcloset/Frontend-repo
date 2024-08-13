import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../../footer/Footer";
// @ts-ignore
import search from '../../image/search.png';
import {CiBellOn, CiSearch, CiSquarePlus} from "react-icons/ci";
import AlarmModal from "../../component/modal/AlarmModal";
import SearchModal from "../../component/modal/SearchModal";
// @ts-ignore
import exam from '../../image/exam.png'

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    date: string;
    imageUrl?: string;
    commentsCount: number;
}

interface BoardPageProps {
    posts: Post[];
}

const postsPerPage = 5;


const BoardPage: React.FC<BoardPageProps> = ({ posts }) => {
    const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageBlock, setCurrentPageBlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const navigate = useNavigate();

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleSearchModal = () => {
        setIsSearchModalOpen(!isSearchModalOpen);
    };

    useEffect(() => {
        setFilteredPosts(posts);
    }, [posts]);

    const getCurrentPosts = () => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    };

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const totalBlocks = Math.ceil(totalPages / 5);

    const handleSearchTitle = () => {
        if (!searchTerm.trim()) {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    };

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleNextBlock = () => {
        if (currentPageBlock < totalBlocks - 1) {
            setCurrentPageBlock(currentPageBlock + 1);
            setCurrentPage((currentPageBlock + 1) * 5 + 1);
        }
    };

    const handlePrevBlock = () => {
        if (currentPageBlock > 0) {
            setCurrentPageBlock(currentPageBlock - 1);
            setCurrentPage(currentPageBlock * 5);
        }
    };

    const getPageNumbers = () => {
        const startPage = currentPageBlock * 5 + 1;
        const endPage = Math.min(startPage + 4, totalPages);
        const pageNumbers = [];

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="min-h-screen">
            <header className="bg-white shadow-sm p-4">
                <h1 className="font-tenor text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text inline-block">
                    코디'ing
                </h1>
                <div className="relative flex justify-end items-center -mt-8 p-1">
                    <CiSearch className="w-8 h-8 cursor-pointer mr-2" onClick={toggleSearchModal}/>
                    <CiSquarePlus onClick={() => navigate('/write')} className="font-bold w-8 h-8 cursor-pointer mr-2"/>
                    <CiBellOn className="w-8 h-8 cursor-pointer" onClick={toggleModal}/>
                </div>
            </header>

            <main className="container mx-auto p-4">
                {/*<div*/}
                {/*    className="fixed bottom-32 border border-black w-11/12 rounded-xl flex items-center justify-center px-4">*/}
                {/*    <div className="relative w-full max-w-lg">*/}
                {/*        <input*/}
                {/*            type="text"*/}
                {/*            value={searchTerm}*/}
                {/*            onChange={(e) => setSearchTerm(e.target.value)}*/}
                {/*            onKeyPress={(e) => e.key === 'Enter' && handleSearchTitle()}*/}
                {/*            placeholder="제목을 입력해 주세요."*/}
                {/*            className="w-full mt-2 pl-10 mb-3 border-0 rounded"*/}
                {/*        />*/}
                {/*        <img*/}
                {/*            src={search}*/}
                {/*            alt="Search"*/}
                {/*            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"*/}
                {/*            onClick={handleSearchTitle}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {getCurrentPosts().map((post) => (
                        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                             onClick={() => navigate(`/post/${post.id}`)}>
                            {post.imageUrl &&
                                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover"/>}
                            <div className="p-4">
                                <div className="flex">
                                    <img src={exam} alt={post.title} className="w-10 h-10 rounded-full"/>
                                    <h3 className="text-xl font-bold ml-3 ">{post.id}</h3>
                                </div>
                                <h3 className="text-xl font-bold mt-2">{post.title}</h3>
                                <p className="text-gray-600 mt-2 ml-1">{post.content}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <div>
                                        <span className="text-red-500">❤ {post.likes}</span>
                                        <span className="text-gray-500 ml-2">💬 {post.commentsCount}</span>
                                    </div>
                                    <span className="text-gray-400 text-sm">{post.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <div className="fixed bottom-28 w-full h-20 flex justify-center items-center">
                <div className="text-black flex justify-center items-center">
                    {currentPageBlock > 0 && (
                        <button
                            className="mx-1 px-3 py-1 rounded hover:bg-gray-700"
                            onClick={handlePrevBlock}
                        >
                            이전
                        </button>
                    )}

                    {getPageNumbers().map((num) => (
                        <button
                            key={num}
                            className={`mx-1 px-3 py-1 rounded hover:font-bold ${currentPage === num ? 'font-bold' : ''}`}
                            onClick={() => handlePageClick(num)}
                        >
                            {num}
                        </button>
                    ))}

                    {currentPageBlock < totalBlocks - 1 && (
                        <button
                            className="mx-1 px-3 py-1 rounded hover:font-bold"
                            onClick={handleNextBlock}
                        >
                            다음
                        </button>
                    )}
                </div>
            </div>

            <AlarmModal isOpen={isModalOpen} onClose={toggleModal} />
            <SearchModal isOpen={isSearchModalOpen} onClose={toggleSearchModal} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearchTitle={handleSearchTitle} />
            <Footer/>
        </div>
    );
};

export default BoardPage;
