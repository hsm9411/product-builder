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

    // --- Lotto Number Generator ---
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

    // --- Contact Form ---
    const contactFab = document.getElementById('contact-fab');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const contactForm = document.getElementById('contact-form');

    const toggleModal = (show) => {
        if (show) {
            contactModal.classList.remove('hidden');
        } else {
            contactModal.classList.add('hidden');
        }
    };

    contactFab.addEventListener('click', () => toggleModal(true));
    closeModalBtn.addEventListener('click', () => toggleModal(false));
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            toggleModal(false);
        }
    });

    // --- EmailJS Integration ---
    (function() {
        emailjs.init({
          publicKey: "JeuzT7Yq85UM42Y3o",
        });
    })();

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const serviceID = 'service_uat02yj';
        const templateID = 'template_jg7qinn';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                alert('Sent!');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                this.reset();
                toggleModal(false);
            }, (err) => {
                alert(JSON.stringify(err));
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
    });

    // --- Teachable Machine Image Model (Image Upload) ---
    const tmURL = "https://teachablemachine.withgoogle.com/models/x4LHW8Yan/";
    let tmModel;
    const uploadButton = document.getElementById('upload-btn');
    const imageUploader = document.getElementById('image-uploader');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const tmLabelContainer = document.getElementById('label-container');

    // Load the model
    async function loadTMModel() {
        const modelURL = tmURL + "model.json";
        const metadataURL = tmURL + "metadata.json";
        try {
            tmModel = await tmImage.load(modelURL, metadataURL);
            console.log("Teachable Machine model loaded.");
            uploadButton.disabled = false;
            uploadButton.textContent = '이미지 업로드';
        } catch (error) {
            console.error("Error loading Teachable Machine model:", error);
            uploadButton.textContent = '모델 로딩 실패';
        }
    }

    // Run prediction on the image
    async function predictImage(imageElement) {
        if (!tmModel) {
            console.log("Model not loaded yet");
            return;
        }
        const prediction = await tmModel.predict(imageElement);
        const maxPredictions = tmModel.getTotalClasses();
        tmLabelContainer.innerHTML = ''; // Clear previous results

        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%";
            const div = document.createElement("div");
            div.className = 'prediction-label';
            div.innerHTML = classPrediction;
            tmLabelContainer.appendChild(div);
        }
    }

    // Handle image upload
    uploadButton.addEventListener('click', () => {
        imageUploader.click();
    });

    imageUploader.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewContainer.innerHTML = ''; // Clear previous image
                const img = document.createElement('img');
                img.id = 'image-preview';
                img.src = e.target.result;
                img.onload = () => predictImage(img); // Predict after image is loaded
                imagePreviewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    // Initial setup
    uploadButton.disabled = true;
    uploadButton.textContent = '모델 로딩중...';
    loadTMModel();
});
