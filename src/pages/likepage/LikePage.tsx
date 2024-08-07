import React, { useState, useEffect } from 'react';
import Footer from "../../footer/Footer";

interface FashionItem {
    id: number;
    title: string;
    description: string;
    likes: number;
    date: string;
    imageUrl: string;
}

const mockLikedItems: FashionItem[] = [
    { id: 1, title: '세련된 여름 코디', description: '시원한 리넨 셔츠와 면바지 조합', likes: 152, date: '2024-08-01', imageUrl: 'https://doindie.co.kr/data/file/gallery_8/0144712dd81be0c3d9724f5e56ce6685_7QOX15ca.jpg' },
    { id: 2, title: '트렌디한 액세서리', description: '골드 체인 목걸이로 포인트 주기', likes: 98, date: '2024-08-02', imageUrl: 'https://panggood.conohawing.com/image/vendor_inventory/291d/486ebce88acb51bb673244c1a74f4bc1f3f36f195484a0f26253b3d13546.jpg.webp' },
    // 더 많은 아이템 추가 가능
];

function LikePage() {
    const [likedItems, setLikedItems] = useState<FashionItem[]>([]);

    useEffect(() => {
        setLikedItems(mockLikedItems);
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-sm p-4">
                <h1 className="font-tenor text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text inline-block">
                    SmartCloset
                </h1>
            </header>
            <main className="container mx-auto p-4">
                {likedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {likedItems.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                    <p className="text-gray-600 mt-2">{item.description}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-red-500">❤ {item.likes}</span>
                                        <span className="text-gray-400 text-sm">{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center">좋아요 한 패션 아이템이 없습니다.</p>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default LikePage;