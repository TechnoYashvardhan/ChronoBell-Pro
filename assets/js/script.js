/* ══════════════════════════════════════════
       PARTICLE ENGINE
    ══════════════════════════════════════════ */
    const PARTICLE_CONFIG = {
      dark: { type: 'dots', primary: '#5eead4', accent: '#38bdf8', count: 55, opacity: 0.55 },
      light: { type: 'bubbles', primary: '#4f46e5', accent: '#0284c7', count: 40, opacity: 0.35 },
      fire: { type: 'fire', primary: '#fb923c', accent: '#fbbf24', count: 65, opacity: 0.6 },
      earth: { type: 'leaves', primary: '#86efac', accent: '#bef264', count: 50, opacity: 0.5 },
      frost: { type: 'snowflakes', primary: '#7dd3fc', accent: '#a5f3fc', count: 55, opacity: 0.6 },
      water: { type: 'bubbles', primary: '#34d399', accent: '#22d3ee', count: 55, opacity: 0.55 },
      space: { type: 'stars', primary: '#c084fc', accent: '#818cf8', count: 130, opacity: 0.6 },
      neon: { type: 'neon', primary: '#f0abfc', accent: '#67e8f9', count: 50, opacity: 0.55 },
      forest: { type: 'leaves', primary: '#6ee7b7', accent: '#a3e635', count: 55, opacity: 0.5 },
      sunset: { type: 'sparkles', primary: '#fca5a5', accent: '#fdba74', count: 50, opacity: 0.55 },
    };

    class ParticleSystem {
      constructor(theme) {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cfg = PARTICLE_CONFIG[theme] || PARTICLE_CONFIG.dark;
        this.running = true;
        this.particles = [];
        this._resize = () => this.resize();
        window.addEventListener('resize', this._resize);
        this.resize();
        this.canvas.style.opacity = this.cfg.opacity;
        this.spawnAll();
        this.loop();
      }

      resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }

      destroy() {
        this.running = false;
        window.removeEventListener('resize', this._resize);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      spawnAll() {
        this.particles = [];
        const { type, primary, accent, count } = this.cfg;
        for (let i = 0; i < count; i++) {
          const color = (i % 3 === 0) ? accent : primary;
          this.particles.push(this.make(type, color, true));
        }
      }

      make(type, color, initial = false) {
        const W = this.canvas.width, H = this.canvas.height;
        const base = {
          type, color,
          x: Math.random() * W,
          y: initial ? Math.random() * H : H + 20,
          opacity: 0, life: 0,
          maxLife: Math.random() * 260 + 140,
        };
        switch (type) {
          case 'dots': return {
            ...base,
            size: Math.random() * 2.4 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(Math.random() * 0.4 + 0.1),
          };
          case 'bubbles': return {
            ...base,
            y: initial ? Math.random() * H : H + 30,
            size: Math.random() * 7 + 2,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -(Math.random() * 0.6 + 0.2),
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.03 + 0.008,
          };
          case 'fire': return {
            ...base,
            y: initial ? Math.random() * H : H + 10,
            size: Math.random() * 9 + 3,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(Math.random() * 2.2 + 1),
            hue: Math.random() * 40,
            maxLife: Math.random() * 70 + 40,
          };
          case 'snowflakes': return {
            ...base,
            y: initial ? Math.random() * H : -15,
            size: Math.random() * 6 + 2,
            vx: (Math.random() - 0.5) * 0.7,
            vy: Math.random() * 0.8 + 0.2,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,
            arms: (Math.floor(Math.random() * 2) * 2) + 6,
            maxLife: 9999,
          };
          case 'leaves': return {
            ...base,
            y: initial ? Math.random() * H : -15,
            size: Math.random() * 9 + 4,
            vx: (Math.random() - 0.5) * 0.9,
            vy: Math.random() * 0.6 + 0.2,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.04,
            swing: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.03 + 0.008,
            maxLife: 9999,
          };
          case 'stars': return {
            ...base,
            y: initial ? Math.random() * H : Math.random() * H,
            size: Math.random() * 1.8 + 0.3,
            vx: 0, vy: 0,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.04 + 0.01,
            maxLife: 9999,
          };
          case 'neon': return {
            ...base,
            size: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -(Math.random() * 0.5 + 0.1),
            hue: Math.random() * 360,
            hueSpeed: Math.random() * 2 + 0.5,
          };
          case 'sparkles': return {
            ...base,
            size: Math.random() * 4 + 1,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 1.5 + 0.3),
            rot: Math.random() * Math.PI * 2,
            rotSpeed: Math.random() * 0.12,
            maxLife: Math.random() * 110 + 60,
          };
          default: return { ...base, size: 2, vx: 0, vy: -0.3 };
        }
      }

      update(p) {
        p.life++;
        const progress = p.life / p.maxLife;
        switch (p.type) {
          case 'dots':
            p.x += p.vx; p.y += p.vy;
            p.opacity = 0.55 * (1 - progress);
            break;
          case 'bubbles':
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 0.5 + p.vx;
            p.y += p.vy;
            p.opacity = 0.5 * (1 - progress);
            break;
          case 'fire':
            p.x += p.vx + Math.sin(p.life * 0.15) * 0.5;
            p.y += p.vy;
            p.size *= 0.984;
            p.opacity = 0.75 * (1 - progress);
            break;
          case 'snowflakes':
            p.x += p.vx + Math.sin(p.rot) * 0.3;
            p.y += p.vy;
            p.rot += p.rotSpeed;
            p.opacity = 0.65;
            if (p.y > this.canvas.height + 20) { p.y = -15; p.x = Math.random() * this.canvas.width; }
            break;
          case 'leaves':
            p.swing += p.swingSpeed;
            p.x += Math.sin(p.swing) * 0.8 + p.vx;
            p.y += p.vy;
            p.rot += p.rotSpeed;
            p.opacity = 0.5;
            if (p.y > this.canvas.height + 20) { p.y = -15; p.x = Math.random() * this.canvas.width; }
            break;
          case 'stars':
            p.twinkle += p.twinkleSpeed;
            p.opacity = 0.25 + 0.55 * Math.abs(Math.sin(p.twinkle));
            break;
          case 'neon':
            p.x += p.vx; p.y += p.vy;
            p.hue = (p.hue + p.hueSpeed) % 360;
            p.opacity = 0.6 * (1 - progress);
            break;
          case 'sparkles':
            p.x += p.vx; p.y += p.vy;
            p.rot += p.rotSpeed;
            p.vy -= 0.02;
            p.opacity = 0.8 * (1 - progress);
            break;
        }
      }

      draw(p) {
        const ctx = this.ctx;
        if (p.opacity <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

        switch (p.type) {
          case 'dots':
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8; ctx.shadowColor = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            break;

          case 'bubbles':
            ctx.strokeStyle = p.color; ctx.lineWidth = 1.2;
            ctx.shadowBlur = 10; ctx.shadowColor = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.beginPath(); ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.35, 0, Math.PI * 2); ctx.fill();
            break;

          case 'fire': {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            g.addColorStop(0, `hsla(${60 - p.hue},100%,90%,${p.opacity})`);
            g.addColorStop(0.4, `hsla(${30 - p.hue},100%,60%,${p.opacity * 0.8})`);
            g.addColorStop(1, `hsla(${0 - p.hue},100%,40%,0)`);
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            break;
          }

          case 'snowflakes':
            ctx.translate(p.x, p.y); ctx.rotate(p.rot);
            ctx.strokeStyle = p.color; ctx.lineWidth = 1.2;
            ctx.shadowBlur = 6; ctx.shadowColor = p.color;
            for (let i = 0; i < p.arms; i++) {
              ctx.rotate(Math.PI * 2 / p.arms);
              ctx.beginPath();
              ctx.moveTo(0, 0); ctx.lineTo(0, -p.size);
              ctx.moveTo(0, -p.size * 0.5); ctx.lineTo(p.size * 0.25, -p.size * 0.68);
              ctx.moveTo(0, -p.size * 0.5); ctx.lineTo(-p.size * 0.25, -p.size * 0.68);
              ctx.stroke();
            }
            break;

          case 'leaves':
            ctx.translate(p.x, p.y); ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 4; ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.38, p.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size); ctx.stroke();
            break;

          case 'stars':
            ctx.fillStyle = p.color;
            ctx.shadowBlur = p.opacity > 0.6 ? 14 : 2;
            ctx.shadowColor = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            break;

          case 'neon':
            ctx.strokeStyle = `hsl(${p.hue},100%,65%)`;
            ctx.lineWidth = p.size;
            ctx.shadowBlur = 18; ctx.shadowColor = `hsl(${p.hue},100%,65%)`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2); ctx.stroke();
            break;

          case 'sparkles':
            ctx.translate(p.x, p.y); ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 12; ctx.shadowColor = p.color;
            for (let i = 0; i < 4; i++) {
              ctx.rotate(Math.PI / 2);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(p.size * 0.32, p.size * 0.32);
              ctx.lineTo(0, p.size);
              ctx.lineTo(-p.size * 0.32, p.size * 0.32);
              ctx.closePath(); ctx.fill();
            }
            break;
        }
        ctx.restore();
      }

      isDead(p) {
        if (p.type === 'stars' || p.type === 'snowflakes' || p.type === 'leaves') return false;
        const H = this.canvas.height, W = this.canvas.width;
        return p.life >= p.maxLife || p.y < -20 || p.x < -30 || p.x > W + 30;
      }

      loop() {
        if (!this.running) return;
        const { width: W, height: H } = this.canvas;
        this.ctx.clearRect(0, 0, W, H);
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          this.update(p);
          this.draw(p);
          if (this.isDead(p)) {
            this.particles.splice(i, 1);
            const cfg = this.cfg;
            const color = Math.random() < 0.33 ? cfg.accent : cfg.primary;
            this.particles.push(this.make(p.type, color));
          }
        }
        requestAnimationFrame(() => this.loop());
      }
    }

    let activeParticleSystem = null;

    function startParticles(theme) {
      if (activeParticleSystem) activeParticleSystem.destroy();
      activeParticleSystem = new ParticleSystem(theme);
    }
    /* END PARTICLE ENGINE */

    /* ── DOWNLOAD HANDLER ── */
    const DL_ICONS = {
      windows: `<svg viewBox="0 0 88 88" style="width:52px;height:52px" fill="none"><rect x="4" y="4" width="38" height="38" rx="6" fill="#00adef"/><rect x="46" y="4" width="38" height="38" rx="6" fill="#00adef"/><rect x="4" y="46" width="38" height="38" rx="6" fill="#00adef"/><rect x="46" y="46" width="38" height="38" rx="6" fill="#00adef"/></svg>`,
      mac: `<img src="data:image/png;base64,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" style="width:52px;height:52px;object-fit:contain;filter:brightness(0) invert(1);opacity:0.9">`,
      'linux-arm': `<img src="assets/images/linux-arm.png" style="width:52px;height:52px;object-fit:contain;filter:brightness(0) invert(1);opacity:0.9">`,
      'linux-x86': `<img src="data:image/png;base64,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" style="width:52px;height:52px;object-fit:contain">`,
    };
    const DL_NAMES = { windows: 'Windows', mac: 'macOS', 'linux-arm': 'Linux ARM64', 'linux-x86': 'Linux x86_64' };

    function handleDownload(platform, url) {
      // Open the download link in a new tab
      window.open(url, '_blank');

      // Show the modal
      const modal = document.getElementById('dlModal');
      document.getElementById('dlModalIcon').innerHTML = DL_ICONS[platform] || '⬇';
      document.getElementById('dlModalTitle').textContent = 'Download starting — ' + DL_NAMES[platform];
      document.getElementById('dlModalSub').textContent =
        'Your download is opening in a new tab. While you wait — feel free to reach out if you need installation help!';
      document.getElementById('dlDirectLink').href = url;

      // Reset + restart progress bar
      const fill = document.getElementById('dlBarFill');
      fill.style.animation = 'none';
      fill.offsetHeight; // reflow
      fill.style.animation = 'dl-progress 2.2s ease forwards';

      modal.classList.add('show');

      // After 2.4s scroll to contact section
      setTimeout(() => {
        const contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 2400);
    }

    function closeDlModal() {
      document.getElementById('dlModal').classList.remove('show');
    }
    // Close on backdrop click
    document.getElementById('dlModal').addEventListener('click', function (e) {
      if (e.target === this) closeDlModal();
    });

    /* ── THEME SWITCHER ── */
    const SITE_THEMES = ['dark', 'light', 'fire', 'earth', 'frost', 'water', 'space', 'neon', 'forest', 'sunset'];
    let currentSiteTheme = localStorage.getItem('cb_site_theme') || 'dark';

    function applySiteTheme(theme) {
      // Remove all theme classes
      SITE_THEMES.forEach(t => document.body.classList.remove('site-theme-' + t));
      // Add new one (dark is default/:root so no class needed)
      if (theme !== 'dark') document.body.classList.add('site-theme-' + theme);
      currentSiteTheme = theme;
      localStorage.setItem('cb_site_theme', theme);

      // Start theme-matched particle system
      startParticles(theme);

      // Flash animation on body
      document.body.classList.add('theme-switching');
      setTimeout(() => document.body.classList.remove('theme-switching'), 400);

      // Update active chip
      document.querySelectorAll('.theme-chip').forEach(chip => {
        chip.classList.toggle('active-theme', chip.dataset.themeId === theme);
      });

      // Update cursor + ring color to match theme primary
      const themeColors = {
        dark: '#5eead4', light: '#4f46e5', fire: '#fb923c', earth: '#86efac',
        frost: '#7dd3fc', water: '#34d399', space: '#c084fc', neon: '#f0abfc',
        forest: '#6ee7b7', sunset: '#fca5a5'
      };
      const c = themeColors[theme] || '#5eead4';
      document.getElementById('cursorDot').style.background = c;
      document.getElementById('cursorRing').style.borderColor = c.replace(')', ',.5)').replace('rgb', 'rgba');
    }

    // Wire up theme chips
    function initThemeChips() {
      document.querySelectorAll('.theme-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const theme = chip.dataset.themeId;
          if (theme) applySiteTheme(theme);
        });
      });
      // Apply saved theme on load
      applySiteTheme(currentSiteTheme);
    }

    /* ── CUSTOM CURSOR ── */
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animCursor() {
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    })();
    document.querySelectorAll('a, button, .feature-card, .theme-chip, .faq-q, .usecase-card, .platform-card, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '52px'; ring.style.height = '52px';
        ring.style.borderColor = 'rgba(94,234,212,.8)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '32px'; ring.style.height = '32px';
        ring.style.borderColor = 'rgba(94,234,212,.5)';
      });
    });

    /* ── NAV SCROLL ── */
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    });

    /* ── SCROLL REVEAL ── */
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));

    /* ── COUNTER ANIMATION ── */
    document.querySelectorAll('[data-target]').forEach(el => {
      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        const target = +el.dataset.target;
        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.round(current);
          if (current >= target) clearInterval(timer);
        }, 30);
        obs.unobserve(el);
      }, { threshold: 0.5 });
      obs.observe(el);
    });

    /* ── FAQ ACCORDION ── */
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    /* ── FORM SUBMIT ── */
    function handleFormSubmit(e) {
      e.preventDefault();
      document.getElementById('form-success').style.display = 'block';
      setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 4000);
    }

    /* ── SMOOTH ANCHOR SCROLL ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });

    /* ── INIT ── */
    initThemeChips(); // also calls startParticles via applySiteTheme

    /* ── SCROLLABLE MARQUEE ── */
    const galleryWrap = document.querySelector('.gallery-wrap');
    if (galleryWrap) {
      let isHovered = false;
      let scrollSpeed = 1;

      galleryWrap.addEventListener('mouseenter', () => isHovered = true);
      galleryWrap.addEventListener('mouseleave', () => isHovered = false);
      
      // Also pause on touch
      galleryWrap.addEventListener('touchstart', () => isHovered = true);
      galleryWrap.addEventListener('touchend', () => isHovered = false);

      function autoScrollGallery() {
        if (!isHovered) {
          galleryWrap.scrollLeft += scrollSpeed;
          
          // Seamless loop
          // scrollWidth is total width (2 sets of images). 
          // When we scrolled past half, reset to 0.
          if (galleryWrap.scrollLeft >= galleryWrap.scrollWidth / 2) {
            galleryWrap.scrollLeft = 0;
          }
        }
        requestAnimationFrame(autoScrollGallery);
      }
      requestAnimationFrame(autoScrollGallery);
    }
