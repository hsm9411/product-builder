import React from 'react';
import LottoGenerator from '../components/LottoGenerator';
import AiCat from '../components/AiCat';
import RecommendedBooks from '../components/RecommendedBooks';
import RandomRecipe from '../components/RandomRecipe';
import FacialAnalysis from '../components/FacialAnalysis';
import DisqusComments from '../components/DisqusComments';

const HomePage = () => {
    return (
        <>
            <section className="intro-section">
                <h1>재미와 유용함을 한 곳에</h1>
                <p>Product Builder는 여러분의 일상에 작은 즐거움과 호기심을 더해줄 다채로운 웹 도구를 제공합니다. 최신 기술을 활용한 재미있는 AI 분석부터, 매주 기대감을 더하는 로또 번호 생성까지, Product Builder와 함께 특별한 경험을 만들어보세요.</p>
            </section>

            <LottoGenerator />
            <AiCat />
            <RecommendedBooks />
            <RandomRecipe />
            <FacialAnalysis />
            <DisqusComments />
        </>
    );
};

export default HomePage;
