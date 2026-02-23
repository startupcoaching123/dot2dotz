import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/30 focus:ring-purple-500",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white/10 focus:ring-white",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-200",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
