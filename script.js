/* =========================================================
   Niraj Patel · Portfolio Interactions
   ========================================================= */

(() => {
    'use strict';

    // ---------- Smooth scroll ----------
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

    // ---------- Navbar scroll state + scroll progress ----------
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scrollProgress');

    const onScroll = () => {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 40);
        if (progressBar) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            const pct = h > 0 ? (y / h) * 100 : 0;
            progressBar.style.width = pct + '%';
        }
        updateActiveLink();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---------- Active nav link on scroll ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const y = window.scrollY + 120;
        let currentId = '';
        sections.forEach(s => {
            if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) currentId = s.id;
        });
        navLinks.forEach(l => {
            const href = l.getAttribute('href');
            l.classList.toggle('active', href === '#' + currentId);
        });
    }

    // ---------- Mobile menu ----------
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        const toggleMenu = (open) => {
            const willOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('active');
            navMenu.classList.toggle('active', willOpen);
            hamburger.classList.toggle('active', willOpen);
            document.body.style.overflow = willOpen ? 'hidden' : '';
        };
        hamburger.addEventListener('click', e => { e.stopPropagation(); toggleMenu(); });
        navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
        document.addEventListener('click', e => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                toggleMenu(false);
            }
        });
    }

    // ---------- Typing rotation ----------
    const titles = [
        'cloud platforms',
        'agentic AI systems',
        'CI/CD pipelines',
        'data infrastructure',
        'DevOps automation'
    ];
    const typingEl = document.getElementById('typingText');
    let titleIdx = 0;

    function rotateTitle() {
        if (!typingEl) return;
        typingEl.style.opacity = '0';
        typingEl.style.transform = 'translateY(-6px)';
        setTimeout(() => {
            titleIdx = (titleIdx + 1) % titles.length;
            typingEl.textContent = titles[titleIdx];
            typingEl.style.opacity = '1';
            typingEl.style.transform = 'translateY(0)';
        }, 350);
    }
    setInterval(rotateTitle, 2600);

    // ---------- Reveal on scroll ----------
    const revealTargets = document.querySelectorAll(
        '.section-head, .about-text, .info-card, .timeline-item, .project-card, .skill-card, .rec-card, .contact-card, .contact-headline, .contact-description'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 40);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => io.observe(el));

    // ---------- Stat counter ----------
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                statsSection.querySelectorAll('.stat h3').forEach(h => {
                    const target = h.textContent.trim();
                    const num = parseFloat(target);
                    if (isNaN(num)) return;
                    const suffix = target.replace(/[\d.]/g, '');
                    const decimals = (target.split('.')[1] || '').replace(/\D/g, '').length;
                    let cur = 0;
                    const dur = 1200;
                    const start = performance.now();
                    const tick = (t) => {
                        const p = Math.min(1, (t - start) / dur);
                        const eased = 1 - Math.pow(1 - p, 3);
                        cur = num * eased;
                        h.textContent = cur.toFixed(decimals) + suffix;
                        if (p < 1) requestAnimationFrame(tick);
                        else h.textContent = target;
                    };
                    requestAnimationFrame(tick);
                });
                statObs.unobserve(entry.target);
            });
        }, { threshold: 0.5 });
        statObs.observe(statsSection);
    }

    // ---------- Project filter ----------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.toggle('active', b === btn));
            projectCards.forEach(card => {
                const tags = (card.dataset.tags || '').split(/\s+/);
                const show = filter === 'all' || tags.includes(filter);
                card.hidden = !show;
                if (show) {
                    card.style.animation = 'none';
                    void card.offsetWidth;
                    card.style.animation = 'cardIn 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both';
                }
            });
        });
    });

    // ---------- Project card spotlight (mouse-follow glow) ----------
    projectCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mx', '50%');
            card.style.setProperty('--my', '0%');
        });
    });

    // Inject filter-in keyframes
    const styleEl = document.createElement('style');
    styleEl.textContent = `@keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(styleEl);

    // ---------- Subtle parallax on background glows ----------
    const glows = document.querySelectorAll('.bg-glow');
    let pmx = 0, pmy = 0, tmx = 0, tmy = 0;

    window.addEventListener('mousemove', e => {
        tmx = (e.clientX / window.innerWidth - 0.5) * 30;
        tmy = (e.clientY / window.innerHeight - 0.5) * 30;
    }, { passive: true });

    function loop() {
        pmx += (tmx - pmx) * 0.05;
        pmy += (tmy - pmy) * 0.05;
        glows.forEach((g, i) => {
            const f = (i + 1) * 0.5;
            g.style.transform = `translate(${pmx * f}px, ${pmy * f}px)`;
        });
        requestAnimationFrame(loop);
    }
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) loop();

    // ---------- Initial calls ----------
    onScroll();

    console.log('%c<NP/> Portfolio loaded.', 'color:#22d3ee;font-family:monospace;font-weight:600;');
})();
