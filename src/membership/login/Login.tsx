import React from "react";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import kakaoLogin from '../../image/kakao_login.png'
// @ts-ignore
import appleLogin from '../../image/apple_login.png'


function Login(props: any) {
    const [id, setId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup');
    }

    const handleLogin = () => {
        navigate('/home');
    }

    return (
        <div className="App">
            <h1 className="text-center text-3xl font-bold mt-48"> 로그인 </h1>
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
                <button className="ml-2 text-blue-400"
                        onClick={handleSignUp}
                >회원가입
                </button>
            </div>
            <button
                className="w-10/12 flex justify-center m-auto mt-20 bg-blue-400 text-white p-3 mb-3 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleLogin}
            >로그인
            </button>
            <img src={kakaoLogin} alt="kakao" className="flex items-center justify-center m-auto w-11/12 px-4 mb-3"/>
            <img src={appleLogin} alt="apple" className="flex items-center justify-center m-auto w-11/12 px-4"/>
        </div>
    );
}

export default Login;