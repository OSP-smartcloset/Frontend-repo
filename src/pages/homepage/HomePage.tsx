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

interface Message {
    sender: 'user' | 'bot';
    message: string;
}

const HomePage: React.FC = () => {
    const [weeklyWeather, setWeeklyWeather] = useState<WeatherData[]>([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [recommendation, setRecommendation] = useState('');
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

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
                            description: curr.weather[0].description // 날씨 설명 추가
                        };
                        acc.push(existingDay);
                    }
                    if (curr.dt_txt.includes("12:00:00")) {
                        existingDay.icon = curr.weather[0].icon;
                    }

                    return acc;
                }, []);

                setWeeklyWeather(dailyData.map((day: WeatherData) => ({
                    ...day,
                    highTemp: Math.round(day.highTemp),
                    lowTemp: Math.round(day.lowTemp)
                })));
            } catch (error) {
                console.error('날씨 데이터를 불러오는데 실패했습니다', error);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('위치 정보:', { latitude, longitude });
                    setLocation({ latitude, longitude });
                    fetchWeather(latitude, longitude);
                },
                (error) => {
                    console.error('위치 정보를 가져오는데 실패했습니다', error);
                }
            );
        } else {
            console.error('Geolocation을 지원하지 않는 브라우저입니다.');
        }
    }, []);

    const handleSendMessage = async () => {
        if (message.trim() === '') {
            alert('메시지를 입력해 주세요.');
            return;
        }

        setMessages([...messages, { sender: 'user', message }]);
        setMessage('');
        setLoading(true);

        try {
            const gptMessages = [{ role: 'user', content: message }];

            // 위치 정보와 날씨 정보를 GPT에게 전달
            if (location && weeklyWeather.length > 0) {
                const currentWeather = weeklyWeather[currentDayIndex];
                gptMessages.push({
                    role: 'system',
                    content: `현재 사용자의 위치는 위도 ${location.latitude}, 경도 ${location.longitude}입니다. 오늘의 날씨는 ${currentWeather.description}이고, 기온은 ${currentWeather.highTemp}°C (최고) / ${currentWeather.lowTemp}°C (최저)입니다. 이 정보를 바탕으로 적절한 옷차림을 추천해 주세요.`
                });
            } else {
                gptMessages.push({
                    role: 'system',
                    content: `현재 사용자의 위치 정보를 알 수 없거나 날씨 정보가 없습니다. 기본적인 옷차림 추천을 부탁드립니다.`
                });
            }

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_GPT_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: gptMessages,
                    max_tokens: 1024,
                    top_p: 1,
                    temperature: 1,
                    frequency_penalty: 0.5,
                    presence_penalty: 0.5,
                    stop: ['문장 생성 중단 단어'],
                }),
            });

            const data = await response.json();
            const gptMessage = data.choices?.[0]?.message?.content || 'No response';

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', message: gptMessage },
            ]);
            setRecommendation(gptMessage);
        } catch (error) {
            console.error('메시지 전송 중 에러 발생:', error);
            setRecommendation('오류 발생!');
        } finally {
            setLoading(false);
        }
    };




    const handlePrevDay = () => {
        setCurrentDayIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : weeklyWeather.length - 1));
    };

    const handleNextDay = () => {
        setCurrentDayIndex((prevIndex) => (prevIndex < weeklyWeather.length - 1 ? prevIndex + 1 : 0));
    };
    return (
        <div className="flex flex-col h-screen">
            <div className="bg-white shadow-sm">
                <h1 className="font-tenor text-2xl p-4 ml-2 font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text inline-block">
                    코디'ing
                </h1>
            </div>
            <div className="flex-grow flex flex-col -mt-5 items-center justify-center">
                <div className="text-black p-3 rounded-lg w-full max-w-sm">
                    {weeklyWeather.length > 0 ? (
                        <div className="flex items-center justify-between">
                            <button onClick={handlePrevDay} className="text-xl px-10 p-2"><FaChevronLeft/></button>
                            <div className="flex flex-col items-center flex-grow">
                                <span className="text-lg font-semibold">{weeklyWeather[currentDayIndex].date}</span>
                                <img
                                    src={`http://openweathermap.org/img/wn/${weeklyWeather[currentDayIndex].icon}@2x.png`}
                                    alt="날씨 아이콘"
                                    className="w-12 h-12"
                                />
                                <span className="text-sm">
                                    {weeklyWeather[currentDayIndex].highTemp}°C / {weeklyWeather[currentDayIndex].lowTemp}°C
                                </span>
                            </div>
                            <button onClick={handleNextDay} className="text-xl px-10 p-2"><FaChevronRight/></button>
                        </div>
                    ) : (
                        <span className="flex justify-center">날씨 정보를 불러오는 중...</span>
                    )}
                </div>
            </div>
            <div
                className="flex-grow p-4 w-11/12 h-96 mb-32 ml-4 items-center justify-center m-auto border border-black rounded-2xl relative overflow-y-auto"
            >
                <div className="flex flex-col space-y-4">
                    {/* 대화 내역 표시 */}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`p-3 rounded-xl shadow-md max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* 메시지 입력란 */}
            <div className="p-4 w-11/12 ml-4 -mb-3.5">
                <div className="flex fixed bottom-24 w-10/12">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow border rounded-l-2xl p-2"
                        placeholder="메시지를 입력하세요..."
                        disabled={loading}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-yellow-200 text-black rounded-r-2xl px-4 py-2"
                        disabled={loading}
                    >
                        {loading ? '전송 중...' : '전송'}
                    </button>
                </div>
            </div>
    <Footer/>
</div>
)
    ;
};

export default HomePage;
