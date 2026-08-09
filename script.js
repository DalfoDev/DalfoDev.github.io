document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setFooterYear();
  initTypingEffect(prefersReducedMotion);
  initMobileMenu();
  initScrollReveal(prefersReducedMotion);
  initActiveNavLink();
  initPointerInteractions(prefersReducedMotion);
  initNavbarScroll();
});

/* ---------- Footer year ---------- */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Navbar Scroll Transition ---------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    // Check if the user has scrolled down more than 20 pixels
    if (window.scrollY > 20) {
      navbar.classList.add('bg-ink-900/70', 'backdrop-blur-md', 'border-white/10', 'shadow-lg', 'shadow-black/30', 'is-on');
      navbar.classList.remove('border-transparent', 'bg-transparent');
    } else {
      // Revert to transparent state and remove 'is-on' when at the top
      navbar.classList.remove('bg-ink-900/70', 'backdrop-blur-md', 'border-white/10', 'shadow-lg', 'shadow-black/30', 'is-on');
      navbar.classList.add('border-transparent', 'bg-transparent');
    }
  };

  // Run once immediately to set the correct state on load or refresh
  handleScroll();
  
  // Listen to the scroll event
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ---------- Hero typing / deleting effect ---------- */
function initTypingEffect(prefersReducedMotion) {
  const occupationEl = document.getElementById('occupation');
  if (!occupationEl) return;

  const roles = [occupationEl.textContent.trim()];

  if (prefersReducedMotion) return; // keep static text, skip animation

  const TYPE_SPEED = 90;
  const DELETE_SPEED = 55;
  const HOLD_TIME = 1600;

  let roleIndex = 0;

  function type(text, index, callback) {
    occupationEl.textContent = text.slice(0, index);
    if (index < text.length) {
      setTimeout(() => type(text, index + 1, callback), TYPE_SPEED);
    } else {
      setTimeout(callback, HOLD_TIME);
    }
  }

  function erase(text, index, callback) {
    occupationEl.textContent = text.slice(0, index);
    if (index > 0) {
      setTimeout(() => erase(text, index - 1, callback), DELETE_SPEED);
    } else {
      callback();
    }
  }

  function loop() {
    const currentRole = roles[roleIndex % roles.length];
    type(currentRole, 0, () => {
      erase(currentRole, currentRole.length, () => {
        roleIndex++;
        loop();
      });
    });
  }

  loop();
}

/* ---------- Mobile hamburger menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
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

    // A <dialog> focuses its first focusable child by default. Move focus to
    // the dialog itself so "Home" is not visually highlighted every time.
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
    }, 300);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  // Close when clicking empty space in overlay
  menu.addEventListener('click', (e) => {
    if (e.target === menu) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

/* ---------- Scroll-triggered reveal animations ---------- */
function initScrollReveal(prefersReducedMotion) {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (prefersReducedMotion) {
    revealEls.forEach((el) => {
      if (el instanceof Element) el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting && entry.target instanceof Element) {
          const el = entry.target;
          setTimeout(() => el.classList.add('is-visible'), i * 60);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => {
    if (el instanceof Element) observer.observe(el);
  });
}

/* ---------- Highlight active nav link while scrolling ---------- */
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

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && linksById.has(entry.target.id)) {
          setActiveSection(entry.target.id);
        }
      });
    },
    { rootMargin: '-40% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach((section) => {
    if (section instanceof Element) observer.observe(section);
  });

  // Set the correct state immediately on initial load / refresh.
  const initialSection = [...sections].find((section) => {
    const rect = section.getBoundingClientRect();
    const probe = window.innerHeight * 0.4;
    return rect.top <= probe && rect.bottom > probe;
  });
  if (initialSection) setActiveSection(initialSection.id);
}

/* =========================================================
   Pointer interactions
   ========================================================= */
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

/* ---------- Ambient glow that trails the pointer (mouse or touch) ---------- */
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

  window.addEventListener(
    'pointermove',
    (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setPosition(e.clientX, e.clientY);
        raf = null;
      });
    },
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    (e) => {
      const touch = e.touches[0];
      if (!touch || raf) return;
      raf = requestAnimationFrame(() => {
        setPosition(touch.clientX, touch.clientY);
        raf = null;
      });
    },
    { passive: true }
  );

  document.addEventListener('mouseleave', clearGlow);
  window.addEventListener('pointercancel', clearGlow);
  window.addEventListener('touchcancel', clearGlow);
}

/* ---------- Custom cursor (desktop / fine pointer only) ---------- */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let ringX = targetX;
  let ringY = targetY;
  let followRaf = null;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');

    if (!followRaf) {
      followLoop();
    }
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

  // Ring eases toward the dot for a soft, trailing feel, with exit condition
  function followLoop() {
    const dx = targetX - ringX;
    const dy = targetY - ringY;

    // Stop the loop if the ring has practically caught up to the pointer
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

  followLoop();

  const hoverTargets = document.querySelectorAll(
    'a, button, .project-card, .contact-card, [data-nav-link]'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') ring.classList.add('is-active');
    });
    el.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') ring.classList.remove('is-active');
    });
  });
}

/* ---------- Magnetic pull for primary buttons (mouse only) ---------- */
function initMagnetic() {
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
    });
    el.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      el.style.transform = '';
    });
  });
}

/* ---------- Subtle 3D tilt for cards (mouse only) ---------- */
function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      card.style.transform = '';
    });
  });
}

/* ---------- Ripple feedback on tap/click (mouse AND touch) ---------- */
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