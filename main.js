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
