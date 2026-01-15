import React, { useState, useEffect } from 'react';

const AiCat = () => {
    const [catData, setCatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAiCat = async () => {
            try {
                const response = await fetch('https://api.ai-cats.net/v1/cat/info/669de24a-1da1-4fcd-84b1-9e55a43a0e0e');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCatData(data);
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
            const formattedDate = new Date(catData.dateCreated).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            return (
                <>
                    <img src={catData.url} alt="AI 고양이 이미지" className="ai-cat-image" />
                    <div className="ai-cat-prompt">
                        <p>{catData.prompt}</p>
                    </div>
                    <div className="ai-cat-date">
                        <span>생성일: {formattedDate}</span>
                    </div>
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
