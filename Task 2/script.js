/* ==============================================
   Cognifyz Technologies - Business Landing Page
   JavaScript Functionality
   
   TABLE OF CONTENTS
   1. DOM Ready & Initialization
   2. Dark Mode Toggle
   3. Navbar Scroll Effects
   4. Smooth Scrolling & Active Nav Links
   5. Scroll-triggered Fade-in Animations
   6. Animated Counters (Statistics)
   7. Contact Form Handling
   8. Newsletter Form
   9. Back-to-Top Button
================================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==============================================
       1. INITIALIZATION
       - Cache DOM elements
       - Set up event listeners
    ============================================== */
    const navbar          = document.getElementById('mainNavbar');
    const backToTopBtn    = document.getElementById('backToTop');
    const contactForm     = document.getElementById('contactForm');
    const newsletterForm  = document.getElementById('newsletterForm');
    const themeToggleDesk = document.getElementById('themeToggleDesktop');
    const themeToggleMob  = document.getElementById('themeToggleMobile');


    /* ==============================================
       2. DARK MODE TOGGLE
       - Persists preference in localStorage
       - Syncs both desktop & mobile buttons
       - Smooth transition between themes
    ============================================== */
    const THEME_KEY = 'cognifyz-theme';

    /**
     * Apply the given theme ('light' or 'dark') to the document
     * and update all toggle button icons.
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem(THEME_KEY, theme);

        // Update icons on both toggle buttons
        const icon = theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill';
        const oldIcon = theme === 'dark' ? 'bi-moon-stars-fill' : 'bi-sun-fill';

        [themeToggleDesk, themeToggleMob].forEach(btn => {
            if (!btn) return;
            const i = btn.querySelector('i');
            if (i) {
                i.classList.remove(oldIcon);
                i.classList.add(icon);
            }
        });
    }

    /**
     * Toggle between light and dark themes.
     */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-bs-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    // Load saved preference (default: light)
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);

    // Attach listeners to both toggle buttons
    if (themeToggleDesk) themeToggleDesk.addEventListener('click', toggleTheme);
    if (themeToggleMob) themeToggleMob.addEventListener('click', toggleTheme);


    /* ==============================================
       3. NAVBAR SCROLL EFFECTS
       - Add 'scrolled' class when user scrolls down
       - Shrinks navbar padding & adds shadow
    ============================================== */
    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Run on load


    /* ==============================================
       4. SMOOTH SCROLLING & ACTIVE NAV LINKS
       - Clicking a nav link scrolls smoothly to the section
       - Highlights the currently visible section's link
       - Closes mobile navbar after click
    ============================================== */
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const navbarCollapse = document.getElementById('navbarContent');

    // Smooth scroll on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }

            // Close mobile nav menu after clicking a link
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    // Highlight active section in navbar on scroll
    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav(); // Run on load


    /* ==============================================
       5. SCROLL-TRIGGERED FADE-IN ANIMATIONS
       - Uses Intersection Observer API
       - Elements with .fade-in become .visible when in view
    ============================================== */
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));


    /* ==============================================
       6. ANIMATED COUNTERS (Statistics Section)
       - Counts up from 0 to data-target value
       - Triggers when the stats section enters viewport
       - Smooth easing animation
    ============================================== */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let countersAnimated = false;

    /**
     * Animate a single counter element from 0 to its target value.
     * @param {HTMLElement} el - The element containing data-target attribute
     * @param {number} duration - Animation duration in milliseconds
     */
    function animateCounter(el, duration = 2000) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    // Observe the stats section
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    statNumbers.forEach((el, index) => {
                        // Stagger each counter's start by 200ms
                        setTimeout(() => animateCounter(el), index * 200);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        statsObserver.observe(statsSection);
    }


    /* ==============================================
       7. CONTACT FORM HANDLING
       - Client-side validation
       - Simulated submission with loading state
       - Success message display
    ============================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic validation
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            const submitBtn = document.getElementById('formSubmitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            const sendIcon = submitBtn.querySelector('.bi-send-fill');

            // Show loading state
            btnText.classList.add('d-none');
            sendIcon.classList.add('d-none');
            btnLoading.classList.remove('d-none');
            submitBtn.disabled = true;

            // Simulate API call (replace with real endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            contactForm.classList.add('d-none');
            document.getElementById('formSuccess').classList.remove('d-none');

            // Reset after 5 seconds
            setTimeout(() => {
                contactForm.reset();
                contactForm.classList.remove('d-none', 'was-validated');
                document.getElementById('formSuccess').classList.add('d-none');

                btnText.classList.remove('d-none');
                sendIcon.classList.remove('d-none');
                btnLoading.classList.add('d-none');
                submitBtn.disabled = false;
            }, 5000);
        });
    }


    /* ==============================================
       8. NEWSLETTER FORM
       - Simple submit handler with feedback
    ============================================== */
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');

            if (emailInput && emailInput.value.trim()) {
                // Visual feedback
                const btn = newsletterForm.querySelector('.btn-newsletter');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-lg"></i>';
                btn.style.background = '#14B8A6';

                setTimeout(() => {
                    emailInput.value = '';
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                }, 2500);
            }
        });
    }


    /* ==============================================
       9. BACK-TO-TOP BUTTON
       - Appears after scrolling down 500px
       - Smoothly scrolls to top on click
    ============================================== */
    function handleBackToTop() {
        if (!backToTopBtn) return;
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleBackToTop, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* ==============================================
       CONSOLE GREETING
    ============================================== */
    console.log(
        '%c🚀 Cognifyz Technologies %c Built with passion ',
        'background: linear-gradient(135deg, #6366F1, #EC4899); color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-weight: 700;',
        'background: #1E293B; color: #94A3B8; padding: 8px 16px; border-radius: 0 4px 4px 0;'
    );
});
