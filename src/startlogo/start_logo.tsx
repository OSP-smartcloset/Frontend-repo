import React from 'react';
// @ts-ignore
import logo from '../image/logo.png';

function StartLogo() {
    return (
        <div className="h-screen flex items-center justify-center bg-[#FFF5F5]">
            <div className="w-1/2 max-w-md">
                <img src={logo} alt="logo" className="w-full h-auto" />
            </div>
        </div>
    )
}

export default StartLogo;