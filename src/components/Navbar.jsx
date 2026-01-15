import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const Navbar = () => {
    const [theme, toggleTheme] = useTheme();

    return (
        <header className="main-header">
            <nav className="main-nav">
                <NavLink to="/" className="nav-brand">Product Builder</NavLink>
                <ul className="nav-links nav-links-center">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/contact">Contact</NavLink></li>
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                </ul>
                <button id="theme-toggle" className="theme-btn" onClick={toggleTheme}>
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </nav>
        </header>
    );
};

export default Navbar;
