import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import kakaoLogin from '../../image/kakao_login.png';

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup');
    };

    const handleLogin = async () => {
        const loginData = {
            loginId: id,
            loginPwd: password,
        };

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if(response.ok) {
                const data = await response.json();
                console.log('로그인 성공:', data);

                localStorage.setItem('token', data.token);
                localStorage.setItem('loginId', data.loginId);
                localStorage.setItem('nickname', data.nickname);
                navigate('/home');
            } else {
                const errorData = await response.json();
                alert(`로그인 실패: ${errorData.message}`);
            }
        } catch (error:any) {
            console.error('로그인 중 에러 발생:', error);
        }
    };

    const Rest_api_key = 'c63208be1a9b8d67def7f82660b3d27b'; // REST API KEY
    const redirect_uri = 'http://localhost:3000/auth'; // Redirect URI
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    const handleKakaoLogin = () => {
        window.location.href = kakaoURL;
    };

    return (
        <div className="App">
            <h1 className="font-tenor text-3xl text-center mt-48 font-bold tracking-tight bg-gradient-to-r from-blue-600 via-pink-400 to-yellow-300 text-transparent bg-clip-text">
                코디'ing
            </h1>

            <div className="flex flex-col items-center mt-20">
                <input
                    id="id"
                    name="id"
                    type="text"
                    placeholder="아이디를 입력해 주세요."
                    value={id}
                    className="border rounded-lg w-10/12 p-3 mb-4"
                    onChange={(e) => setId(e.target.value)}
                />
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    value={password}
                    className="border rounded-lg w-10/12 p-3"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="flex items-center justify-center mt-3">
                <p>계정이 없으시다면?</p>
                <button className="ml-2 text-blue-400" onClick={handleSignUp}>회원가입</button>
            </div>
            <button
                className="w-10/12 flex justify-center m-auto mt-20 bg-blue-400 text-white p-3 mb-3 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleLogin}
            >로그인
            </button>
            <img
                src={kakaoLogin}
                alt="kakao"
                className="flex items-center justify-center m-auto w-11/12 px-4 mb-3 cursor-pointer"
                onClick={handleKakaoLogin}
            />
        </div>
    );
}

export default Login;
