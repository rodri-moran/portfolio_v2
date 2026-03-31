/* ─── FADE-IN ON SCROLL ───────────────────────────────────────── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

/* ─── NAV SCROLL EFFECT ───────────────────────────────────────── */
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ─── SMOOTH ACTIVE NAV LINK ──────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--text)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ─── SKILL BAR ANIMATION ON SCROLL ──────────────────────────── */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-bar-fill');
        fills.forEach((fill, i) => {
          fill.style.animationDelay = `${i * 0.08}s`;
          fill.style.animationPlayState = 'running';
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.skill-group').forEach((group) => {
  const fills = group.querySelectorAll('.skill-bar-fill');
  fills.forEach((fill) => {
    fill.style.animationPlayState = 'paused';
  });
  barObserver.observe(group);
});

/* ─── HERO STACK PILLS — STAGGER ON LOAD ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll('.stack-pill');
  pills.forEach((pill, i) => {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(12px)';
    pill.style.transition = `opacity .45s ease ${0.6 + i * 0.07}s, transform .45s ease ${0.6 + i * 0.07}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pill.style.opacity = '1';
        pill.style.transform = 'none';
      });
    });
  });

  // Hero text stagger
  const heroEls = document.querySelectorAll(
    '.hero-eyebrow, .hero-name, .hero-role, .hero-desc, .hero-ctas'
  );
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity .55s ease ${0.1 + i * 0.1}s, transform .55s ease ${0.1 + i * 0.1}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
  });
});
