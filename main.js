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
});

// --- Teachable Machine Image Model ---
const URL = "https://teachablemachine.withgoogle.com/models/x4LHW8Yan/";
let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
window.initTm = async function() { // Made globally accessible
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").innerHTML = ''; // Clear previous content
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ''; // Clear previous content
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        const div = document.createElement("div");
        div.className = 'prediction-label'; // Add a class for styling
        labelContainer.appendChild(div);
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%"; // Format as percentage
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
