/* ═══════════════════════════════════════════════════════════
   ETTISAI — Core JavaScript
   Animations, Interactions, Dynamic Effects
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Console Branding ──
    console.log(
        '%c ⬡ ETTISAI SYSTEM ACTIVE ',
        'background: #c9a84c; color: #05070a; padding: 8px 16px; font-family: monospace; font-weight: bold; font-size: 14px;'
    );
    console.log(
        '%c Capabilities: C-OPS | B-INT | C-ENG',
        'color: #8a8f98; font-family: monospace;'
    );

    // ════════════════════════════════════════════
    // 1. NOISE GRAIN EFFECT
    // ════════════════════════════════════════════
    const noiseCanvas = document.getElementById('noise-canvas');
    if (noiseCanvas) {
        const ctx = noiseCanvas.getContext('2d');
        const resize = () => {
            noiseCanvas.width = window.innerWidth;
            noiseCanvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let noiseFrame;
        const renderNoise = () => {
            const w = noiseCanvas.width;
            const h = noiseCanvas.height;
            const idata = ctx.createImageData(w, h);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const len = buffer32.length;

            // Dense white dots — old TV static
            for (let i = 0; i < len; i++) {
                if (Math.random() < 0.15) {
                    const brightness = Math.floor(Math.random() * 255);
                    buffer32[i] = (255 << 24) | (brightness << 16) | (brightness << 8) | brightness;
                }
            }

            // Horizontal scanlines
            for (let y = 0; y < h; y += 3) {
                const rowStart = y * w;
                for (let x = 0; x < w; x++) {
                    const idx = rowStart + x;
                    if (idx < len) {
                        const existing = buffer32[idx];
                        if (existing) {
                            // Dim every 3rd row for scanline effect
                            buffer32[idx] = (255 << 24) | (40 << 16) | (40 << 8) | 40;
                        }
                    }
                }
            }

            ctx.putImageData(idata, 0, 0);
            noiseFrame = requestAnimationFrame(renderNoise);
        };
        renderNoise();

        // Pause noise when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(noiseFrame);
            } else {
                renderNoise();
            }
        });
    }

    // ════════════════════════════════════════════
    // 2. SCROLL REVEAL ANIMATIONS
    // ════════════════════════════════════════════
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ════════════════════════════════════════════
    // 3. ANIMATED COUNTERS
    // ════════════════════════════════════════════
    const counterElements = document.querySelectorAll('[data-count]');

    const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-count'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
        const duration = 2000;
        const startTime = performance.now();

        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = easedProgress * target;

            if (decimals > 0) {
                el.textContent = prefix + current.toFixed(decimals) + suffix;
            } else {
                el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    // ════════════════════════════════════════════
    // 4. TYPEWRITER EFFECT
    // ════════════════════════════════════════════
    const typewriterEl = document.querySelector('.typewriter');
    if (typewriterEl) {
        const text = typewriterEl.getAttribute('data-text');
        typewriterEl.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        typewriterEl.after(cursor);

        let i = 0;
        const typeSpeed = 50;

        const typeChar = () => {
            if (i < text.length) {
                typewriterEl.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, typeSpeed);
            } else {
                // Keep cursor blinking for a bit then remove
                setTimeout(() => {
                    cursor.style.opacity = '0';
                    cursor.style.transition = 'opacity 0.5s';
                }, 2000);
            }
        };

        // Start typing when the element is in view
        const typeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeChar, 500);
                    typeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        typeObserver.observe(typewriterEl);
    }

    // ════════════════════════════════════════════
    // 5. HEADER SCROLL BEHAVIOR
    // ════════════════════════════════════════════
    const header = document.querySelector('.site-header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ════════════════════════════════════════════
    // 6. MOBILE NAV TOGGLE
    // ════════════════════════════════════════════
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ════════════════════════════════════════════
    // 7. ACTIVE NAV HIGHLIGHTING
    // ════════════════════════════════════════════
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ════════════════════════════════════════════
    // 8. COMPARISON TABLE ROW ANIMATION
    // ════════════════════════════════════════════
    const tableRows = document.querySelectorAll('.comparison-table tbody tr');
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    });

    const tableObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rows = entry.target.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    row.style.opacity = '1';
                    row.style.transform = 'translateX(0)';
                });
                tableObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const tables = document.querySelectorAll('.comparison-table');
    tables.forEach(table => tableObserver.observe(table));

    // ════════════════════════════════════════════
    // 9. PARALLAX SUBTLE EFFECT
    // ════════════════════════════════════════════
    const parallaxEls = document.querySelectorAll('.parallax');
    if (parallaxEls.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed') || 0.1);
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }, { passive: true });
    }

    // ════════════════════════════════════════════
    // 10. CONTACT FORM HANDLING
    // ════════════════════════════════════════════
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            // Simple validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let valid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#c85050';
                    field.addEventListener('input', function handler() {
                        field.style.borderColor = '';
                        field.removeEventListener('input', handler);
                    });
                }
            });

            if (!valid) return;

            // Simulate encrypted transmission
            btn.textContent = 'ENCRYPTING...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.textContent = 'TRANSMITTED ✓';
                btn.style.background = '#2a7a3a';
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // ════════════════════════════════════════════
    // 11. SMOOTH SCROLL FOR ANCHOR LINKS
    // ════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ════════════════════════════════════════════
    // 12. GLITCH TEXT PERIODIC EFFECT
    // ════════════════════════════════════════════
    const glitchEls = document.querySelectorAll('.glitch');
    if (glitchEls.length > 0) {
        setInterval(() => {
            const randomEl = glitchEls[Math.floor(Math.random() * glitchEls.length)];
            randomEl.style.animation = 'none';
            void randomEl.offsetHeight; // Trigger reflow
            randomEl.style.animation = 'glitchText 0.3s ease';
        }, 5000);
    }
    // ════════════════════════════════════════════
    // 13. COPY TO CLIPBOARD (Payment Page)
    // ════════════════════════════════════════════
    const copyBtns = document.querySelectorAll('.copy-btn[data-copy]');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // ════════════════════════════════════════════
    // 14. NAV DROPDOWN — prevent jump on Services link
    // ════════════════════════════════════════════
    document.querySelectorAll('.nav-dropdown > a[href="#"]').forEach(link => {
        link.addEventListener('click', e => e.preventDefault());
    });

});
