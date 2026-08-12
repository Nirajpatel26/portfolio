/* =========================================================
   Niraj Patel · Arcade Portfolio — interactions
   No dependencies. Everything degrades without JS.
   ========================================================= */
(() => {
    'use strict';

    const $  = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;

    // Geometry check used as a safety net for content that must never render blank
    // if an IntersectionObserver callback is delayed or dropped.
    const inViewport = (el, frac = 0.9) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight * frac;
    };
    let kickDialogue = null;   // assigned below
    let kickMeters   = null;

    // The boot overlay locks scrolling, so the browser's own scroll restoration can
    // drop you mid-page the moment the lock lifts. Take that over ourselves —
    // but never fight a real deep link (#projects etc).
    const deepLinked = !!location.hash && location.hash.length > 1;
    if ('scrollRestoration' in history && !deepLinked) history.scrollRestoration = 'manual';
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    /* =====================================================
       Tiny blip synth (opt-in, off by default)
       ===================================================== */
    const Sound = {
        on: false,
        ctx: null,
        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
        },
        blip(freq = 660, dur = 0.07, type = 'square', vol = 0.06) {
            if (!this.on) return;
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = type;
            o.frequency.value = freq;
            g.gain.setValueAtTime(vol, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
            o.connect(g).connect(this.ctx.destination);
            o.start();
            o.stop(this.ctx.currentTime + dur);
        },
        coin() { this.blip(988, .07); setTimeout(() => this.blip(1319, .16), 70); },
        jump() { this.blip(523, .09, 'square', .05); },
        hit()  { this.blip(150, .28, 'sawtooth', .07); }
    };

    const soundBtn = $('#btnSound');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            Sound.on = !Sound.on;
            soundBtn.setAttribute('aria-pressed', String(Sound.on));
            if (Sound.on) { Sound.init(); Sound.blip(880, .08); }
        });
    }

    /* =====================================================
       Achievements
       ===================================================== */
    const ACHIEVEMENTS = [
        { id: 'boot',    icon: '▶', name: 'FIRST BOOT',      desc: 'Pressed START' },
        { id: 'quest',   icon: '☑', name: 'QUEST READER',    desc: 'Expanded a quest entry' },
        { id: 'loot',    icon: '◆', name: 'LOOT INSPECTOR',  desc: 'Opened a project on GitHub' },
        { id: 'skills',  icon: '✦', name: 'SKILL SCOUT',     desc: 'Explored 10 skill nodes' },
        { id: 'explore', icon: '▦', name: 'CARTOGRAPHER',    desc: 'Visited every section' },
        { id: 'play',    icon: '❉', name: 'ARCADE PLAYER',   desc: 'Played SHIP IT!' },
        { id: 'score',   icon: '★', name: 'SHIP MASTER',     desc: 'Scored 300+ in SHIP IT!' },
        { id: 'konami',  icon: '☢', name: 'KONAMI CODE',     desc: 'The old ways still work', secret: true }
    ];
    const STORE_KEY = 'np_arcade_achievements';

    let unlocked = new Set();
    try { unlocked = new Set(JSON.parse(localStorage.getItem(STORE_KEY) || '[]')); } catch (_) {}

    const achGrid   = $('#achGrid');
    const coinCount = $('#coinCount');
    const achHead   = $('#achHeadCount');
    const coinWrap  = $('.hud-coins');
    const toastHost = $('#toasts');

    function renderAchievements() {
        if (!achGrid) return;
        achGrid.innerHTML = ACHIEVEMENTS.map(a => {
            const got = unlocked.has(a.id);
            const hide = a.secret && !got;
            const name = hide ? '???' : a.name;
            const desc = hide ? 'Hidden achievement' : a.desc;
            return `<div class="ach ${got ? 'got' : ''}">
                        <span class="ach-ico">${got ? a.icon : '❑'}</span>
                        <span class="ach-txt">
                            <span class="ach-name">${name}</span>
                            <span class="ach-desc">${desc}</span>
                        </span>
                    </div>`;
        }).join('');
        const n = unlocked.size;
        if (coinCount) coinCount.textContent = n;
        if (achHead)   achHead.textContent = `${n} / ${ACHIEVEMENTS.length}`;
    }

    function toast(a) {
        if (!toastHost) return;
        const el = document.createElement('div');
        el.className = 'toast';
        el.innerHTML = `<span class="toast-ico">${a.icon}</span>
                        <span class="toast-body">
                            <span class="toast-kicker">ACHIEVEMENT UNLOCKED</span>
                            <span class="toast-name">${a.name}</span>
                        </span>`;
        toastHost.appendChild(el);
        setTimeout(() => {
            el.classList.add('out');
            setTimeout(() => el.remove(), 400);
        }, 3600);
    }

    function unlock(id) {
        if (unlocked.has(id)) return;
        const a = ACHIEVEMENTS.find(x => x.id === id);
        if (!a) return;
        unlocked.add(id);
        try { localStorage.setItem(STORE_KEY, JSON.stringify([...unlocked])); } catch (_) {}
        renderAchievements();
        toast(a);
        Sound.coin();
        if (coinWrap) {
            coinWrap.classList.remove('pop');
            void coinWrap.offsetWidth;
            coinWrap.classList.add('pop');
        }
    }

    renderAchievements();

    /* =====================================================
       Boot screen
       ===================================================== */
    const boot     = $('#boot');
    const bootLog  = $('#bootLog');
    const bootPress= $('#bootPress');
    const BOOT_SEEN = 'np_arcade_booted';

    const LOG_LINES = [
        'BOOT  · loading player data ......... OK',
        'MOUNT · /dev/aws /dev/azure /dev/oci  OK',
        'INIT  · terraform state ............. OK',
        'SPAWN · agents x4 ................... OK',
        'READY · 11 items in inventory'
    ];

    function endBoot() {
        if (!boot || boot.classList.contains('leaving')) return;
        boot.classList.add('leaving');
        html.classList.remove('booting');
        if (!deepLinked) toTop();   // START always lands on the hero
        try { sessionStorage.setItem(BOOT_SEEN, '1'); } catch (_) {}
        setTimeout(() => { boot.remove(); }, 600);
        unlock('boot');
        startReveals();
    }

    let bootAlreadySeen = false;
    try { bootAlreadySeen = sessionStorage.getItem(BOOT_SEEN) === '1'; } catch (_) {}

    if (boot && !bootAlreadySeen) {
        boot.classList.add('armed');
        boot.removeAttribute('aria-hidden');
        html.classList.add('booting');
        if (!deepLinked) toTop();

        if (REDUCED) {
            if (bootLog) bootLog.textContent = LOG_LINES.join('\n');
            if (bootPress) bootPress.classList.add('show');
        } else {
            let li = 0, ci = 0, text = '';
            const typeTick = () => {
                if (li >= LOG_LINES.length) {
                    if (bootPress) bootPress.classList.add('show');
                    return;
                }
                const line = LOG_LINES[li];
                if (ci < line.length) {
                    text += line[ci++];
                    if (bootLog) bootLog.textContent = text;
                    setTimeout(typeTick, 9);
                } else {
                    text += '\n'; li++; ci = 0;
                    if (bootLog) bootLog.textContent = text;
                    setTimeout(typeTick, 120);
                }
            };
            setTimeout(typeTick, 350);
        }

        $('#btnStart')?.addEventListener('click', endBoot);
        $('#btnSkip')?.addEventListener('click', endBoot);
        document.addEventListener('keydown', function bootKeys(e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                e.preventDefault();
                document.removeEventListener('keydown', bootKeys);
                endBoot();
            }
        });
    } else if (boot) {
        boot.remove();
    }

    /* =====================================================
       HUD: progress, active tab, mobile menu
       ===================================================== */
    const hudProgress = $('#hudProgress');
    const hudTabs     = $$('.hud-tab');
    const sections    = $$('main section[id]');
    const xpFill      = $('#xpFill');

    function onScroll() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (hudProgress) hudProgress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

        let currentId = '';
        const probe = y + window.innerHeight * 0.32;
        sections.forEach(s => {
            if (probe >= s.offsetTop && probe < s.offsetTop + s.offsetHeight) currentId = s.id;
        });
        hudTabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === '#' + currentId));
        if (currentId) markVisited(currentId);

        if (kickDialogue) kickDialogue();
        if (kickMeters)   kickMeters();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // XP bar fill (3.89 / 4.00)
    setTimeout(() => { if (xpFill) xpFill.style.width = (3.89 / 4 * 100) + '%'; }, 700);

    // mobile menu
    const burger = $('#btnBurger');
    const nav    = $('#hudNav');
    if (burger && nav) {
        const setMenu = open => {
            nav.classList.toggle('open', open);
            burger.setAttribute('aria-expanded', String(open));
        };
        burger.addEventListener('click', () => setMenu(nav.classList.contains('open') ? false : true));
        nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
        document.addEventListener('click', e => {
            if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) setMenu(false);
        });
    }

    /* =====================================================
       "Cartographer" — visited every section
       ===================================================== */
    const visited = new Set();
    const TRACKED = ['home', 'player', 'quests', 'inventory', 'skills', 'trophies', 'arcade', 'contact'];
    function markVisited(id) {
        if (!TRACKED.includes(id) || visited.has(id)) return;
        visited.add(id);
        if (visited.size === TRACKED.length) unlock('explore');
    }

    /* =====================================================
       Reveal on scroll
       ===================================================== */
    let revealObserver = null;
    function startReveals() {
        const targets = $$('.sec-head, .panel, .quest, .item, .branch, .stat-box, .pickup, .cab, .contact-h, .contact-p, .sec-sub');
        if (REDUCED || !('IntersectionObserver' in window)) {
            targets.forEach(t => t.classList.add('seen'));
            return;
        }
        targets.forEach(t => t.classList.add('reveal'));
        revealObserver = new IntersectionObserver(entries => {
            entries.forEach((entry, i) => {
                if (!entry.isIntersecting) return;
                setTimeout(() => entry.target.classList.add('seen'), Math.min(i * 45, 260));
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        targets.forEach(t => revealObserver.observe(t));
    }
    if (!boot || bootAlreadySeen) startReveals();

    /* =====================================================
       Role rotator
       ===================================================== */
    const ROLES = [
        'DATA PLATFORM ENGINEER',
        'CLOUD / DEVOPS ENGINEER',
        'AGENTIC AI BUILDER',
        'INFRA AUTOMATION NERD'
    ];
    const roleEl = $('#roleRotator');
    if (roleEl && !REDUCED) {
        let ri = 0;
        setInterval(() => {
            roleEl.style.opacity = '0';
            roleEl.style.transform = 'translateY(-6px)';
            setTimeout(() => {
                ri = (ri + 1) % ROLES.length;
                roleEl.textContent = ROLES[ri];
                roleEl.style.opacity = '1';
                roleEl.style.transform = 'none';
            }, 260);
        }, 2800);
    }

    /* =====================================================
       Stat counters
       ===================================================== */
    const counters = $$('[data-count]');
    if (counters.length && 'IntersectionObserver' in window && !REDUCED) {
        const co = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const dec = parseInt(el.dataset.dec || '0', 10);
                const suffix = el.dataset.suffix || '';
                const dur = 1100, t0 = performance.now();
                const tick = now => {
                    const p = Math.min(1, (now - t0) / dur);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = (target * eased).toFixed(dec) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                    else el.textContent = target.toFixed(dec) + suffix;
                };
                requestAnimationFrame(tick);
                co.unobserve(el);
            });
        }, { threshold: 0.6 });
        counters.forEach(c => co.observe(c));
    }

    /* =====================================================
       Meters (attributes + quest progress)
       ===================================================== */
    const meters = $$('.meter');
    if (meters.length) {
        const fill = el => {
            const bar = el.querySelector('i');
            if (bar) bar.style.width = (el.dataset.fill || 0) + '%';
        };
        // safety net: an on-screen bar must never sit at zero
        kickMeters = () => {
            meters.forEach(m => {
                const bar = m.querySelector('i');
                if (bar && !bar.style.width && inViewport(m)) fill(m);
            });
        };
        if ('IntersectionObserver' in window) {
            const mo = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (!e.isIntersecting) return;
                    fill(e.target);
                    mo.unobserve(e.target);
                });
            }, { threshold: 0.4 });
            meters.forEach(m => mo.observe(m));
        } else {
            meters.forEach(fill);
        }
    }

    /* =====================================================
       Dialogue box (About)
       ===================================================== */
    const dlgBody  = $('#dlgBody');
    const dlgNext  = $('#dlgNext');
    const dlgSkip  = $('#dlgSkip');
    const dlgCount = $('#dlgCount');
    const dlgTpl   = $('#dlgLines');

    if (dlgBody && dlgTpl) {
        const lines = [...dlgTpl.content.querySelectorAll('p')].map(p => p.innerHTML);
        let shown = 0;      // paragraphs fully rendered
        let typing = false;
        let typeTimer = null;

        const updateCount = () => {
            if (dlgCount) dlgCount.textContent = `${Math.max(1, shown)} / ${lines.length}`;
            if (dlgNext) dlgNext.disabled = shown >= lines.length && !typing;
        };

        function typeLine(i, done) {
            const p = document.createElement('p');
            dlgBody.appendChild(p);
            const src = lines[i];
            if (REDUCED) { p.innerHTML = src; done(); return; }

            typing = true;
            // Type visible characters while keeping inline HTML intact:
            // walk the source string, emitting tags instantly.
            let idx = 0, out = '';
            const step = () => {
                if (idx >= src.length) {
                    p.innerHTML = out;
                    typing = false;
                    done();
                    return;
                }
                if (src[idx] === '<') {
                    const close = src.indexOf('>', idx);
                    out += src.slice(idx, close + 1);
                    idx = close + 1;
                    typeTimer = setTimeout(step, 0);
                    return;
                }
                out += src[idx++];
                p.innerHTML = out + '<span class="dlg-caret"></span>';
                typeTimer = setTimeout(step, 12);
            };
            step();
        }

        function advance() {
            if (typing) { // fast-forward current line
                clearTimeout(typeTimer);
                typing = false;
                dlgBody.lastElementChild.innerHTML = lines[shown];
                shown++;
                updateCount();
                return;
            }
            if (shown >= lines.length) return;
            const i = shown;
            typeLine(i, () => { shown = i + 1; updateCount(); });
            Sound.blip(740, .04, 'square', .03);
        }

        function showAll() {
            clearTimeout(typeTimer);
            typing = false;
            dlgBody.innerHTML = lines.map(l => `<p>${l}</p>`).join('');
            shown = lines.length;
            updateCount();
        }

        dlgNext?.addEventListener('click', advance);
        dlgSkip?.addEventListener('click', showAll);

        // kick off when scrolled into view
        const dlgEl = $('#dialogue');
        let started = false;
        const startDlg = () => { if (!started) { started = true; advance(); } };

        // safety net — the bio is the most important copy on the page, so it must
        // never depend solely on an observer callback arriving.
        kickDialogue = () => { if (!started && inViewport(dlgEl)) startDlg(); };

        if ('IntersectionObserver' in window) {
            const dio = new IntersectionObserver(es => {
                es.forEach(e => { if (e.isIntersecting) { startDlg(); dio.disconnect(); } });
            }, { threshold: 0.35 });
            dio.observe(dlgEl);
            // last resort: if it's been on screen a while and nothing typed, print it all
            setTimeout(() => { if (!started && inViewport(dlgEl, 1.2)) showAll(); }, 5000);
        } else {
            showAll();
        }
        updateCount();
    }

    /* =====================================================
       Inventory filter
       ===================================================== */
    const invTabs = $$('.inv-tab');
    const items   = $$('.item');
    const invEmpty= $('#invEmpty');

    invTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const f = tab.dataset.filter;
            invTabs.forEach(t => t.classList.toggle('active', t === tab));
            let visible = 0;
            items.forEach(item => {
                const tags = (item.dataset.tags || '').split(/\s+/);
                const show = f === 'all' || tags.includes(f);
                item.classList.toggle('hide', !show);
                item.classList.remove('in');
                if (show) {
                    visible++;
                    void item.offsetWidth;
                    item.classList.add('in');
                }
            });
            if (invEmpty) invEmpty.hidden = visible !== 0;
            Sound.blip(560, .05);
        });
    });

    // loot achievement
    $$('.item-link').forEach(a => a.addEventListener('click', () => unlock('loot')));

    /* =====================================================
       Skill tree pips + scout achievement
       ===================================================== */
    const nodes = $$('.node');
    nodes.forEach(node => {
        const n = parseInt(node.dataset.pips || '0', 10);
        const pips = document.createElement('span');
        pips.className = 'pips';
        pips.setAttribute('aria-label', `${n} of 5`);
        for (let i = 0; i < 5; i++) {
            const pip = document.createElement('i');
            if (i < n) pip.className = 'on';
            pips.appendChild(pip);
        }
        node.appendChild(pips);
    });

    const touchedNodes = new Set();
    nodes.forEach(node => {
        const touch = () => {
            if (touchedNodes.has(node)) return;
            touchedNodes.add(node);
            Sound.blip(880 + touchedNodes.size * 25, .03, 'square', .025);
            if (touchedNodes.size >= 10) unlock('skills');
        };
        node.addEventListener('mouseenter', touch);
        node.addEventListener('touchstart', touch, { passive: true });
    });

    /* =====================================================
       Quest accordion
       ===================================================== */
    $$('.quest-head').forEach(head => {
        head.addEventListener('click', () => {
            const quest = head.closest('.quest');
            const open = quest.classList.toggle('open');
            head.setAttribute('aria-expanded', String(open));
            if (open) { unlock('quest'); Sound.blip(620, .06); }
        });
    });

    /* =====================================================
       Konami code
       ===================================================== */
    const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let seqPos = 0;
    document.addEventListener('keydown', e => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (key === SEQ[seqPos]) {
            seqPos++;
            if (seqPos === SEQ.length) {
                seqPos = 0;
                html.classList.toggle('party');
                unlock('konami');
                Sound.blip(1046, .1); setTimeout(() => Sound.blip(1318, .1), 90); setTimeout(() => Sound.blip(1568, .2), 180);
            }
        } else {
            seqPos = (key === SEQ[0]) ? 1 : 0;
        }
    });

    /* =====================================================
       SHIP IT! — one-button endless runner
       ===================================================== */
    const canvas = $('#game');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const GROUND = H - 46;

        const overlay = $('#gOverlay');
        const gTitle  = $('#gTitle');
        const gMsg    = $('#gMsg');
        const gBtn    = $('#gBtn');
        const scoreEl = $('#gScore');
        const bestEl  = $('#gBest');
        const BEST_KEY = 'np_shipit_best';

        let best = 0;
        try { best = parseInt(localStorage.getItem(BEST_KEY) || '0', 10) || 0; } catch (_) {}

        const pad = n => String(Math.floor(n)).padStart(4, '0');
        bestEl.textContent = pad(best);

        const STATE = { IDLE: 0, RUNNING: 1, OVER: 2, PAUSED: 3 };
        let state = STATE.IDLE;

        const player = { x: 90, y: GROUND, vy: 0, w: 26, h: 30, onGround: true };
        const GRAV = 2100, JUMP = -720;

        let obstacles = [], clouds = [], particles = [];
        let speed = 330, score = 0, spawnIn = 0.9, elapsed = 0, last = 0, raf = 0;

        function reset() {
            player.y = GROUND; player.vy = 0; player.onGround = true;
            obstacles = []; particles = [];
            speed = 330; score = 0; spawnIn = 0.9; elapsed = 0;
            clouds = Array.from({ length: 5 }, (_, i) => ({
                x: (i / 5) * W + Math.random() * 90,
                y: 26 + Math.random() * 90,
                s: 0.18 + Math.random() * 0.22,
                w: 34 + Math.random() * 46
            }));
        }

        function jump() {
            if (state === STATE.IDLE) { start(); return; }
            if (state === STATE.OVER) { start(); return; }
            if (state !== STATE.RUNNING) return;
            if (player.onGround) {
                player.vy = JUMP;
                player.onGround = false;
                Sound.jump();
            }
        }

        function start() {
            reset();
            state = STATE.RUNNING;
            overlay.classList.add('hide');
            last = performance.now();
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(loop);
            unlock('play');
        }

        function gameOver() {
            state = STATE.OVER;
            Sound.hit();
            for (let i = 0; i < 16; i++) {
                particles.push({
                    x: player.x + player.w / 2, y: player.y - player.h / 2,
                    vx: (Math.random() - .5) * 320, vy: (Math.random() - .8) * 320,
                    life: .6 + Math.random() * .4
                });
            }
            const beatIt = score > best && best > 0;   // first run isn't a "record"
            if (score > best) {
                best = Math.floor(score);
                try { localStorage.setItem(BEST_KEY, String(best)); } catch (_) {}
                bestEl.textContent = pad(best);
            }
            gTitle.textContent = beatIt ? 'NEW RECORD!' : 'INCIDENT!';
            if (score >= 300) unlock('score');
            gMsg.innerHTML = `SCORE ${pad(score)} &nbsp;·&nbsp; HI ${pad(best)}`;
            gBtn.textContent = 'RETRY';
            overlay.classList.remove('hide');
        }

        function spawn() {
            const tall = Math.random() < 0.28;
            obstacles.push({
                x: W + 20,
                w: tall ? 20 : 26,
                h: tall ? 54 : 30,
                tall
            });
        }

        function update(dt) {
            elapsed += dt;
            score += dt * 42;
            scoreEl.textContent = pad(score);
            speed = 330 + Math.min(320, elapsed * 13);

            // player physics
            player.vy += GRAV * dt;
            player.y += player.vy * dt;
            if (player.y >= GROUND) { player.y = GROUND; player.vy = 0; player.onGround = true; }

            // obstacles
            spawnIn -= dt;
            if (spawnIn <= 0) {
                spawn();
                // Air time is 2*|JUMP|/GRAV ≈ 0.69s, so never spawn closer together
                // than that plus a buffer — otherwise pairs become unclearable at speed.
                const gapBase = Math.max(0.85, 1.15 - elapsed * 0.010);
                spawnIn = gapBase + Math.random() * 0.6;
            }
            obstacles.forEach(o => { o.x -= speed * dt; });
            obstacles = obstacles.filter(o => o.x + o.w > -30);

            // clouds
            clouds.forEach(c => {
                c.x -= speed * c.s * dt;
                if (c.x + c.w < 0) { c.x = W + Math.random() * 60; c.y = 26 + Math.random() * 90; }
            });

            // collision (a little forgiving)
            const px = player.x + 4, pw = player.w - 8;
            const py = player.y - player.h + 3, ph = player.h - 4;
            for (const o of obstacles) {
                const oy = GROUND - o.h;
                if (px < o.x + o.w && px + pw > o.x && py < oy + o.h && py + ph > oy) {
                    gameOver();
                    return;
                }
            }
        }

        function updateParticles(dt) {
            particles.forEach(p => {
                p.vy += 1400 * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= dt;
            });
            particles = particles.filter(p => p.life > 0);
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);

            // sky glow
            const grd = ctx.createLinearGradient(0, 0, 0, H);
            grd.addColorStop(0, '#1a0d33');
            grd.addColorStop(.65, '#120926');
            grd.addColorStop(1, '#0d0620');
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, W, H);

            // clouds (pixel blocks)
            ctx.fillStyle = 'rgba(168,85,247,.22)';
            clouds.forEach(c => {
                ctx.fillRect(Math.round(c.x), Math.round(c.y), Math.round(c.w), 6);
                ctx.fillRect(Math.round(c.x + 8), Math.round(c.y - 6), Math.round(c.w - 20), 6);
            });

            // ground line + dashes
            ctx.fillStyle = '#2c1d47';
            ctx.fillRect(0, GROUND + 2, W, 2);
            ctx.fillStyle = 'rgba(255,160,49,.35)';
            const off = (elapsed * speed) % 40;
            for (let x = -off; x < W; x += 40) ctx.fillRect(Math.round(x), GROUND + 10, 16, 2);

            // obstacles = bugs / outages
            obstacles.forEach(o => {
                const y = GROUND - o.h;
                ctx.fillStyle = o.tall ? '#f4436b' : '#d946ef';
                ctx.fillRect(Math.round(o.x), Math.round(y), o.w, o.h);
                ctx.fillStyle = 'rgba(0,0,0,.35)';
                ctx.fillRect(Math.round(o.x), Math.round(y), o.w, 3);
                // eyes for the small bugs
                if (!o.tall) {
                    ctx.fillStyle = '#0d0620';
                    ctx.fillRect(Math.round(o.x) + 5, Math.round(y) + 9, 4, 4);
                    ctx.fillRect(Math.round(o.x) + 16, Math.round(y) + 9, 4, 4);
                }
            });

            // player = a little deploy crate
            const py = Math.round(player.y - player.h);
            const px = Math.round(player.x);
            ctx.fillStyle = '#ffa031';
            ctx.fillRect(px, py, player.w, player.h);
            ctx.fillStyle = '#ffc46b';
            ctx.fillRect(px, py, player.w, 5);
            ctx.fillStyle = '#2a1102';
            ctx.fillRect(px + 4, py + 11, player.w - 8, 3);
            ctx.fillRect(px + 4, py + 18, player.w - 8, 3);
            // thruster when airborne
            if (!player.onGround) {
                ctx.fillStyle = 'rgba(34,211,238,.8)';
                ctx.fillRect(px + 6, py + player.h, 5, 7);
                ctx.fillRect(px + player.w - 11, py + player.h, 5, 7);
            }

            // particles
            particles.forEach(p => {
                ctx.fillStyle = `rgba(255,160,49,${Math.max(0, p.life)})`;
                ctx.fillRect(Math.round(p.x), Math.round(p.y), 4, 4);
            });

            // paused label
            if (state === STATE.PAUSED) {
                ctx.fillStyle = 'rgba(8,4,16,.7)';
                ctx.fillRect(0, 0, W, H);
                ctx.fillStyle = '#ffa031';
                ctx.font = '16px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText('PAUSED — press P', W / 2, H / 2);
                ctx.textAlign = 'left';
            }
        }

        function loop(now) {
            const dt = Math.min(0.033, (now - last) / 1000);
            last = now;
            if (state === STATE.RUNNING) update(dt);
            updateParticles(dt);
            draw();
            if (state === STATE.RUNNING || state === STATE.PAUSED || particles.length) {
                raf = requestAnimationFrame(loop);
            }
        }

        // initial paint
        reset();
        draw();

        gBtn.addEventListener('click', start);
        canvas.addEventListener('pointerdown', e => { e.preventDefault(); jump(); });

        document.addEventListener('keydown', e => {
            const inView = canvas.getBoundingClientRect().top < window.innerHeight * 0.8 &&
                           canvas.getBoundingClientRect().bottom > 0;
            if (!inView) return;
            if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
                if (state === STATE.PAUSED) return;
                e.preventDefault();
                jump();
            } else if (e.key === 'p' || e.key === 'P') {
                if (state === STATE.RUNNING) {
                    state = STATE.PAUSED;
                    draw();
                } else if (state === STATE.PAUSED) {
                    state = STATE.RUNNING;
                    last = performance.now();
                    raf = requestAnimationFrame(loop);
                }
            }
        });

        // pause when scrolled away (saves CPU)
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (!e.isIntersecting && state === STATE.RUNNING) {
                        state = STATE.PAUSED;
                        draw();
                    }
                });
            }, { threshold: 0.15 }).observe(canvas);
        }

        $('#gReset')?.addEventListener('click', () => {
            best = 0;
            try { localStorage.removeItem(BEST_KEY); } catch (_) {}
            bestEl.textContent = pad(0);
        });
    }

    /* =====================================================
       Init
       ===================================================== */
    onScroll();
    console.log('%c<NP/> ARCADE ONLINE — try the konami code.', 'color:#ffa031;font-family:monospace;font-weight:700');
})();
