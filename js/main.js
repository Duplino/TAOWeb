// Main JavaScript for TAO Power Website

// Constants
const MOBILE_BREAKPOINT = 992; // Matches Bootstrap's lg breakpoint
const CLOSE_BUTTON_AREA_SIZE = 56; // 40px button + 1rem (16px) margin

// Contact Form Handler
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
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
            
            // Get form data
            const formData = {
                nombre: contactForm.querySelector('#nombre').value,
                email: contactForm.querySelector('#email').value,
                telefono: contactForm.querySelector('#telefono').value,
                asunto: contactForm.querySelector('#asunto').value,
                mensaje: contactForm.querySelector('#mensaje').value
            };
            
            // Execute reCAPTCHA v3
            grecaptcha.ready(function() {
                grecaptcha.execute('6Le0CzgsAAAAAOCgxeAI5gaWTGkjat-5Bbn0cXZP', {action: 'submit'}).then(function(token) {
                    // Add reCAPTCHA token to form data
                    formData.recaptcha_token = token;
                    
                    // Send AJAX request
                    fetch('submit-contact.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Re-enable submit button
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                        
                        // Show success or error message
                        formMessage.classList.remove('d-none');
                        
                        if (data.success) {
                            formMessage.classList.remove('alert-danger');
                            formMessage.classList.add('alert-success');
                            formMessage.innerHTML = '<i class="bi bi-check-circle me-2"></i>' + data.message;
                            contactForm.reset();
                        } else {
                            formMessage.classList.remove('alert-success');
                            formMessage.classList.add('alert-danger');
                            formMessage.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>' + data.message;
                        }
                        
                        // Hide message after 5 seconds
                        setTimeout(() => {
                            formMessage.classList.add('d-none');
                        }, 5000);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        
                        // Re-enable submit button
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                        
                        // Show error message
                        formMessage.classList.remove('d-none', 'alert-success');
                        formMessage.classList.add('alert-danger');
                        formMessage.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Error al enviar el mensaje. Por favor, intenta nuevamente.';
                        
                        // Hide message after 5 seconds
                        setTimeout(() => {
                            formMessage.classList.add('d-none');
                        }, 5000);
                    });
                });
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
