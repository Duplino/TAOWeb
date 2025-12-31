// Contact Form Handler for TAO Power Website

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            const recaptchaKey = contactForm.dataset.recaptchaKey || '6Le0CzgsAAAAAOCgxeAI5gaWTGkjat-5Bbn0cXZP';
            
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
                grecaptcha.execute(recaptchaKey, {action: 'submit'}).then(function(token) {
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
});
