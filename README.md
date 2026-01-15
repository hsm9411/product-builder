# Product Builder - A React-Based Web Tools Collection

## 1. Project Overview

Product Builder is a web application that provides a collection of fun and useful tools for users. Originally a legacy project built with static HTML, CSS, and JavaScript, it has been completely migrated to a modern, professional-grade stack using **React** and **Vite**. The application's content is primarily in Korean and features various tools, including a lottery number generator, an AI-powered image analyzer, a random recipe generator, and more.

The primary goal of this project is to offer a clean, engaging, and consistent user experience while ensuring the codebase is highly maintainable, scalable, and easy for future developers (including AI agents) to understand and contribute to.

## 2. Tech Stack

-   **Framework:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Routing:** [React Router DOM](https://reactrouter.com/)
-   **Styling:** Global CSS with CSS Variables (`style.css`)
-   **External Libraries:**
    -   [TensorFlow.js](https://www.tensorflow.org/js) & [Teachable Machine](https://teachablemachine.withgoogle.com/): For the "Facial Analysis" feature.
    -   [EmailJS](https://www.emailjs.com/): For the contact form functionality.
    -   [Disqus](https://disqus.com/): For the comments section.

## 3. Directory Structure

The project follows a standard React application structure, organizing files by their function to ensure clarity and maintainability.

```
/
├── public/
│   └── favicon.svg         # Application favicon
├── src/
│   ├── components/         # Reusable, shared components
│   │   ├── AiCat.jsx
│   │   ├── DisqusComments.jsx
│   │   ├── FacialAnalysis.jsx
│   │   ├── Layout.jsx      # Master layout component (wraps all pages)
│   │   ├── LottoGenerator.jsx
│   │   ├── Navbar.jsx      # Site-wide navigation bar
│   │   ├── RandomRecipe.jsx
│   │   ├── RecommendedBooks.jsx
│   │   └── ToolSection.jsx # Standardized container for feature sections
│   ├── hooks/              # Custom React hooks
│   │   └── useTheme.js     # Logic for dark/light mode
│   ├── pages/              # Page-level components
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── HomePage.jsx
│   │   └── PrivacyPage.jsx
│   ├── App.jsx             # Main application component with routing
│   ├── main.jsx            # Entry point of the React application
│   └── style.css           # Global stylesheet
├── .gitignore
├── index.html              # HTML template for Vite
├── package.json
└── README.md               # This file
```

## 4. Key Architectural Decisions

This project was designed with a few core principles to ensure a high-quality, maintainable codebase.

### a. Unified Layout System

To solve issues of inconsistent widths and a "lopsided" feel, a master `Layout.jsx` component wraps all page components.
-   **Centralized Layout:** All content is rendered within a `.content-wrapper` class, which enforces a consistent `max-width` of `1024px` and is centered on the page using `margin: 0 auto`.
-   **Consistent Typography:** A professional and consistent typography system is defined in `style.css` using CSS variables (e.g., `--font-size-h1`, `--line-height-body`). This ensures all text is readable and visually harmonized.

### b. Dark/Light Mode Implementation

The theme-switching functionality is managed by a custom React hook, `src/hooks/useTheme.js`.
-   **State Management:** The `useTheme` hook encapsulates the logic for toggling the theme and persisting the user's choice in `localStorage`.
-   **Global Application:** The theme is applied globally by setting a `data-theme="dark"` attribute on the `<html>` element, which is then used by the CSS to apply the appropriate color variables.

### c. Modular and Semantic Component Design

Instead of monolithic pages, the content is broken down into small, reusable, and semantic components.
-   **`ToolSection.jsx`:** A key design pattern is the use of the `ToolSection` component, which acts as a standardized wrapper for each feature on the homepage. It uses a `<section>` tag and provides a consistent `<h2>` title, improving both code reuse and HTML semantics.
-   **Clear Separation of Concerns:** Each feature (e.g., `LottoGenerator`, `FacialAnalysis`) is a self-contained component, making it easy to debug, modify, or extend individual tools without affecting the rest of the application.

## 5. Development Guide

To get the project running locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 6. Context for Future AI Agents

This section provides specific guidance for AI-powered development and refactoring.

-   **Global CSS Variables:** All colors, fonts, and layout constants are defined as CSS variables in the `:root` of `style.css`. When making styling changes, always check for and use these variables first before writing new CSS.
-   **Component Naming Conventions:** Components are named using `PascalCase` (e.g., `LottoGenerator.jsx`). Maintain this convention. Page components are suffixed with `Page` (e.g., `HomePage.jsx`).
-   **Layout Component is Key:** All new pages must be wrapped by the `src/components/Layout.jsx` component to ensure they inherit the unified layout, navigation, and footer.
-   **`ToolSection` for New Features:** Any new tool or feature added to the homepage should be wrapped in the `src/components/ToolSection.jsx` component to maintain visual consistency.
-   **External Scripts:** The "Facial Analysis" tool depends on `TensorFlow.js` and `Teachable Machine`, which are loaded via `<script>` tags in the main `index.html`. Be aware that these are not NPM packages and are required for the tool to function.
-   **State Management:** For now, state is managed locally within components. If the application grows more complex, consider introducing a global state management solution like Redux Toolkit or Zustand.
