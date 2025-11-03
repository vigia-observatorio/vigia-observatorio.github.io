// ===========================
// Smooth Scrolling
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip empty anchors
        if (!href || href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Active Navigation Highlighting
// ===========================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===========================
// Expand/Collapse Findings
// ===========================
function toggleFinding(button) {
    const card = button.closest('.finding-card');
    const details = card.querySelector('.finding-details');
    const isExpanded = button.classList.contains('expanded');

    if (isExpanded) {
        button.classList.remove('expanded');
        details.classList.remove('expanded');
        button.querySelector('span').textContent = 'Ver más detalles';
    } else {
        button.classList.add('expanded');
        details.classList.add('expanded');
        button.querySelector('span').textContent = 'Ver menos detalles';
    }
}

// ===========================
// Date Navigation
// ===========================
function loadAnalysis(dateString) {
    // Remove active class from all date options
    document.querySelectorAll('.date-option').forEach(option => {
        option.classList.remove('active');
    });

    // Add active class to selected option
    const selectedOption = event.currentTarget;
    selectedOption.classList.add('active');

    // In the future, this would load different analysis data
    // For now, we only have one date (2025-11-03)
    console.log(`Loading analysis for ${dateString}`);

    // Scroll to timeline
    const timeline = document.getElementById('timeline');
    if (timeline) {
        const headerOffset = 100;
        const elementPosition = timeline.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-card, .finding-card, .risk-category-card, .methodology-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// ===========================
// Active Navigation Link
// ===========================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.backgroundColor = '';
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// ===========================
// Stats Counter Animation
// ===========================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const number = entry.target.querySelector('.stat-number');
            const target = parseInt(number.textContent);
            
            // Only animate if it's a number
            if (!isNaN(target) && target < 1000) {
                number.textContent = '0';
                animateCounter(number, target);
                entry.target.dataset.animated = 'true';
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// ===========================
// Keyboard Accessibility
// ===========================
document.addEventListener('keydown', (e) => {
    // Close expanded findings with Escape key
    if (e.key === 'Escape') {
        document.querySelectorAll('.finding-card.expanded').forEach(card => {
            card.classList.remove('expanded');
            const button = card.querySelector('.expand-btn span');
            if (button) {
                button.textContent = 'Ver más detalles';
            }
        });
    }
});

// ===========================
// Copy Link Functionality
// ===========================
function copyLink(findingId) {
    const url = `${window.location.origin}${window.location.pathname}#finding-${findingId}`;
    
    navigator.clipboard.writeText(url).then(() => {
        // Show temporary notification
        const notification = document.createElement('div');
        notification.textContent = '✓ Enlace copiado';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }).catch(err => {
        console.error('Error copying link:', err);
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Search Functionality (Future Enhancement)
// ===========================
function initializeSearch() {
    // Placeholder for future search functionality
    // This would allow users to search through findings
    console.log('Search functionality ready for implementation');
}

// ===========================
// Export/Print Functionality
// ===========================
function printReport() {
    // Expand all findings before printing
    document.querySelectorAll('.finding-card').forEach(card => {
        card.classList.add('expanded');
    });
    
    window.print();
}

// Add keyboard shortcut for printing (Ctrl+P)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printReport();
    }
});

// ===========================
// Responsive Menu Toggle (for mobile)
// ===========================
function createMobileMenuToggle() {
    const nav = document.querySelector('.main-nav');
    const header = document.querySelector('.main-header .container');
    
    // Check if we're on mobile
    if (window.innerWidth <= 768) {
        // Create toggle button if it doesn't exist
        if (!document.querySelector('.menu-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'menu-toggle';
            toggle.innerHTML = '☰';
            toggle.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                display: block;
                margin: 0 auto;
            `;
            
            toggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-open');
            });
            
            header.appendChild(toggle);
            
            // Add mobile styles to nav
            nav.style.cssText = `
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
            `;
        }
        
        // Toggle mobile menu
        if (nav.classList.contains('mobile-open')) {
            nav.style.maxHeight = nav.scrollHeight + 'px';
        } else {
            nav.style.maxHeight = '0';
        }
    }
}

window.addEventListener('resize', createMobileMenuToggle);
window.addEventListener('load', createMobileMenuToggle);

// ===========================
// Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Observatorio de Riesgos de IA - Sistema Inicializado');
    console.log('📊 Análisis cargado exitosamente');
    
    // Add any initialization code here
    initializeSearch();
    createMobileMenuToggle();
    
    // Log statistics
    const findingsCount = document.querySelectorAll('.finding-card').length;
    const risksCount = document.querySelectorAll('.risk-badge').length;
    console.log(`📋 ${findingsCount} hallazgos cargados`);
    console.log(`⚠️ ${risksCount} categorías de riesgo identificadas`);
});

// ===========================
// Performance Monitoring
// ===========================
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
}

// ===========================
// Error Handling
// ===========================
window.addEventListener('error', (e) => {
    console.error('Error en la página:', e.error);
});

// ===========================
// Service Worker Registration (Future Enhancement)
// ===========================
if ('serviceWorker' in navigator) {
    // Uncomment when service worker is implemented
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registrado'))
    //     .catch(err => console.error('Error registrando Service Worker:', err));
}
