// ================ Global Variables ================
const currentYear = new Date().getFullYear();

// ================ DOM Elements ================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const darkModeToggle = document.createElement('div');

// ================ Mobile Navigation ================
function initMobileNav() {
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ================ Smooth Scrolling ================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================ Active Nav Link Highlighting ================
function initActiveNavHighlight() {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ================ Contact Form Handling ================
function initContactForm() {
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const formFields = contactForm.querySelectorAll('input, textarea');

    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        // Change button state during submission
        submitBtn.classList.add('sending');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual fetch in production)
            await simulateFormSubmission();
            
            showFormMessage('success', 'Message sent successfully!');
            this.reset();
        } catch (error) {
            showFormMessage('error', 'An error occurred. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.classList.remove('sending');
            submitBtn.disabled = false;
        }
    });

    // Real-time field validation
    formFields.forEach(field => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });

    // Field validation function
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        // Clear previous errors
        formGroup.classList.remove('error');
        errorMessage.textContent = '';
        
        // Required field validation
        if (field.required && !field.value.trim()) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'This field is required';
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && !isValidEmail(field.value)) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'Please enter a valid email address';
            return false;
        }
        
        return true;
    }

    // Full form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Form message display
    function showFormMessage(type, message) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Fade in animation
        setTimeout(() => {
            formMessage.style.opacity = '1';
        }, 10);
        
        // Fade out after 5 seconds
        setTimeout(() => {
            formMessage.style.opacity = '0';
            setTimeout(() => {
                formMessage.className = 'form-message';
            }, 300);
        }, 5000);
    }

    // Simulate form submission (replace with real API call)
    function simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate for demo
                Math.random() > 0.1 ? resolve() : reject(new Error('Server error'));
            }, 1500);
        });
    }
}

// ================ Project Filtering ================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            const filterValue = button.dataset.filter;
            filterProjects(filterValue);
        });
    });

    function filterProjects(filterValue) {
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (filterValue === 'all' || cardCategory === filterValue) {
                showProjectCard(card);
            } else {
                hideProjectCard(card);
            }
        });
    }

    function showProjectCard(card) {
        card.style.display = 'block';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    }

    function hideProjectCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    // Initialize all projects as visible
    projectCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

// ================ Dark Mode Toggle ================
function initDarkMode() {
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Check for saved preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    updateDarkModeIcon(isDarkMode);
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

function updateDarkModeIcon(isDarkMode) {
    const icon = darkModeToggle.querySelector('i');
    icon.classList.toggle('fa-moon', !isDarkMode);
    icon.classList.toggle('fa-sun', isDarkMode);
}

// ================ Initialize All Functions ================
function initAll() {
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = currentYear;

    // Initialize components
    initMobileNav();
    initSmoothScrolling();
    initActiveNavHighlight();
    initContactForm();
    initProjectFilters();
    initDarkMode();
    
    // Set active page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', initAll);