import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../../footer/Footer";
// @ts-ignore
import search from '../../image/search.png';
// @ts-ignore
import hot from '../../image/hot.png'

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    date: string;
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
    const navigate = useNavigate();

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

    const hotPosts = posts
        .filter(post => post.likes > 0)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 2);

    return (
        <div>
            <h1 className="font-tenor text-xl ml-2 font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text inline-block">
                smartcloset
            </h1>
            <div className="mt-14 bg-pink-200">
                {hotPosts.map(post => (
                    <div key={post.id} className="flex border-b p-2 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                        <img src={hot} alt="hot" className="mr-2"/>
                        <h3 className="mt-1 font-bold">{post.title}</h3>
                        <p className="fixed right-2 mt-1 text-gray-600">{post.date}</p>
                    </div>
                ))}
            </div>
            <div>
                <div>
                    {getCurrentPosts().map((post) => (
                        <div key={post.id} className="flex justify-between border-b p-2" onClick={() => navigate(`/post/${post.id}`)}>
                            <h3 className="font-bold">{post.title}</h3>
                            <p className="text-gray-600">{post.date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="fixed bottom-32 border border-black w-11/12 ml-4 rounded-xl flex items-center justify-center px-4">
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
                        src={search}
                        alt="Search"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                        onClick={handleSearchTitle}
                    />
                </div>
            </div>
            <div className="fixed bottom-44 w-full h-20 flex justify-center items-center">
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

            <button
                onClick={() => navigate('/write')}
                className="fixed top-8 right-5 font-bold border border-black rounded-xl p-1 ml-4 mb-2"
            >
                게시글 작성
            </button>

            <Footer />
        </div>
    );
};

export default BoardPage;
