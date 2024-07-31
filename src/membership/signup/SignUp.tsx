import React from 'react';
import {useNavigate} from "react-router-dom";

function SignUp(props: any) {
    const [id, setId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [nickname, setNickname] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [height, setHeight] = React.useState('');
    const [weight, setWeight] = React.useState('');
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/');
    }

    return (
        <div>
            <h1 className="text-center text-3xl font-bold mt-40">회원가입</h1>
            <div className="flex flex-col items-center mt-20">
                <div className="w-10/12 mb-3">
                    <label htmlFor="id">ID</label>
                    <div className="relative">
                        <input
                            id="id"
                            name="id"
                            type="text"
                            value={id}
                            className="border rounded-lg w-full p-2 pr-20"
                            onChange={(e) => setId(e.target.value)}
                        />
                        <button
                            className="absolute border rounded-2xl border-blue-300 p-1 right-2 top-1/2 transform -translate-y-1/2 text-black text-sm">중복확인
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
                        />
                        <button
                            className="absolute border rounded-2xl border-blue-300 p-1 right-2 top-1/2 transform -translate-y-1/2 text-black text-sm">중복확인
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