document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    const themeToggle = document.getElementById('theme-toggle');

    // --- Theme Switcher ---
    const currentTheme = localStorage.getItem('theme');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
        }
    };

    if (currentTheme) {
        applyTheme(currentTheme);
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
        if (theme === 'light') {
            theme = 'dark';
            localStorage.setItem('theme', 'dark');
        } else {
            theme = 'light';
            localStorage.setItem('theme', 'light');
        }
        applyTheme(theme);
    });

    // --- World Clock ---
    const clockContainer = document.getElementById('world-clock-container');
    if (clockContainer) {
        const timezones = {
            'clock-seoul': { name: '서울', tz: 'Asia/Seoul' },
            'clock-ny': { name: '뉴욕', tz: 'America/New_York' },
            'clock-london': { name: '런던', tz: 'Europe/London' },
        };

        const renderClock = (elementId, city, timeString) => {
            const el = document.getElementById(elementId);
            if (el) {
                const date = new Date(timeString);
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                el.innerHTML = `
                    <div class="city-name">${city}</div>
                    <div class="time">${hours}:${minutes}:${seconds}</div>
                `;
            }
        };

        const fetchWorldTimes = async () => {
            try {
                const requests = Object.entries(timezones).map(([id, { tz }]) => 
                    fetch(`https://worldtimeapi.org/api/timezone/${tz}`).then(res => res.json())
                );
                
                const results = await Promise.all(requests);
                
                results.forEach((data, index) => {
                    const id = Object.keys(timezones)[index];
                    const { name } = Object.values(timezones)[index];
                    renderClock(id, name, data.utc_datetime);
                });

            } catch (error) {
                console.error("Error fetching world times:", error);
                clockContainer.innerHTML = "<p>시간 정보를 불러오는 데 실패했습니다.</p>";
            }
        };

        const updateClocks = () => {
            Object.entries(timezones).forEach(([id, { name, tz }]) => {
                const timeString = new Date().toLocaleTimeString('en-US', { timeZone: tz });
                const dateObj = new Date(`1970-01-01T${timeString}Z`);
                
                const hours = String(dateObj.getUTCHours()).padStart(2, '0');
                const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
                const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');

                const el = document.getElementById(id);
                if (el) {
                     el.innerHTML = `
                        <div class="city-name">${name}</div>
                        <div class="time">${hours}:${minutes}:${seconds}</div>
                    `;
                }
            });
        };
        
        fetchWorldTimes().then(() => {
            setInterval(updateClocks, 1000);
        });
    }

    // --- Lotto Number Generator ---
    if (generateBtn) {
        const getBallColorClass = (number) => {
            if (number <= 10) return 'ball-color-1';
            if (number <= 20) return 'ball-color-2';
            if (number <= 30) return 'ball-color-3';
            if (number <= 40) return 'ball-color-4';
            return 'ball-color-5';
        };

        const generateNumbers = () => {
            const numbers = new Set();
            while (numbers.size < 6) {
                const randomNumber = Math.floor(Math.random() * 45) + 1;
                numbers.add(randomNumber);
            }
            return Array.from(numbers).sort((a, b) => a - b);
        };

        const displayNumbers = (numbers) => {
            lottoNumbersContainer.innerHTML = ''; // Clear previous numbers or placeholder
            numbers.forEach((number, index) => {
                const ball = document.createElement('div');
                ball.className = `lotto-ball ${getBallColorClass(number)}`;
                ball.textContent = number;
                ball.style.animationDelay = `${index * 0.1}s`;
                lottoNumbersContainer.appendChild(ball);
            });
        };

        generateBtn.addEventListener('click', () => {
            const newNumbers = generateNumbers();
            displayNumbers(newNumbers);
        });
    }

    // --- Teachable Machine Image Model (Drag & Drop) ---
    const tmURL = "https://teachablemachine.withgoogle.com/models/x4LHW8Yan/";
    let tmModel;

    const imageDropZone = document.getElementById('image-drop-zone');
    const imageUploader = document.getElementById('image-uploader');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const dropZonePrompt = document.querySelector('.drop-zone-prompt');
    const uploadButton = document.getElementById('upload-btn');
    const tmLabelContainer = document.getElementById('label-container');

    if (imageDropZone) {
        const modelURL = tmURL + "model.json";
        const metadataURL = tmURL + "metadata.json";

        // 통합 이미지 처리 함수
        const handleImageFile = (file) => {
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드 가능합니다.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewContainer.innerHTML = ''; // 이전 미리보기 제거
                const img = document.createElement('img');
                img.src = e.target.result;
                img.onload = () => predictImage(img);
                imagePreviewContainer.appendChild(img);
                dropZonePrompt.style.display = 'none'; // 안내 문구 숨기기
            };
            reader.readAsDataURL(file);
        };

        // 모델 로드
        async function loadTMModel() {
            try {
                tmModel = await tmImage.load(modelURL, metadataURL);
                console.log("Teachable Machine model loaded.");
                dropZonePrompt.querySelector('p').textContent = '분석할 이미지를 드래그 앤 드롭하세요';
                uploadButton.textContent = '파일 선택';
                uploadButton.disabled = false;
                imageDropZone.style.cursor = 'pointer';
            } catch (error) {
                console.error("Error loading Teachable Machine model:", error);
                dropZonePrompt.querySelector('p').textContent = '모델 로딩에 실패했습니다.';
                uploadButton.textContent = '로딩 실패';
            }
        }

        // 예측 실행
        async function predictImage(imageElement) {
            if (!tmModel) {
                console.log("Model not loaded yet");
                return;
            }
            const prediction = await tmModel.predict(imageElement);
            const maxPredictions = tmModel.getTotalClasses();
            tmLabelContainer.innerHTML = '';

            for (let i = 0; i < maxPredictions; i++) {
                const classPrediction =
                    prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%";
                const div = document.createElement("div");
                div.className = 'prediction-label';
                div.innerHTML = classPrediction;
                tmLabelContainer.appendChild(div);
            }
        }

        // --- 이벤트 리스너 설정 ---

        // 드롭존 클릭
        imageDropZone.addEventListener('click', () => {
            if (!uploadButton.disabled) {
                imageUploader.click();
            }
        });
        
        // 파일 직접 선택
        imageUploader.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                handleImageFile(files[0]);
            }
        });

        // 드래그 이벤트
        imageDropZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            if (!uploadButton.disabled) {
                imageDropZone.classList.add('drag-over');
            }
        });

        imageDropZone.addEventListener('dragleave', (event) => {
            event.preventDefault();
            imageDropZone.classList.remove('drag-over');
        });

        imageDropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            imageDropZone.classList.remove('drag-over');
            if (uploadButton.disabled) return;

            const files = event.dataTransfer.files;
            if (files && files.length > 0) {
                handleImageFile(files[0]);
            }
        });
        
        // 초기 설정
        dropZonePrompt.querySelector('p').textContent = '모델 로딩중...';
        uploadButton.disabled = true;
        imageDropZone.style.cursor = 'progress';
        loadTMModel();
    }
});
