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
});
