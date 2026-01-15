import React, { useState, useEffect, useRef } from 'react';

const FacialAnalysis = () => {
    const [model, setModel] = useState(null);
    const [image, setImage] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const imageRef = useRef();
    const fileInputRef = useRef();

    useEffect(() => {
        const loadModel = async () => {
            const URL = "https://teachablemachine.withgoogle.com/models/x4LHW8Yan/";
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            try {
                const tmImage = window.tmImage;
                const loadedModel = await tmImage.load(modelURL, metadataURL);
                setModel(loadedModel);
            } catch (error) {
                console.error("Error loading Teachable Machine model:", error);
            } finally {
                setIsModelLoading(false);
            }
        };
        loadModel();
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                // The prediction will be triggered by the image's onLoad event
            };
            reader.readAsDataURL(file);
        }
    };

    const predict = async () => {
        if (model && imageRef.current) {
            const prediction = await model.predict(imageRef.current);
            setPredictions(prediction);
        }
    };

    return (
        <section className="tool-section">
            <h2 className="title">고양이상 vs 강아지상 얼굴 분석기</h2>
            <input
                type="file"
                ref={fileInputRef}
                id="image-uploader"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />

            <div
                id="image-drop-zone"
                className="drop-zone"
                onClick={() => fileInputRef.current.click()}
            >
                {image ? (
                    <div id="image-preview-container">
                        <img ref={imageRef} src={image} alt="Preview" onLoad={predict}/>
                    </div>
                ) : (
                    <div className="drop-zone-prompt">
                        <p>여기에 이미지를 드래그 앤 드롭하세요</p>
                        <p>또는</p>
                        <button type="button" id="upload-btn" className="tm-start-btn" disabled={isModelLoading}>
                            {isModelLoading ? '모델 로딩중...' : '파일 선택'}
                        </button>
                    </div>
                )}
            </div>

            <div id="label-container" className="tm-label-container">
                {predictions.map((p, i) => (
                    <div key={i} className="prediction-label">
                        {p.className}: {(p.probability * 100).toFixed(2)}%
                    </div>
                ))}
            </div>

            <button className="content-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                분석 원리 더보기 {isExpanded ? '▲' : '▼'}
            </button>
            <div className={`collapsible-content ${isExpanded ? 'expanded' : ''}`}>
                <h3>나는 강아지상일까, 고양이상일까?</h3>
                <p>친구들 사이에서 한 번쯤은 이야기해봤을 주제, "너는 강아지상이야, 아니면 고양이상이야?" 이제 AI 기술로 재미있게 분석해보세요. 저희 얼굴 분석기는 수천 장의 이미지를 학습한 AI 모델을 사용하여 여러분의 얼굴 특징을 분석하고, 강아지와 고양이 중 어느 쪽에 더 가까운지 판단해드립니다.</p>
                <h4>어떻게 작동하나요?</h4>
                <p>여러분이 이미지를 업로드하면, 저희 AI 모델은 이미지 속 얼굴의 주요 특징(눈, 코, 입 모양, 얼굴 윤곽 등)을 분석합니다. 이 데이터는 사전에 학습된 '강아지상'과 '고양이상'의 특징 데이터와 비교됩니다. 최종적으로, 모델은 두 카테고리 중 어느 쪽과 더 유사한지를 확률로 계산하여 결과를 보여줍니다. 모든 분석은 사용자의 기기에서 직접 처리되며, 여러분의 사진은 어디에도 전송되거나 저장되지 않으니 안심하고 이용하세요.</p>
                <h4>재미로 즐겨주세요!</h4>
                <p>분석 결과는 과학적인 근거보다는 학습된 데이터에 기반한 통계적인 예측입니다. 친구나 가족과 함께 결과를 공유하며 즐거운 시간을 보내는 용도로 활용해주세요. 오늘의 당신은 강아지상, 내일의 당신은 고양이상이 될 수도 있답니다!</p>
            </div>
        </section>
    );
};

export default FacialAnalysis;