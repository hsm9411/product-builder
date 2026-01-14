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

    // --- AI Cat of the Day ---
    const aiCatContainer = document.getElementById('ai-cat-container');
    if (aiCatContainer) {
        const fetchAiCat = async () => {
            try {
                const response = await fetch('https://api.ai-cats.net/v1/cat/info/669de24a-1da1-4fcd-84b1-9e55a43a0e0e');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const formattedDate = new Date(data.dateCreated).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                aiCatContainer.innerHTML = `
                    <img src="${data.url}" alt="AI 고양이 이미지" class="ai-cat-image">
                    <div class="ai-cat-prompt">
                        <p>${data.prompt}</p>
                    </div>
                    <div class="ai-cat-date">
                        <span>생성일: ${formattedDate}</span>
                    </div>
                `;
            } catch (error) {
                console.error("Error fetching AI cat:", error);
                aiCatContainer.innerHTML = `<div class="placeholder">고양이 정보를 불러오는 데 실패했습니다.</div>`;
            }
        };

        fetchAiCat();
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

    // --- Recommended Books by Subject ---
    const bookListContainer = document.getElementById('book-list-container');
    const subjectButtons = document.querySelectorAll('.subject-btn');

    if (bookListContainer && subjectButtons.length > 0) {
        const fetchBooksBySubject = async (subject) => {
            bookListContainer.innerHTML = `<div class="placeholder">도서 정보를 불러오는 중...</div>`;

            try {
                const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=12`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data.works && data.works.length > 0) {
                    bookListContainer.innerHTML = ''; // Clear loading text
                    data.works.forEach(book => {
                        const bookCard = document.createElement('div');
                        bookCard.className = 'book-card';

                        const coverId = book.cover_id;
                        const coverUrl = coverId 
                            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` 
                            : 'https://via.placeholder.com/180x240.png?text=No+Cover';

                        const authorName = book.authors && book.authors.length > 0 
                            ? book.authors[0].name 
                            : '저자 정보 없음';

                        bookCard.innerHTML = `
                            <img src="${coverUrl}" alt="${book.title} 표지" class="book-cover">
                            <div class="book-info">
                                <h4 class="book-title">${book.title}</h4>
                                <p class="book-author">${authorName}</p>
                            </div>
                        `;
                        bookListContainer.appendChild(bookCard);
                    });
                } else {
                    bookListContainer.innerHTML = `<div class="placeholder">해당 주제의 도서를 찾을 수 없습니다.</div>`;
                }
            } catch (error) {
                console.error(`Error fetching books for subject "${subject}":`, error);
                bookListContainer.innerHTML = `<div class="placeholder">도서 정보를 불러오는 데 실패했습니다.</div>`;
            }
        };

        subjectButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Deactivate other buttons
                subjectButtons.forEach(b => b.classList.remove('active'));
                // Activate clicked button
                btn.classList.add('active');
                
                const subject = btn.dataset.subject;
                fetchBooksBySubject(subject);
            });
        });
    }

    // --- Today's Random Recipe ---
    const randomRecipeContainer = document.getElementById('random-recipe-container');
    const newRecipeBtn = document.getElementById('new-recipe-btn');

    if (randomRecipeContainer && newRecipeBtn) {
        const fetchRandomMeal = async () => {
            randomRecipeContainer.innerHTML = `<div class="placeholder">레시피를 불러오는 중...</div>`;
            try {
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const meal = data.meals[0];

                if (meal) {
                    let ingredientsList = '';
                    for (let i = 1; i <= 20; i++) {
                        const ingredient = meal[`strIngredient${i}`];
                        const measure = meal[`strMeasure${i}`];
                        if (ingredient && ingredient.trim() !== '' && measure && measure.trim() !== '') {
                            ingredientsList += `<li>${measure} ${ingredient}</li>`;
                        }
                    }

                    // CSS 클래스를 새로운 구조에 맞게 수정
                    randomRecipeContainer.innerHTML = `
                        <div class="meal-card">
                            <h3 class="meal-name">${meal.strMeal}</h3>
                            <div class="meal-meta">${meal.strCategory} | ${meal.strArea}</div>
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal} 이미지" class="meal-image">
                            
                            <div class="meal-details">
                                <h4>재료:</h4>
                                <ul class="ingredient-list">${ingredientsList}</ul>

                                <h4>조리법:</h4>
                                <button class="content-toggle-btn" data-target="recipe-instructions" data-text="조리법">조리법 &#x25BC;</button>
                                <!-- collapsible-content 클래스 적용 -->
                                <div id="recipe-instructions" class="collapsible-content">
                                    <p>${meal.strInstructions.replace(/\r\n/g, '<br>')}</p>
                                </div>
                            </div>
                        </div>
                    `;

                } else {
                    randomRecipeContainer.innerHTML = `<div class="placeholder">레시피를 찾을 수 없습니다.</div>`;
                }

            } catch (error) {
                console.error("Error fetching random meal:", error);
                randomRecipeContainer.innerHTML = `<div class="placeholder">레시피를 불러오는 데 실패했습니다.</div>`;
            }
        };

        newRecipeBtn.addEventListener('click', fetchRandomMeal);
        fetchRandomMeal(); // Initial load
    }

    // --- Generic Content Toggle (통합 토글 기능) ---
    // 로또, 얼굴 분석, 레시피 등 모든 토글 버튼을 여기서 처리합니다.
    document.addEventListener('click', event => {
        if (event.target.matches('.content-toggle-btn')) {
            const targetId = event.target.dataset.target;
            const targetContent = document.getElementById(targetId);
            
            if (targetContent) {
                // Toggle the expanded class
                const isExpanded = targetContent.classList.contains('expanded');
                
                if (isExpanded) {
                    targetContent.classList.remove('expanded');
                    // 화살표 아래로 (펼치기 전)
                    event.target.innerHTML = `${event.target.dataset.text} &#x25BC;`; 
                } else {
                    targetContent.classList.add('expanded');
                    // 화살표 위로 (펼친 후)
                    event.target.innerHTML = `${event.target.dataset.text} &#x25B2;`; 
                }
            }
        }
    });

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