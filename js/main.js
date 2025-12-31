// Main JavaScript for TAO Power Website

// Constants
const MOBILE_BREAKPOINT = 992; // Matches Bootstrap's lg breakpoint
const CLOSE_BUTTON_AREA_SIZE = 56; // 40px button + 1rem (16px) margin

// General Website Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu close button handler
    const navbarCollapse = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse && navbarToggler) {
        // Close menu when clicking the close button (::before pseudo-element area)
        navbarCollapse.addEventListener('click', function(e) {
            // Check if clicked in the top-right area where close button is
            const rect = navbarCollapse.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // Close button is at top-right (40x40px, 1rem margin)
            if (clickX > rect.width - CLOSE_BUTTON_AREA_SIZE && clickY < CLOSE_BUTTON_AREA_SIZE && window.innerWidth < MOBILE_BREAKPOINT) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, {toggle: false});
                bsCollapse.hide();
            }
        });
        
        // Close menu when clicking on nav links (for better UX)
        navbarCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < MOBILE_BREAKPOINT) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, {toggle: false});
                    bsCollapse.hide();
                }
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.classList.contains('sticky-top')) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(33, 37, 41, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                navbar.style.backgroundColor = 'rgba(33, 37, 41, 1)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
});
