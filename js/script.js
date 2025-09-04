// Main JavaScript for Portfolio Website
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    initializeTheme();
    
    // Mobile menu functionality
    initializeMobileMenu();
    
    // Smooth scrolling
    initializeSmoothScrolling();
    
    // Form validation
    initializeFormValidation();
    
    // Animations
    initializeAnimations();
    
    // Additional features
    initializeAdditionalFeatures();
});

function initializeTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const moonIconMobile = document.getElementById('moon-icon-mobile');
    const sunIconMobile = document.getElementById('sun-icon-mobile');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        if (moonIcon) moonIcon.classList.add('hidden');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIconMobile) moonIconMobile.classList.add('hidden');
        if (sunIconMobile) sunIconMobile.classList.remove('hidden');
    }
    
    // Theme toggle function
    function toggleTheme() {
        if (document.body.classList.contains('dark')) {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            if (moonIcon) moonIcon.classList.remove('hidden');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIconMobile) moonIconMobile.classList.remove('hidden');
            if (sunIconMobile) sunIconMobile.classList.add('hidden');
        } else {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            if (moonIcon) moonIcon.classList.add('hidden');
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIconMobile) moonIconMobile.classList.add('hidden');
            if (sunIconMobile) sunIconMobile.classList.remove('hidden');
        }
    }
    
    // Event listeners
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);
}

function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuButton = document.getElementById('close-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('translate-x-full');
        mobileMenu.classList.toggle('mobile-menu-open');
    }
    
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    if (closeMenuButton) closeMenuButton.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
}

function initializeSmoothScrolling() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just # or external link
            if (href === '#' || href.startsWith('http')) return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeFormValidation() {
    const contactForm = document.querySelector('form[action="/contact"]');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        const inputs = this.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        let firstInvalidInput = null;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef4444';
                isValid = false;
                
                // Add shake animation
                input.classList.add('animate-shake');
                setTimeout(() => {
                    input.classList.remove('animate-shake');
                }, 500);
                
                // Remember first invalid input for focus
                if (!firstInvalidInput) {
                    firstInvalidInput = input;
                }
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            e.preventDefault();
            
            // Focus on first invalid input
            if (firstInvalidInput) {
                firstInvalidInput.focus();
            }
            
            // Show error message
            showNotification('Please fill in all required fields.', 'error');
        }
    });

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });
}

function initializeAnimations() {
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card-hover, .glass-effect, .gradient-text');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    // Initialize scroll animations
    animateOnScroll();
    
    // Re-run animations when theme changes
    document.body.addEventListener('themeChanged', animateOnScroll);
}

function initializeAdditionalFeatures() {
    // Scroll to top button
    createScrollToTopButton();
    
    // Lazy loading for images
    initializeLazyLoading();
    
    // Page load progress bar
    createProgressBar();
}

function createScrollToTopButton() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'fixed bottom-8 right-8 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg opacity-0 transition-all duration-300 hover:bg-indigo-700 z-40 flex items-center justify-center';
    scrollToTopBtn.style.transform = 'translateY(20px)';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(20px)';
        }
    });
}

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 w-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 z-50 transition-all duration-200';
    progressBar.style.height = '2px';
    
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-xl z-50 custom-notification transform transition-all duration-300 ${
        type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 
        type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
        'bg-blue-100 text-blue-700 border border-blue-200'
    }`;
    notification.style.transform = 'translateX(100%)';
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'success' ? 'fa-check-circle' :
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Utility functions
const PortfolioUtils = {
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Copied to clipboard!', 'success');
            return true;
        } catch (err) {
            showNotification('Failed to copy', 'error');
            return false;
        }
    }
};

// Make utils globally available
window.PortfolioUtils = PortfolioUtils;

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioUtils };
}