/* ============================================================
   COGNIFYZ LEVEL 1 INTERNSHIP PROJECT — JAVASCRIPT
   All interactive functionality for the project
   ============================================================ */

/* ======================== GREETING ALERT (Task 5) ======================== */
(function initGreeting() {
    const hour = new Date().getHours();
    let greeting, icon;

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning!";
        icon = "☀️";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon!";
        icon = "🌤️";
    } else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening!";
        icon = "🌆";
    } else {
        greeting = "Good Night!";
        icon = "🌙";
    }

    document.getElementById("greeting-text").textContent = greeting;
    document.getElementById("greeting-icon").textContent = icon;
})();

/**
 * Dismiss the greeting overlay with a smooth animation.
 */
function dismissGreeting() {
    const overlay = document.getElementById("greeting-overlay");
    overlay.classList.add("hidden");
    setTimeout(() => { overlay.style.display = "none"; }, 700);
}

/* ======================== TYPING TEXT EFFECT ======================== */
(function initTypingEffect() {
    const words = [
        "HTML5.",
        "CSS3.",
        "JavaScript.",
        "Modern Design.",
        "Glassmorphism.",
        "Smooth Animations."
    ];
    const el = document.getElementById("typing-text");
    if (!el) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed  = 95;
    const deleteSpeed = 45;
    const pauseTime  = 2000;

    function type() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
            el.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, pauseTime);
                return;
            }
            setTimeout(type, typeSpeed);
        } else {
            el.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(type, deleteSpeed);
        }
    }

    setTimeout(type, 900);
})();

/* ======================== DARK/LIGHT MODE TOGGLE ======================== */
(function initTheme() {
    const toggle = document.getElementById("theme-toggle");
    const html   = document.documentElement;

    const saved = localStorage.getItem("theme");
    if (saved) {
        html.setAttribute("data-theme", saved);
    }

    toggle.addEventListener("click", () => {
        const current = html.getAttribute("data-theme");
        const next    = current === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });
})();

/* ======================== HAMBURGER MENU ======================== */
(function initHamburger() {
    const hamburger = document.getElementById("hamburger");
    const navLinks  = document.getElementById("nav-links");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("open");
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove("active");
            navLinks.classList.remove("open");
        }
    });
})();

/* ======================== ACTIVE NAV LINK ON SCROLL ======================== */
(function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    function highlightNav() {
        const scrollY = window.scrollY + 130;

        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.getAttribute("id");

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("data-section") === id) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", highlightNav, { passive: true });
})();

/* ======================== NAVBAR SCROLL EFFECT ======================== */
(function initNavbarScroll() {
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 60);
    }, { passive: true });
})();

/* ======================== SCROLL PROGRESS BAR ======================== */
(function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    window.addEventListener("scroll", () => {
        const total   = document.documentElement.scrollHeight - window.innerHeight;
        const current = window.scrollY;
        const pct     = total > 0 ? (current / total) * 100 : 0;
        bar.style.width = pct + "%";
    }, { passive: true });
})();

/* ======================== SCROLL REVEAL ANIMATIONS ======================== */
(function initScrollReveal() {
    const revealClasses = [".reveal", ".reveal-right", ".reveal-left", ".reveal-scale"];
    const allReveals = document.querySelectorAll(revealClasses.join(","));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    allReveals.forEach(el => observer.observe(el));
})();

/* ======================== STAT COUNTER ANIMATION ======================== */
(function initStatCounters() {
    const stats = document.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el     = entry.target;
                const target = parseInt(el.getAttribute("data-count"), 10);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));

    function animateCounter(el, target) {
        let current  = 0;
        const duration = 1600;
        const stepTime = Math.max(Math.floor(duration / target), 16);

        const timer = setInterval(() => {
            current++;
            el.textContent = current;
            if (current >= target) {
                clearInterval(timer);
                el.textContent = target;
            }
        }, stepTime);
    }
})();

/* ======================== SKILL BAR ANIMATIONS ======================== */
(function initSkillBars() {
    const bars = document.querySelectorAll(".skill-bar-fill");
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar   = entry.target;
                const width = bar.getAttribute("data-width");
                // Small delay for stagger feel
                setTimeout(() => {
                    bar.style.width = width + "%";
                }, 150);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
})();

/* ======================== COLOR CHANGER (Task 4) ======================== */
/**
 * Generate a random vibrant hex color and apply it to the button.
 */
function changeColor() {
    const btn        = document.getElementById("color-changer-btn");
    const hexDisplay = document.getElementById("color-hex");

    const hue        = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 35);
    const lightness  = 42 + Math.floor(Math.random() * 16);

    const color = hslToHex(hue, saturation, lightness);

    btn.style.background  = color;
    btn.style.boxShadow   = `0 8px 36px ${color}66`;
    hexDisplay.textContent = color;

    const luminance = getLuminance(color);
    btn.style.color = luminance > 0.38 ? "#1a1a2e" : "#ffffff";

    // Ripple micro-animation
    btn.style.transform = "scale(0.97)";
    setTimeout(() => { btn.style.transform = "scale(1)"; }, 150);
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k     = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function getLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const toLinear = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/* ======================== MINI CALCULATOR (Task 6) ======================== */
/**
 * Add two numbers and display the result with validation.
 */
function calculateSum() {
    const num1Input = document.getElementById("calc-num1");
    const num2Input = document.getElementById("calc-num2");
    const resultEl  = document.getElementById("calc-result-value");
    const errorEl   = document.getElementById("calc-error");

    const val1 = num1Input.value.trim();
    const val2 = num2Input.value.trim();

    errorEl.textContent = "";
    num1Input.style.borderColor = "";
    num2Input.style.borderColor = "";

    if (val1 === "" || val2 === "") {
        errorEl.textContent = "⚠️ Please enter both numbers.";
        if (val1 === "") num1Input.focus();
        else num2Input.focus();
        return;
    }

    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    if (isNaN(num1) || isNaN(num2)) {
        errorEl.textContent = "⚠️ Please enter valid numeric values.";
        return;
    }

    const sum = num1 + num2;

    // Animate result pop
    resultEl.style.transform = "scale(1.35)";
    resultEl.textContent = Number.isInteger(sum) ? sum : parseFloat(sum.toFixed(4));
    setTimeout(() => { resultEl.style.transform = "scale(1)"; }, 250);
}

// Keyboard shortcuts for calculator
document.addEventListener("DOMContentLoaded", () => {
    const num1 = document.getElementById("calc-num1");
    const num2 = document.getElementById("calc-num2");

    if (num1) {
        num1.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); num2.focus(); }
        });
    }
    if (num2) {
        num2.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); calculateSum(); }
        });
    }
});

/* ======================== CONTACT FORM VALIDATION (Task 3) ======================== */
/**
 * Validates name field, prevents empty submission, shows success message.
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const nameInput  = document.getElementById("contact-name");
    const errorEl    = document.getElementById("name-error");
    const successEl  = document.getElementById("form-success");
    const successName = document.getElementById("success-name");
    const submitBtn  = document.getElementById("contact-submit");

    const name = nameInput.value.trim();

    // Reset
    errorEl.textContent = "";
    nameInput.classList.remove("input-error");
    successEl.classList.remove("show");

    if (name === "") {
        errorEl.textContent = "⚠️ Name cannot be empty.";
        nameInput.classList.add("input-error");
        nameInput.focus();
        return false;
    }

    if (name.length < 2) {
        errorEl.textContent = "⚠️ Name must be at least 2 characters.";
        nameInput.classList.add("input-error");
        nameInput.focus();
        return false;
    }

    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
        errorEl.textContent = "⚠️ Name should only contain letters, spaces, hyphens, or apostrophes.";
        nameInput.classList.add("input-error");
        nameInput.focus();
        return false;
    }

    // Simulate sending
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending…</span>`;

    setTimeout(() => {
        successName.textContent = name;
        successEl.classList.add("show");
        nameInput.value = "";
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message</span>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

        setTimeout(() => successEl.classList.remove("show"), 5500);
    }, 700);

    return false;
}

/* ======================== BACK TO TOP BUTTON ======================== */
(function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 450);
    }, { passive: true });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();

/* ======================== SMOOTH SCROLL FOR ANCHOR LINKS ======================== */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            const href   = anchor.getAttribute("href");
            if (href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
})();

/* ======================== CARD TILT MICRO-INTERACTION ======================== */
(function initCardTilt() {
    const cards = document.querySelectorAll(".glass-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const cx     = rect.width  / 2;
            const cy     = rect.height / 2;
            const tiltX  = ((y - cy) / cy) * 5;
            const tiltY  = -((x - cx) / cx) * 5;

            card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            card.style.transition = "transform 0.1s ease";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.transition = "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)";
        });
    });
})();
