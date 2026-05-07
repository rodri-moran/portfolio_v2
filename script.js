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

const langButtons = document.querySelectorAll(".lang-btn");

function setLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-es][data-en]").forEach(el => {
    el.textContent = el.dataset[lang];
  });

  langButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  localStorage.setItem("language", lang);
}

langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
  });
});

const savedLang = localStorage.getItem("language") || "es";
setLanguage(savedLang);

/* ─── PROJECT CAROUSELS ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-next');

  let activeImages = [];
  let activeIndex = 0;
  let touchStartX = 0;

  function openLightbox(images, index) {
    if (!lightbox || !lightboxImg) return;

    activeImages = images;
    activeIndex = index;

    updateLightboxImage();

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const img = activeImages[activeIndex];
    if (!img || !lightboxImg) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || 'Imagen del proyecto';
  }

  function goLightboxTo(index) {
    if (!activeImages.length) return;

    activeIndex = (index + activeImages.length) % activeImages.length;
    updateLightboxImage();
  }

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track   = carousel.querySelector('.carousel-track');
    const slides  = carousel.querySelectorAll('.carousel-slide');
    const btnPrev = carousel.querySelector('.carousel-btn.prev');
    const btnNext = carousel.querySelector('.carousel-btn.next');
    const dotsEl  = carousel.querySelector('.carousel-dots');
    const images  = Array.from(carousel.querySelectorAll('.carousel-img'));

    let current = 0;

    images.forEach((img, index) => {
      img.addEventListener('click', () => {
        openLightbox(images, index);
      });
    });


    if (slides.length <= 1) {
      if (btnPrev) btnPrev.disabled = true;
      if (btnNext) btnNext.disabled = true;
      return;
    }

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ver imagen ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });

    const dots = dotsEl.querySelectorAll('.carousel-dot');

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => goLightboxTo(activeIndex - 1));
  lightboxNext?.addEventListener('click', () => goLightboxTo(activeIndex + 1));

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goLightboxTo(activeIndex - 1);
    if (e.key === 'ArrowRight') goLightboxTo(activeIndex + 1);
  });

  lightbox?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightbox?.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      goLightboxTo(activeIndex + 1);
    } else {
      goLightboxTo(activeIndex - 1);
    }
  });
});