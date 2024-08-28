import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegUserCircle } from 'react-icons/fa';
import { MdDelete, MdMoreVert, MdEdit } from 'react-icons/md';
import axios from 'axios';

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    commentsCount: number;
    date: string;
    imageUrl: string;
    isLiked: boolean;
}

interface Comment {
    id: number;
    content: string;
    reportCount: number;
    parent: number | null;
    user: {
        nickname: string;
    };
}

interface WriteDetailPageProps {
    updatePostLikes: (postId: number, likes: number) => void;
    deletePost: (postId: number) => void;
}

const WriteDetailPage: React.FC<WriteDetailPageProps> = ({ updatePostLikes, deletePost }) => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | undefined>(undefined);
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [showCommentMenu, setShowCommentMenu] = useState<{ [key: number]: boolean }>({});
    const [user, setUser] = useState({ nickname: '', loginId: '' });
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    const fetchPost = async () => {
        try {
            const postResponse = await axios.get(`/api/posts/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPost(postResponse.data);

            const commentsResponse = await axios.get(`/api/posts/${postId}/comments`);
            setLocalComments(commentsResponse.data);
        } catch (error) {
            console.error('게시물을 가져오는 데 실패했습니다', error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    useEffect(() => {
        console.log('Local comments updated:', localComments);
    }, [localComments]);


    useEffect(() => {
        // 서버에서 바이너리 프로필 이미지 로드하기
        const fetchProfileImage = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/api/users/profile-picture', {
                    responseType: 'blob', // 바이너리 데이터를 받아오기 위해 'blob' 타입 지정
                    headers: {
                        'Authorization': `Bearer ${token}`, // 인증 헤더 추가
                    },
                });

                if (response.data) {
                    // Blob 데이터를 URL로 변환
                    const imageUrl = URL.createObjectURL(response.data);
                    setProfileImageUrl(imageUrl); // 상태로 저장
                }
            } catch (error) {
                console.error('프로필 이미지를 불러오는 중 오류가 발생했습니다.', error);
            }
        };

        fetchProfileImage();
    }, []);

    useEffect(() => {
        const nickname = localStorage.getItem('nickname');
        const loginId = localStorage.getItem('loginId');

        if (nickname && loginId) {
            setUser({ nickname, loginId });
        }
    }, []);

    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        if (post && savedPosts.some((savedPost: Post) => savedPost.id === post.id)) {
            if (!post.isLiked) { // 상태 업데이트가 필요한 경우에만 setState 호출
                setPost(prevPost => prevPost ? { ...prevPost, isLiked: true } : prevPost);
            }
        }
    }, [post]);

    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;
    }

    const handleBack = () => {
        navigate('/board');
    };

    const handleReportComment = async (commentId: number) => {
        try {
            await axios.post(`/api/comments/report/${commentId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('댓글이 신고되었습니다.');
        } catch (error) {
            console.error('댓글 신고 중 오류 발생:', error);
            alert('댓글 신고 중 오류가 발생했습니다.');
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const response = await axios.post(`/api/comments/${post.id}`, {
                    content: newComment
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                // 댓글 추가 성공 시
                setLocalComments(prevComments => [
                    ...prevComments,
                    {
                        id: response.data,
                        content: newComment,
                        reportCount: 0,
                        parent: null,
                        user: { nickname: user.nickname } // 사용자 닉네임 설정
                    }
                ]);
                setNewComment('');

                // 게시물 정보를 다시 가져와 댓글 수를 업데이트
                const postResponse = await axios.get(`/api/posts/${post.id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPost(postResponse.data);

            } catch (error) {
                console.error('댓글 추가 중 오류 발생:', error);
                alert('댓글 추가 중 오류가 발생했습니다.');
            }
        }
    };



    const handleDeleteComment = async (commentId: number) => {
        // UI에서 즉시 댓글 삭제
        setLocalComments(prevComments => prevComments.filter(comment => comment.id !== commentId));

        try {
            // 댓글 삭제 요청
            await axios.delete(`/api/comments/${commentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            alert('댓글이 삭제되었습니다.');
        } catch (error) {
            // 오류가 발생했을 때, UI 상태를 원래대로 복원
            setLocalComments(prevComments => [
                ...prevComments,
                // 삭제된 댓글을 다시 추가하거나, 서버에서 최신 댓글 목록을 가져올 수 있음
            ]);

            console.error('댓글 삭제 중 오류가 발생했습니다:', error);
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    };


    const handleEditComment = async () => {
        if (editingCommentContent.trim()) {
            try {
                await axios.patch(`/api/comments/${editingCommentId}?content=${encodeURIComponent(editingCommentContent)}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setLocalComments(prevComments => prevComments.map(comment =>
                    comment.id === editingCommentId ? { ...comment, content: editingCommentContent } : comment
                ));
                setEditingCommentId(null);
                setEditingCommentContent('');
            } catch (error) {
                console.error('댓글을 수정하는 데 실패했습니다', error);
            }
        }
    };

    const handleLike = async () => {
        if (!post || post.isLiked) return; // 이미 좋아요를 눌렀으면 더 이상 처리하지 않음

        try {
            // 좋아요 추가
            setPost(prevPost => prevPost ? { ...prevPost, likes: prevPost.likes + 1, isLiked: true } : prevPost); // 즉시 상태 업데이트

            await axios.put(`/api/posts/${post.id}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다', error);
            setPost(prevPost => prevPost ? { ...prevPost, likes: prevPost.likes - 1, isLiked: false } : prevPost); // 오류 발생 시 상태 롤백
        }
    };


    const handleToggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleToggleCommentMenu = (commentId: number) => {
        setShowCommentMenu(prevMenu => ({
            ...prevMenu,
            [commentId]: !prevMenu[commentId]
        }));
    };

    const handleEditPost = () => {
        navigate(`/edit/${post.id}`);
    };

    const handleDeletePost = async () => {
        try {
            const response = await axios.delete(`/api/posts/${post.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // 응답 상태 코드 확인
            if (response.status === 204) {
                // 게시글 삭제 성공 시
                alert('게시글이 삭제되었습니다.');
                navigate('/board'); // 게시판 페이지로 이동
            } else {
                // 다른 상태일 경우
                alert('게시글 삭제에 실패했습니다.');
            }
        } catch (error: any) {
            // 에러 처리
            if (error.response) {
                // 서버가 응답을 했고 상태 코드가 2xx가 아닌 경우
                switch (error.response.status) {
                    case 403:
                        alert('게시글 삭제 권한이 없습니다.');
                        break;
                    case 404:
                        alert('게시글을 찾을 수 없습니다.');
                        break;
                    case 500:
                        alert('서버 오류가 발생했습니다.');
                        break;
                    default:
                        alert('게시글 삭제 중 오류가 발생했습니다.');
                }
            } else {
                // 서버가 응답하지 않았거나 네트워크 오류 발생
                alert('네트워크 오류가 발생했습니다.');
            }
            console.error('게시글 삭제 중 오류 발생:', error);
        }
    };


    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <FaArrowLeft onClick={handleBack} className="w-6 h-6 cursor-pointer"/>
                <h1 className="font-bold text-xl">게시글 내용</h1>
                <div className="relative">
                    <MdMoreVert onClick={handleToggleMenu} className="w-6 h-6 cursor-pointer"/>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-50">
                            <button onClick={handleEditPost}
                                    className="block w-full px-4 py-2 text-center hover:bg-gray-200">수정
                            </button>
                            <button onClick={handleDeletePost}
                                    className="block w-full px-4 py-2 text-center hover:bg-gray-200">삭제
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <hr className="w-full mt-2 mb-3"/>
            <div className="flex items-center w-full p-2 mt-3">
            {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="w-16 h-16 rounded-full mr-4 object-cover"/>
                ) : (
                    <FaRegUserCircle className="w-16 h-16 mr-4"/>
                )}
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">{post.title}</h2>
                    <p>{post.id} | {post.date}</p>
                </div>
            </div>
            <p className="mt-2">{post.content}</p>
            <button
                onClick={handleLike}
                className="flex items-center mt-4 text-red-500" // 항상 빨간색
            >
                <span>❤ {post.likes}</span>
                <span className="text-gray-500 ml-2">💬 {localComments.length}</span>
            </button>

            <div>
                <h2 className="text-xl font-bold mb-2 mt-3">댓글</h2>
                {localComments.map(comment => (
                    <div key={comment.id} className="border-b p-2 flex mt-1 items-center justify-between">
                        <div>
                            <div className="flex">
                                {profileImageUrl ? (
                                    <img src={profileImageUrl} alt="Profile"
                                         className="w-10 h-10 rounded-full mr-4 object-cover"/>
                                ) : (
                                    <FaRegUserCircle className="w-10 h-10 mr-4"/>
                                )}
                                <div className="flex flex-col">
                                    <p className="text-lg font-bold ml-2">{comment.user.nickname}</p>
                                    {editingCommentId === comment.id ? (
                                        <div>
                                            <textarea
                                                value={editingCommentContent}
                                                onChange={(e) => setEditingCommentContent(e.target.value)}
                                                className="w-full p-1 border rounded-lg"
                                            />
                                            <button
                                                onClick={handleEditComment}
                                                className="text-black border border-black rounded-lg w-16 mt-2"
                                            >
                                                저장
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="ml-2">{comment.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <MdMoreVert
                                onClick={() => handleToggleCommentMenu(comment.id)}
                                className="w-6 h-6 ml-4 cursor-pointer"
                            />
                            {showCommentMenu[comment.id] && (
                                <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-50">
                                    <button onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setEditingCommentContent(comment.content);
                                    }}
                                            className="block w-full px-4 py-2 text-center hover:bg-gray-200">
                                        수정
                                    </button>
                                    <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="block w-full px-4 py-2 text-center hover:bg-gray-200">
                                        삭제
                                    </button>
                                    <button onClick={() => handleReportComment(comment.id)}
                                            className="block w-full px-4 py-2 text-center hover:bg-gray-200">
                                        신고
                                    </button>
                                </div>
                            )}
                        </div>
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
                        className="text-black border border-black rounded-lg w-16 h-10"
                        onClick={handleAddComment}
                    >
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WriteDetailPage;
