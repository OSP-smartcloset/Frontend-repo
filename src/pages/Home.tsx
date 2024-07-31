import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../footer/Footer';

interface WeatherData {
    date: string;
    icon: string;
    highTemp: number;
    lowTemp: number;
    description: string;
}

const Home: React.FC = () => {
    const [weeklyWeather, setWeeklyWeather] = useState<WeatherData[]>([]);
    const [message, setMessage] = useState('');

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

    return (
        <div className="flex flex-col h-screen">
            <h1 className="text-2xl font-bold text-center py-4 mt-6">주간 날씨</h1>
            <div className="flex justify-between bg-gray-300 text-black p-3 overflow-x-auto">
                {weeklyWeather.length > 0 ? (
                    weeklyWeather.map((day, index) => (
                        <div key={index} className="flex flex-col items-center mx-2">
                            <span>{day.date}</span>
                            <img
                                src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                alt="날씨 아이콘"
                                className="w-16 h-16"
                            />
                            <span>{day.highTemp}°C {day.lowTemp}°C</span>
                        </div>
                    ))
                ) : (
                    <span>날씨 정보를 불러오는 중...</span>
                )}
            </div>
            <div
                className="flex-grow overflow-y-auto p-4 w-11/12 mt-3 mb-24 items-center justify-center m-auto border border-black rounded-2xl">
                <div className="p-4 fixed bottom-28 w-11/12 -ml-3.5 -mb-3.5">
                    <div className="flex">
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

export default Home;
