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
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        container.style.overflow = 'hidden';
        
        // Use a limited set of animation variants (5) instead of creating 50 unique ones
        const animationVariants = 5;
        
        for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄';
            
            const startX = Math.random() * 100;
            const animationIndex = i % animationVariants; // Reuse 5 animation patterns
            const delay = Math.random() * 2;
            const duration = 3 + Math.random() * 2;
            const fontSize = 10 + Math.random() * 20;
            
            snowflake.style.position = 'absolute';
            snowflake.style.top = '-20px';
            snowflake.style.left = startX + '%';
            snowflake.style.fontSize = fontSize + 'px';
            snowflake.style.color = 'white';
            snowflake.style.opacity = 0.5 + Math.random() * 0.5;
            snowflake.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.8)';
            snowflake.style.animation = `snowfall-${animationIndex} ${duration}s linear ${delay}s infinite`;
            
            container.appendChild(snowflake);
        }
        
        document.body.appendChild(container);
        
        // Remove snow after duration
        setTimeout(() => {
            container.remove();
        }, SNOW_DURATION);
    }
    
    // Audio instance for ho-ho-ho sound
    let audioInstance = null;
    
    // Function to play sound
    function playSound() {
        if (!audioInstance) {
            audioInstance = new Audio(SOUND_URL);
            audioInstance.volume = 0.5;
        }
        audioInstance.currentTime = 0;
        audioInstance.play().catch(err => {
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
        const logo = document.getElementById('navbar-logo');
        if (logo) {
            // Change to Christmas logo
            logo.src = 'https://taopower.com.ar/assets/images/logo-blanco-122x86(navidad).png';
            
            // Make logo clickable for Christmas
            const logoLink = document.getElementById('logo-link');
            if (logoLink) {
                logoLink.style.cursor = 'pointer';
                logoLink.addEventListener('click', handleLogoClick);
            }
        }
    }
    
    // Add CSS for snowfall animation
    function addSnowfallCSS() {
        if (!document.getElementById('snowfall-css')) {
            const style = document.createElement('style');
            style.id = 'snowfall-css';
            // Create 5 different snowfall animation patterns for variety
            style.textContent = `
                @keyframes snowfall-0 {
                    0% { top: -20px; transform: translateX(0) rotate(0deg); }
                    100% { top: 100vh; transform: translateX(30px) rotate(360deg); }
                }
                @keyframes snowfall-1 {
                    0% { top: -20px; transform: translateX(0) rotate(0deg); }
                    100% { top: 100vh; transform: translateX(-30px) rotate(-360deg); }
                }
                @keyframes snowfall-2 {
                    0% { top: -20px; transform: translateX(0) rotate(0deg); }
                    100% { top: 100vh; transform: translateX(50px) rotate(360deg); }
                }
                @keyframes snowfall-3 {
                    0% { top: -20px; transform: translateX(0) rotate(0deg); }
                    100% { top: 100vh; transform: translateX(-50px) rotate(-360deg); }
                }
                @keyframes snowfall-4 {
                    0% { top: -20px; transform: translateX(0) rotate(0deg); }
                    100% { top: 100vh; transform: translateX(0) rotate(360deg); }
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
