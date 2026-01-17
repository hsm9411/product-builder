import React, { useState, useEffect } from 'react';

const AiCat = () => {
    const [catData, setCatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAiCat = async () => {
            try {
                const response = await fetch('/api/cat?size=1024&theme=All');
                if (!response.ok) {
                    throw new Error('Failed to fetch cat image');
                }
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                setCatData({ url: imageUrl });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAiCat();
    }, []); // Empty dependency array means this runs once on mount

    const renderContent = () => {
        if (loading) {
            return <div className="placeholder">고양이 정보를 불러오는 중...</div>;
        }
        if (error) {
            return <div className="placeholder">고양이 정보를 불러오는 데 실패했습니다.</div>;
        }
        if (catData) {
            return (
                <>
                    <img src={catData.url} alt="AI 고양이 이미지" className="ai-cat-image" />
                </>
            );
        }
        return null;
    };

    return (
        <section className="tool-section">
            <h2 className="title">오늘의 AI 고양이</h2>
            <div id="ai-cat-container" className="ai-cat-container">
                {renderContent()}
            </div>
        </section>
    );
};

export default AiCat;
