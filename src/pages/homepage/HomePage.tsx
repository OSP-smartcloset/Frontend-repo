import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../../footer/Footer';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface WeatherData {
    date: string;
    icon: string;
    highTemp: number;
    lowTemp: number;
    description: string;
}

const HomePage: React.FC = () => {
    const [weeklyWeather, setWeeklyWeather] = useState<WeatherData[]>([]);
    const [message, setMessage] = useState('');
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    useEffect(() => {
        const fetchWeather = async (lat: number, lon: number) => {
            const apiKey = '80893c87e1b6f206b88f0cc97fdbe141';
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

            try {
                const response = await axios.get(url);
                const data = response.data;

                const dailyData = data.list.reduce((acc: any, curr: any) => {
                    const date = new Date(curr.dt * 1000).toLocaleDateString('ko-KR', { weekday: 'long' });
                    let existingDay = acc.find((day: any) => day.date === date);

                    if (existingDay) {
                        existingDay.highTemp = Math.max(existingDay.highTemp, curr.main.temp_max);
                        existingDay.lowTemp = Math.min(existingDay.lowTemp, curr.main.temp_min);
                    } else {
                        existingDay = {
                            date,
                            icon: curr.weather[0].icon,
                            highTemp: curr.main.temp_max,
                            lowTemp: curr.main.temp_min,
                        };
                        acc.push(existingDay);
                    }
                    if (curr.dt_txt.includes("12:00:00")) {
                        existingDay.icon = curr.weather[0].icon;
                    }

                    return acc;
                }, []);

                setWeeklyWeather(dailyData);
            } catch (error) {
                console.error('날씨 데이터를 불러오는데 실패했습니다', error);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('위치 정보를 가져오는데 실패했습니다', error);
                }
            );
        } else {
            console.error('Geolocation을 지원하지 않는 브라우저입니다.');
        }
    }, []);

    const handleSendMessage = () => {
        // GPT API 연동 로직 (추후 구현)
        console.log('메시지 전송:', message);
        setMessage('');
    };

    const handlePrevDay = () => {
        setCurrentDayIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : weeklyWeather.length - 1));
    };

    const handleNextDay = () => {
        setCurrentDayIndex((prevIndex) => (prevIndex < weeklyWeather.length - 1 ? prevIndex + 1 : 0));
    };

    return (
        <div className="flex flex-col h-screen">
            <h1 className="font-tenor text-xl ml-2 font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text inline-block">
                smartcloset
            </h1>
            <div className="flex-grow flex flex-col -mt-16 items-center justify-center">
                <h1 className="text-2xl font-bold text-center py-4">주간 날씨</h1>
                <div className="bg-gray-300 text-black p-3 rounded-lg shadow-md w-full max-w-sm">
                    {weeklyWeather.length > 0 ? (
                        <div className="flex items-center justify-between">
                            <button onClick={handlePrevDay} className="text-2xl p-2"><FaChevronLeft/></button>
                            <div className="flex flex-col items-center flex-grow">
                                <span className="text-lg font-semibold">{weeklyWeather[currentDayIndex].date}</span>
                                <img
                                    src={`http://openweathermap.org/img/wn/${weeklyWeather[currentDayIndex].icon}@2x.png`}
                                    alt="날씨 아이콘"
                                    className="w-20 h-20"
                                />
                                <span className="text-lg">
                                    {weeklyWeather[currentDayIndex].highTemp}°C / {weeklyWeather[currentDayIndex].lowTemp}°C
                                </span>
                            </div>
                            <button onClick={handleNextDay} className="text-2xl p-2"><FaChevronRight/></button>
                        </div>
                    ) : (
                        <span className="flex justify-center">날씨 정보를 불러오는 중...</span>
                    )}
                </div>
            </div>
            <div
                className="flex-grow overflow-y-auto p-4 w-11/12 h-1/3 mt-3 mb-32 items-center justify-center m-auto border border-black rounded-2xl">
                <div className="p-4 fixed bottom-28 w-11/12 -ml-3.5 -mb-3.5">
                    <div className="flex fixed bottom-36 w-10/12">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-grow border rounded-l-2xl p-2"
                            placeholder="메시지를 입력하세요..."
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-yellow-200 text-black rounded-r-2xl px-4 py-2"
                        >
                            전송
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default HomePage;
