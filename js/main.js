/**
 * MNEMOGENICS.COM - Main JavaScript
 * Handles form validation, smooth scrolling, mobile menu, and cookie notice
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Show cookie notice
    showCookieNotice();
    
    // Form validation
    initFormValidation();
    
    // Initialize animations
    initAnimations();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle menu icon animation
            mobileToggle.classList.toggle('open');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && 
            navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-toggle')) {
            navLinks.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.classList.remove('open');
            }
        }
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Cookie Notice Functionality
 */
function showCookieNotice() {
    const cookieNotice = document.getElementById('cookie-notice');
    const acceptButton = document.getElementById('cookie-accept');
    
    // Check if user has already accepted cookies
    if (cookieNotice && !localStorage.getItem('cookiesAccepted')) {
        cookieNotice.style.display = 'block';
        
        if (acceptButton) {
            acceptButton.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieNotice.style.display = 'none';
            });
        }
    }
}

/**
 * Form Validation
 */
function initFormValidation() {
    const form = document.getElementById('domain-inquiry-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            // Prevent default form submission
            e.preventDefault();
            
            // Clear previous error messages
            clearErrors();
            
            // Get form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Validate required fields
            let valid = true;
            
            if (!name.value.trim()) {
                showError(name, 'Name is required');
                valid = false;
            }
            
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                valid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                valid = false;
            }
            
            if (!message.value.trim()) {
                showError(message, 'Message is required');
                valid = false;
            }
            
            // If the form is valid, submit it
            if (valid) {
                // Get the form data
                const formData = new FormData(form);
                
                // Submit the form using fetch API
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Redirect to thank you page
                        window.location.href = 'thank-you.html';
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch(error => {
                    console.error('Form submission error:', error);
                    alert('There was a problem submitting your form. Please try again.');
                });
            }
        });
    }
}

/**
 * Show error message for a form field
 */
function showError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
    field.classList.add('error');
    field.focus();
}

/**
 * Clear all form error messages
 */
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const formFields = document.querySelectorAll('input, textarea, select');
    
    errorMessages.forEach(error => {
        error.textContent = '';
    });
    
    formFields.forEach(field => {
        field.classList.remove('error');
    });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Initialize animations using Intersection Observer
 */
function initAnimations() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Stop observing once animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible
        
        sections.forEach(section => {
            section.classList.add('animate-on-scroll');
            observer.observe(section);
        });
    }
}
