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
            'clock-seoul': { name: '서울', tz: 'Asia/Seoul', image: 'images/seoul.jpg' },
            'clock-ny': { name: '뉴욕', tz: 'America/New_York', image: 'images/newyork.jpg' },
            'clock-london': { name: '런던', tz: 'Europe/London', image: 'images/london.jpg' },
        };

        const timeOffsets = {}; // Store { timezone: offset_in_ms }

        // Initialize clocks with loading state
        Object.entries(timezones).forEach(([id, { name, image }]) => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = `
                    <img src="${image}" alt="${name}" class="city-image">
                    <div class="city-name">${name}</div>
                    <div class="time loading-text">로딩 중...</div>
                `;
            }
        });

        // Helper function for fetch with retry
        const retryFetch = async (url, retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response;
                } catch (error) {
                    if (i < retries - 1) {
                        console.warn(`Fetch failed for ${url}, retrying in ${delay}ms...`, error);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        delay *= 2; // Exponential backoff
                    } else {
                        throw error; // Re-throw error after max retries
                    }
                }
            }
        };

        const fetchWorldTimes = async () => {
            const localDate = new Date();
            const fetchPromises = Object.values(timezones).map(async tzInfo => {
                try {
                    const res = await retryFetch(`https://worldtimeapi.org/api/timezone/${tzInfo.tz}`, 3, 1000);
                    const data = await res.json();
                    const serverTime = new Date(data.datetime).getTime();
                    timeOffsets[data.timezone] = serverTime - localDate.getTime();
                } catch (error) {
                    console.error(`Error fetching time for ${tzInfo.name} (${tzInfo.tz}) after multiple retries:`, error);
                    timeOffsets[tzInfo.tz] = undefined; // Mark as failed
                    const el = document.getElementById(Object.keys(timezones).find(key => timezones[key].tz === tzInfo.tz));
                    if (el) {
                        const timeEl = el.querySelector('.time');
                        if (timeEl) {
                            timeEl.textContent = 'API 연결 실패';
                            timeEl.classList.add('time-error'); // Add class for styling
                        }
                    }
                }
            });
            await Promise.allSettled(fetchPromises); // Use allSettled to wait for all promises regardless of success/failure
            console.log('Calculated timeOffsets:', timeOffsets); // Debugging line
            updateClocks(); // Initial display for successful ones
            setInterval(updateClocks, 1000); // Start updating
        };

        const updateClocks = () => {
            const localNow = new Date();
            Object.entries(timezones).forEach(([id, { name, tz, image }]) => {
                const offset = timeOffsets[tz];
                const el = document.getElementById(id);

                if (offset === undefined) {
                    const timeEl = el.querySelector('.time');
                    if (timeEl) {
                        timeEl.textContent = 'API 연결 실패';
                        timeEl.classList.add('time-error');
                    }
                    return; 
                }

                const cityTime = new Date(localNow.getTime() + offset);
                
                const hours = String(cityTime.getHours()).padStart(2, '0');
                const minutes = String(cityTime.getMinutes()).padStart(2, '0');
                const seconds = String(cityTime.getSeconds()).padStart(2, '0');

                const timeEl = el.querySelector('.time');
                if (timeEl) {
                     timeEl.textContent = `${hours}:${minutes}:${seconds}`;
                     timeEl.classList.remove('time-error'); // Remove error class if time is successfully shown
                }
            });
        };
        
        fetchWorldTimes();
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
