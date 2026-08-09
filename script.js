document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setFooterYear();
  initTypingEffect(prefersReducedMotion);
  initBootSequence(prefersReducedMotion);
  initMobileMenu();
  initScrollReveal(prefersReducedMotion);
  initActiveNavLink();
  initPointerInteractions(prefersReducedMotion);
  initNavbarScroll();
});

function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 20);
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

function initTypingEffect(prefersReducedMotion) {
  const occupationEl = document.getElementById('occupation');
  const homeSection = document.getElementById('home');
  if (!occupationEl || !homeSection || prefersReducedMotion) return;

  const roles = [occupationEl.textContent.trim()];
  const TYPE_SPEED = 90;
  const DELETE_SPEED = 55;
  const HOLD_TIME = 1600;

  let roleIndex = 0;
  let isVisible = false;
  let isTyping = false;

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !isTyping) {
      isTyping = true;
      loop();
    }
  });
  
  observer.observe(homeSection);

  function type(text, index, callback) {
    if (!isVisible) {
      isTyping = false;
      return;
    }
    
    occupationEl.textContent = text.slice(0, index);
    if (index < text.length) {
      setTimeout(() => type(text, index + 1, callback), TYPE_SPEED);
    } else {
      setTimeout(callback, HOLD_TIME);
    }
  }

  function erase(text, index, callback) {
    if (!isVisible) {
      isTyping = false;
      return;
    }

    occupationEl.textContent = text.slice(0, index);
    if (index > 0) {
      setTimeout(() => erase(text, index - 1, callback), DELETE_SPEED);
    } else {
      callback();
    }
  }

  function loop() {
    if (!isVisible) {
      isTyping = false;
      return;
    }
    
    const currentRole = roles[roleIndex % roles.length];
    type(currentRole, 0, () => {
      erase(currentRole, currentRole.length, () => {
        roleIndex++;
        loop();
      });
    });
  }
}

function initBootSequence(prefersReducedMotion) {
  const terminal = document.querySelector('[data-boot-terminal]');
  if (!terminal) return;

  const steps = Array.from(terminal.querySelectorAll('[data-boot-step]'));
  if (!steps.length) return;

  if (prefersReducedMotion) {
    steps.forEach((step) => {
      const cmdEl = step.querySelector('.boot-cmd');
      if (cmdEl) cmdEl.textContent = cmdEl.dataset.cmd || '';

      const outputEl = step.querySelector('[data-boot-output]');
      if (outputEl) outputEl.classList.add('is-shown');

      const cursorEl = step.querySelector('.blink-cursor');
      if (cursorEl && step.hasAttribute('data-boot-final')) {
        cursorEl.classList.add('is-active');
      }
    });
    return;
  }

  const CMD_TYPE_SPEED = 32;
  const STEP_PAUSE = 260;
  let started = false;

  function typeCommand(cmdEl, cursorEl, onDone) {
    const text = cmdEl.dataset.cmd || '';
    let i = 0;

    if (cursorEl) cursorEl.classList.add('is-active');

    function tick() {
      cmdEl.textContent = text.slice(0, i);
      i += 1;

      if (i <= text.length) {
        setTimeout(tick, CMD_TYPE_SPEED);
      } else {
        setTimeout(onDone, STEP_PAUSE);
      }
    }
    tick();
  }

  function runStep(index) {
    if (index >= steps.length) return;

    const step = steps[index];
    const cmdEl = step.querySelector('.boot-cmd');
    const cursorEl = step.querySelector('.blink-cursor');
    const outputEl = step.querySelector('[data-boot-output]');
    const isFinal = step.hasAttribute('data-boot-final');

    if (!cmdEl) {
      runStep(index + 1);
      return;
    }

    typeCommand(cmdEl, cursorEl, () => {
      if (outputEl) outputEl.classList.add('is-shown');

      if (cursorEl && !isFinal) {
        cursorEl.classList.remove('is-active');
      }

      if (isFinal) {
        const arrowEl = step.querySelector('.boot-cta-arrow');
        if (arrowEl) arrowEl.classList.add('is-shown');
      }

      setTimeout(() => runStep(index + 1), STEP_PAUSE);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        runStep(0);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(terminal);
}

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const DIALOG_CLOSE_MS = 300;

  if (!toggle || !menu) return;

  const navLinks = menu.querySelectorAll('[data-nav-link]');

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menu.classList.remove('pointer-events-none');
    document.body.style.overflow = 'hidden';

    if (typeof menu.show === 'function' && !menu.open) {
      menu.show();
    }
    
    menu.focus({ preventScroll: true });
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.classList.add('pointer-events-none');
    document.body.style.overflow = '';

    setTimeout(() => {
      if (!menu.classList.contains('is-open') && typeof menu.close === 'function' && menu.open) {
        menu.close();
      }
    }, DIALOG_CLOSE_MS);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  menu.addEventListener('click', (e) => {
    if (e.target === menu) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function initScrollReveal(prefersReducedMotion) {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transitionDelay = `${i * 60}ms`;
        
        requestAnimationFrame(() => {
          el.classList.add('is-visible');
        });
        
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

function initActiveNavLink() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('[data-nav-link]');

  if (!sections.length || !navLinks.length) return;

  const linksById = new Map();

  navLinks.forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    if (!id) return;
    if (!linksById.has(id)) linksById.set(id, []);
    linksById.get(id).push(link);
  });

  const setActiveSection = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
      isActive ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && linksById.has(entry.target.id)) {
        setActiveSection(entry.target.id);
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));

  const initialSection = [...sections].find((section) => {
    const rect = section.getBoundingClientRect();
    const probe = window.innerHeight * 0.4;
    return rect.top <= probe && rect.bottom > probe;
  });

  if (initialSection) setActiveSection(initialSection.id);
}

function initPointerInteractions(prefersReducedMotion) {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  initPointerGlow(prefersReducedMotion);
  initRipples();

  if (isFinePointer && !prefersReducedMotion) {
    initCustomCursor();
    initMagnetic();
    initTilt();
  }
}

function initPointerGlow(prefersReducedMotion) {
  const glow = document.getElementById('pointer-glow');
  if (!glow || prefersReducedMotion) return;

  let raf = null;

  const setPosition = (x, y) => {
    glow.style.setProperty('--mx', `${x}px`);
    glow.style.setProperty('--my', `${y}px`);
    glow.classList.add('is-active');
  };

  const clearGlow = () => glow.classList.remove('is-active');

  const moveHandler = (x, y) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      setPosition(x, y);
      raf = null;
    });
  };

  window.addEventListener('pointermove', (e) => moveHandler(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) moveHandler(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  document.addEventListener('mouseleave', clearGlow);
  window.addEventListener('pointercancel', clearGlow);
  window.addEventListener('touchcancel', clearGlow);
}

function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let ringX = targetX;
  let ringY = targetY;
  let followRaf = null;

  function followLoop() {
    const dx = targetX - ringX;
    const dy = targetY - ringY;

    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      ringX = targetX;
      ringY = targetY;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      followRaf = null;
      return;
    }

    ringX += dx * 0.18;
    ringY += dy * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    followRaf = requestAnimationFrame(followLoop);
  }

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;

    targetX = e.clientX;
    targetY = e.clientY;

    dot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');

    if (!followRaf) followLoop();
  });

  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') ring.classList.add('is-pressed');
  });

  window.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'mouse') ring.classList.remove('is-pressed');
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  });

  const hoverTargets = document.querySelectorAll('a, button, .project-card, .contact-card, [data-nav-link]');

  hoverTargets.forEach((el) => {
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') ring.classList.add('is-active');
    });
    el.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') ring.classList.remove('is-active');
    });
  });
}

function initMagnetic() {
  const magnets = document.querySelectorAll('.magnetic');

  magnets.forEach((el) => {
    let rect = null;

    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      rect = el.getBoundingClientRect();
    });

    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !rect) return;
      
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
    });

    el.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      rect = null;
      el.style.transform = '';
    });
  });
}

function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach((card) => {
    let rect = null;

    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !rect) return;

      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      
      card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      rect = null;
      card.style.transform = '';
    });
  });
}

function initRipples() {
  const rippleTargets = document.querySelectorAll('.ripple-target');

  rippleTargets.forEach((el) => {
    el.addEventListener('pointerdown', (e) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const originX = e.clientX ?? rect.left + rect.width / 2;
      const originY = e.clientY ?? rect.top + rect.height / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${originX - rect.left - size / 2}px`;
      ripple.style.top = `${originY - rect.top - size / 2}px`;

      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}