import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="page-container">
            <Navbar />
            <main className="content-wrapper">
                {children}
            </main>
            <footer className="main-footer">
                <div className="footer-links">
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                    <NavLink to="/privacy">Privacy Policy</NavLink>
                </div>
                <p>&copy; 2024 Product Builder. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
