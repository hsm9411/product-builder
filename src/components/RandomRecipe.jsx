import React, { useState, useEffect } from 'react';

const RandomRecipe = () => {
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchRandomMeal = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMeal(data.meals[0]);
        } catch (error) {
            console.error("Error fetching random meal:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomMeal();
    }, []);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const renderIngredients = () => {
        if (!meal) return null;
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
                ingredients.push(<li key={i}>{measure} {ingredient}</li>);
            }
        }
        return <ul className="ingredient-list">{ingredients}</ul>;
    };

    return (
        <section className="tool-section">
            <h2 className="title">오늘의 랜덤 레시피</h2>
            <div id="random-recipe-container" className="random-recipe-container">
                {loading && <div className="placeholder">레시피를 불러오는 중...</div>}
                {!loading && !meal && <div className="placeholder">레시피를 찾을 수 없습니다.</div>}
                {!loading && meal && (
                    <div className="meal-card">
                        <h3 className="meal-name">{meal.strMeal}</h3>
                        <div className="meal-meta">{meal.strCategory} | {meal.strArea}</div>
                        <img src={meal.strMealThumb} alt={`${meal.strMeal} 이미지`} className="meal-image" />
                        <div className="meal-details">
                            <h4>재료:</h4>
                            {renderIngredients()}
                            <h4>조리법:</h4>
                            <button className="content-toggle-btn" onClick={toggleExpansion}>
                                조리법 {isExpanded ? '▲' : '▼'}
                            </button>
                            <div className={`collapsible-content ${isExpanded ? 'expanded' : ''}`}>
                                <p>{meal.strInstructions.replace(/\\r\\n/g, '<br>')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <button id="new-recipe-btn" className="generate-btn" onClick={fetchRandomMeal}>다른 레시피 보기</button>
        </section>
    );
};

export default RandomRecipe;
