// Christmas logo functionality
// This script adds snow effect and plays sound when the Christmas logo is clicked

(function() {
    'use strict';
    
    // Configuration
    const SNOW_DURATION = 5000; // 5 seconds
    const SNOWFLAKE_COUNT = 50;
    const SOUND_URL = 'https://taopower.com.ar/assets/hohoho.mp3';
    
    // Function to create and show snowflakes
    function createSnowEffect() {
        const container = document.createElement('div');
        container.id = 'snow-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        
        for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄';
            
            const startX = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = 3 + Math.random() * 2;
            const fontSize = 10 + Math.random() * 20;
            
            snowflake.style.cssText = `
                position: absolute;
                top: -20px;
                left: ${startX}%;
                font-size: ${fontSize}px;
                color: white;
                opacity: ${0.5 + Math.random() * 0.5};
                animation: snowfall ${duration}s linear ${delay}s infinite;
                text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            `;
            
            container.appendChild(snowflake);
        }
        
        document.body.appendChild(container);
        
        // Remove snow after duration
        setTimeout(() => {
            container.remove();
        }, SNOW_DURATION);
    }
    
    // Function to play sound
    function playSound() {
        const audio = new Audio(SOUND_URL);
        audio.volume = 0.5;
        audio.play().catch(err => {
            console.log('Audio playback failed:', err);
        });
    }
    
    // Function to handle logo click
    function handleLogoClick(event) {
        event.preventDefault();
        createSnowEffect();
        playSound();
    }
    
    // Function to initialize Christmas logo
    function initChristmasLogo() {
        const logo = document.querySelector('.navbar-brand img');
        if (logo) {
            // Make logo clickable for Christmas
            logo.style.cursor = 'pointer';
            logo.parentElement.style.cursor = 'pointer';
            logo.parentElement.addEventListener('click', handleLogoClick);
        }
    }
    
    // Add CSS for snowfall animation
    function addSnowfallCSS() {
        if (!document.getElementById('snowfall-css')) {
            const style = document.createElement('style');
            style.id = 'snowfall-css';
            style.textContent = `
                @keyframes snowfall {
                    0% {
                        top: -20px;
                        transform: translateX(0) rotate(0deg);
                    }
                    100% {
                        top: 100vh;
                        transform: translateX(${Math.random() > 0.5 ? '' : '-'}50px) rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addSnowfallCSS();
            initChristmasLogo();
        });
    } else {
        addSnowfallCSS();
        initChristmasLogo();
    }
})();
