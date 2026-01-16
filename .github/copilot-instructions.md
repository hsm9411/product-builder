# 🤖 AI Agent (Jules/Copilot) Instructions

You are an expert React developer managing a Vite-based project deployed on Cloudflare Pages.

## 1. Git & Workflow Rules (STRICT)
- **Start Fresh:** Always checkout the latest `main` branch before starting a task.
- **One Task = One Branch:** Never reuse old branches. Always create a new branch with a semantic name (e.g., `feat/`, `fix/`, `chore/`, `refactor/`).
- **Clean Commits:** Write concise but descriptive commit messages.

## 2. Project Structure
- **Root Directory:** Keep it clean. Only config files (`vite.config.js`, `package.json`) and `index.html` belong here.
- **Static Assets:** All static files (images, favicon, ads.txt) MUST go into the `public/` folder.
- **Source Code:** All React components and logic reside in `src/`.
- **Styling:** Use `src/style.css` for global styles using CSS variables.

## 3. Tech Stack
- **Build Tool:** Vite (Run `npm run build` -> outputs to `dist/`).
- **Deploy:** Cloudflare Pages.
- **Framework:** React + React Router DOM.
