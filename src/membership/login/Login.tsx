import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import kakaoLogin from '../../image/kakao_login.png';
// @ts-ignore
import appleLogin from '../../image/apple_login.png';

declare global {
    interface Window {
        Kakao: any;
    }
}

function Login(props: any) {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 카카오 SDK 초기화
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init('60dc0a4fc7bdbb8a8fccd9bef49a781c');
        }
    }, []);

    const handleSignUp = () => {
        navigate('/signup');
    }

    const handleLogin = () => {
        navigate('/home');
    }

    const handleKakaoLogin = () => {
        if (window.Kakao) {
            window.Kakao.Auth.login({
                success: function (authObj: any) {
                    console.log(authObj);
                    // 로그인 성공 시 사용자 정보 요청
                    window.Kakao.API.request({
                        url: '/v2/user/me',
                        success: function (res: any) {
                            console.log(res);
                            // 사용자 정보가 성공적으로 불러와졌을 때 처리 로직
                            navigate('/signup', { state: { user: res.kakao_account } });
                        },
                        fail: function (error: any) {
                            console.log(error);
                        }
                    });
                },
                fail: function (err: any) {
                    console.log(err);
                }
            });
        } else {
            console.error("Kakao SDK is not loaded");
        }
    }

    return (
        <div className="App">
            <h1 className="font-tenor text-3xl text-center mt-48 font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
                Smart Closet
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
                ></input>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    value={password}
                    className="border rounded-lg w-10/12 p-3"
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
            </div>
            <div className="flex items-center justify-center mt-3">
                <p>계정이 없으시다면?</p>
                <button className="ml-2 text-blue-400" onClick={handleSignUp}>회원가입</button>
            </div>
            <button
                className="w-10/12 flex justify-center m-auto mt-20 bg-blue-400 text-white p-3 mb-3 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleLogin}
            >로그인</button>
            <img
                src={kakaoLogin}
                alt="kakao"
                className="flex items-center justify-center m-auto w-11/12 px-4 mb-3 cursor-pointer"
                onClick={handleKakaoLogin}
            />
            <img src={appleLogin} alt="apple" className="flex items-center justify-center m-auto w-11/12 px-4"/>
        </div>
    );
}

export default Login;
