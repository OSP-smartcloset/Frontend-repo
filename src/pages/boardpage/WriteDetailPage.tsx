import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FaRegUserCircle } from 'react-icons/fa';
import { MdDelete, MdMoreVert } from "react-icons/md";
// @ts-ignore
import exam from "../../image/exam.png";

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    commentsCount: number;
}

interface Comment {
    id: number;
    text: string;
}

interface WriteDetailPageProps {
    posts: Post[];
    updatePostLikes: (postId: number, likes: number) => void;
    deletePost: (postId: number) => void;
}

const WriteDetailPage: React.FC<WriteDetailPageProps> = ({ posts, updatePostLikes, deletePost }) => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | undefined>(posts.find(p => p.id === parseInt(postId || '', 10)));
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [showMenu, setShowMenu] = useState(false);

    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;
    }

    const handleBack = () => {
        navigate('/board');
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newCommentObject = {
                id: comments.length + 1,
                text: newComment
            };
            setComments([...comments, newCommentObject]);
            setNewComment('');
        }
    };

    const handleDeleteComment = (id: number) => {
        setComments(comments.filter(comment => comment.id !== id));
    };

    const handleLike = () => {
        if (post) {
            updatePostLikes(post.id, post.likes + 1);
            setPost({ ...post, likes: post.likes + 1 });
        }
    };

    const handleToggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleEditPost = () => {
        navigate(`/edit/${post.id}`);
    };

    const handleDeletePost = () => {
        deletePost(post.id);
        navigate('/board');
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6 cursor-pointer" />
                <h1 className="font-bold text-xl">게시글 내용</h1>
                <div className="relative">
                    <MdMoreVert onClick={handleToggleMenu} className="w-6 h-6 cursor-pointer" />
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-50">
                            <button onClick={handleEditPost} className="block w-full px-4 py-2 text-center hover:bg-gray-200">수정</button>
                            <button onClick={handleDeletePost} className="block w-full px-4 py-2 text-center hover:bg-gray-200">삭제</button>
                        </div>
                    )}
                </div>
            </div>
            <hr className="w-full mt-2 mb-3" />
            <div className="flex items-center w-full p-2 mt-3">
                <FaRegUserCircle className="w-16 h-16 mr-4" />
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">{post.title}</h2>
                    <p>닉네임 | 8/1</p>
                </div>
            </div>
            <p className="mt-2">{post.content}</p>
            <button
                onClick={handleLike}
                className="flex items-center mt-4"
            >
                <span className="text-red-500">❤ {post.likes}</span>
                <span className="text-gray-500 ml-2">💬 {post.commentsCount}</span>
            </button>
            <div>
                <h2 className="text-xl font-bold mb-2 mt-3">댓글</h2>
                {comments.map(comment => (
                    <div key={comment.id} className="border-b p-2 flex mt-1">
                        <div>
                            <div className="flex">
                                <img src={exam} alt={post.title} className="mt-2 w-10 h-10 rounded-full"/>
                                <div className="flex flex-col">
                                    <p className="text-lg font-bold ml-2">{comment.id}</p>
                                    <p className="ml-2">{comment.text}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="fixed w-6 h-6 right-6"
                        >
                            <MdDelete />
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <div className="mb-3 flex">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요."
                        className="w-full p-1 border rounded-lg mr-3 h-10"
                    />
                    <button
                        onClick={handleAddComment}
                        className="text-black border border-black rounded-lg w-16 h-10"
                    >
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WriteDetailPage;
