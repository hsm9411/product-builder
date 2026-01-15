import React, { useState } from 'react';
import ToolSection from './ToolSection';

const LottoGenerator = () => {
    const [numbers, setNumbers] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const getBallColorClass = (number) => {
        if (number <= 10) return 'ball-color-1';
        if (number <= 20) return 'ball-color-2';
        if (number <= 30) return 'ball-color-3';
        if (number <= 40) return 'ball-color-4';
        return 'ball-color-5';
    };

    const generateNumbers = () => {
        const newNumbers = new Set();
        while (newNumbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            newNumbers.add(randomNumber);
        }
        setNumbers(Array.from(newNumbers).sort((a, b) => a - b));
    };

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };


    return (
        <ToolSection title="로또 번호 생성기">
            <div id="lotto-numbers" className="lotto-numbers-container">
                {numbers.length > 0 ? (
                    numbers.map((number, index) => (
                        <div
                            key={index}
                            className={`lotto-ball ${getBallColorClass(number)}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {number}
                        </div>
                    ))
                ) : (
                    <span className="placeholder">버튼을 눌러 번호를 생성하세요</span>
                )}
            </div>
            <button id="generate-btn" className="generate-btn" onClick={generateNumbers}>번호 생성</button>

            <button className="content-toggle-btn" onClick={toggleExpansion} data-text="로또에 대한 재미있는 사실">
                로또에 대한 재미있는 사실 {isExpanded ? '▲' : '▼'}
            </button>
            <div className={`collapsible-content ${isExpanded ? 'expanded' : ''}`}>
                <h3>로또, 과학과 행운의 만남</h3>
                <p>매주 우리는 작은 종이 한 장에 큰 기대를 걸어봅니다. 로또는 단순한 숫자 게임을 넘어, 많은 이들에게 일주일의 희망과 즐거움을 선사하는 문화가 되었습니다. 저희 로또 번호 생성기는 무작위 알고리즘을 통해 여러분에게 6개의 새로운 번호를 제안합니다. 모든 번호의 조합은 동일한 확률로 생성되므로, 어떤 번호가 나올지는 순전히 행운에 달려있습니다.</p>
                <h4>로또 번호, 어떻게 선택해야 할까?</h4>
                <p>많은 사람들이 자신만의 전략으로 로또 번호를 선택합니다. 가족의 생일을 조합하거나, 꿈에서 본 숫자를 선택하거나, 혹은 통계적으로 자주 나오는 번호를 분석하기도 합니다. 하지만 기억하세요, 로또의 모든 번호는 독립적인 확률을 가집니다. 과거의 데이터가 미래의 결과를 보장하지는 않습니다. 저희 생성기는 이러한 편견 없이, 완전히 새로운 행운의 가능성을 열어드립니다.</p>
                <p className="warning"><strong>잊지 마세요:</strong> 로또는 오락의 일환으로 즐기는 것이 가장 좋습니다. 과도한 몰입은 지양하고, 작은 즐거움으로만 활용하시기 바랍니다.</p>
            </div>
        </ToolSection>
    );
};

export default LottoGenerator;