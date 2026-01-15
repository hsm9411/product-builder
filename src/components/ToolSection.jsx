import React from 'react';

const ToolSection = ({ title, children }) => {
    return (
        <section className="tool-section">
            <h2 className="title">{title}</h2>
            {children}
        </section>
    );
};

export default ToolSection;
