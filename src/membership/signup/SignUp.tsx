import React, {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

// User data type
interface User {
    email?: string;
    gender?: string;
    nickname?: string;
}

// Form data type
interface FormData {
    loginId: string;
    loginPwd: string;
    nickname: string;
    height: number;
    weight: number;
    platform: string;
    gender: string;
}

function SignUp() {
    const location = useLocation();
    const user: User = location.state?.user || {};
    const [id, setId] = React.useState<string>(user.email || '');
    const [password, setPassword] = React.useState<string>('');
    const [nickname, setNickname] = React.useState<string>(user.nickname || '');
    const [gender, setGender] = React.useState<string>(user.gender || '');
    const [height, setHeight] = React.useState<string>('');
    const [weight, setWeight] = React.useState<string>('');
    const [idAvailable, setIdAvailable] = React.useState<boolean>(true);
    const [nicknameAvailable, setNicknameAvailable] = React.useState<boolean>(true);
    const navigate = useNavigate();

    // 닉네임이 있는 경우, 해당 값으로 설정
    useEffect(() => {
        if (user.nickname) {
            setNickname(user.nickname); // 닉네임이 존재할 경우 설정
        }
    }, [user.nickname]);

    // ID 중복 확인
    const checkIdAvailability = async () => {
        if (id.trim() === '') {
            alert('ID를 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch(`/api/users/check/loginId?loginId=${encodeURIComponent(id)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('ID 중복 확인 실패');
            }

            const data = await response.json();
            setIdAvailable(data.available);
            alert(data.available ? 'ID 사용 가능' : 'ID 이미 사용 중');
        } catch (error: any) {
            alert(`ID 중복 확인 에러: ${error.message}`);
        }
    };

    // 닉네임 중복 확인
    const checkNicknameAvailability = async () => {
        if (nickname.trim() === '') {
            alert('닉네임을 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch(`/api/users/check/nickname?nickname=${encodeURIComponent(nickname)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('닉네임 중복 확인 실패');
            }

            const data = await response.json();
            setNicknameAvailable(data.available);
            alert(data.available ? '닉네임 사용 가능' : '닉네임 이미 사용 중');
        } catch (error: any) {
            alert(`닉네임 중복 확인 에러: ${error.message}`);
        }
    };


    const handleSignUp = async () => {
        const userData: FormData = {
            loginId: id,
            loginPwd: password,
            nickname: nickname,
            height: parseInt(height, 10) || 0,
            weight: parseInt(weight, 10) || 0,
            platform: 'APP',
            gender: gender === '남' ? 'MALE' : 'FEMALE'
        };

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('회원가입 실패');
            }

            // 성공적으로 가입이 되었을 때
            alert('회원가입 성공');
            localStorage.setItem('height', height);
            localStorage.setItem('weight', weight);
            navigate('/');
        } catch (error:any) {
            // 에러 처리
            alert(`회원가입 에러: ${error.message}`);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div>
            <FaArrowLeft onClick={handleBack} className="w-6 h-6 ml-2 mt-2"/>
            <h1 className="text-center text-3xl font-bold mt-32">회원가입</h1>
            <div className="flex flex-col items-center mt-20">
                <div className="w-10/12 mb-3">
                    <label htmlFor="id">ID (Email)</label>
                    <div className="relative">
                        <input
                            id="id"
                            name="id"
                            type="text"
                            value={id}
                            className="border rounded-lg w-full p-2 pr-20"
                            onChange={(e) => setId(e.target.value)}
                            readOnly={!!user.email}
                        />
                        <button
                            className="absolute border rounded-2xl border-blue-300 p-1 right-2 top-1/2 transform -translate-y-1/2 text-black text-sm"
                            onClick={checkIdAvailability}>
                            중복확인
                        </button>
                    </div>
                </div>
                <div className="w-10/12 mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        className="border rounded-lg w-full p-2"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="w-10/12 mb-3">
                    <label htmlFor="nickname">닉네임</label>
                    <div className="relative">
                        <input
                            id="nickname"
                            name="nickname"
                            type="text"
                            value={nickname}
                            className="border rounded-lg w-full p-2 pr-20"
                            onChange={(e) => setNickname(e.target.value)}
                            readOnly={!!user.nickname}
                        />
                        <button
                            className="absolute border rounded-2xl border-blue-300 p-1 right-2 top-1/2 transform -translate-y-1/2 text-black text-sm"
                            onClick={checkNicknameAvailability}>
                            중복확인
                        </button>
                    </div>
                </div>
                <div className="w-10/12 mb-3">
                    <label>성별</label>
                    <div className="flex">
                        <button
                            className={`border rounded-lg w-1/2 p-2 mr-2 ${gender === '남' ? 'bg-blue-500 text-white' : ''}`}
                            onClick={() => setGender('남')}
                        >
                            남
                        </button>
                        <button
                            className={`border rounded-lg w-1/2 p-2 ${gender === '여' ? 'bg-blue-500 text-white' : ''}`}
                            onClick={() => setGender('여')}
                        >
                            여
                        </button>
                    </div>
                </div>
                <div className="w-10/12 mb-3 flex">
                    <div className="w-1/2 mr-2 relative">
                        <label htmlFor="height">키</label>
                        <input
                            id="height"
                            name="height"
                            type="number"
                            value={height}
                            className="border rounded-lg w-full p-2 text-center"
                            onChange={(e) => setHeight(e.target.value)}
                        />
                        <p
                            className="absolute right-2 top-1/2 mr-1 text-black text-sm">cm
                        </p>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="weight">몸무게</label>
                        <div className="relative">
                            <input
                                id="weight"
                                name="weight"
                                type="number"
                                value={weight}
                                className="border rounded-lg w-full p-2 text-center"
                                onChange={(e) => setWeight(e.target.value)}
                            />
                            <p
                                className="absolute right-2 top-1/4 mr-1 text-black text-sm">kg
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    className="bg-blue-400 text-white rounded-lg w-10/12 p-2 mt-6"
                    onClick={handleSignUp}
                >회원가입</button>
            </div>
        </div>
    );
}

export default SignUp;
