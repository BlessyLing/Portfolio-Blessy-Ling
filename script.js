// ── THEME TOGGLE ──
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);

  if (themeToggle) {
    themeToggle.classList.toggle('active', theme === 'dark');
    const icon = themeToggle.querySelector('.theme-icon');
    const label = themeToggle.querySelector('.theme-label');

    if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
    if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
};

applyTheme(initialTheme);

themeToggle?.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ── ACTIVE NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ── PROJECTS CAROUSEL ──
const track = document.querySelector('.projects-track');
const slides = Array.from(document.querySelectorAll('.projects-track .project-panel'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

const scrollToSlide = (index) => {
  if (!track || slides.length === 0) return;
  index = Math.max(0, Math.min(index, slides.length - 1));
  const slide = slides[index];
  track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
  currentIndex = index;
};

prevBtn?.addEventListener('click', () => {
  scrollToSlide(currentIndex - 1);
});

nextBtn?.addEventListener('click', () => {
  scrollToSlide(currentIndex + 1);
});

scrollToSlide(0);

// ── SCREENSHOT LIGHTBOX ──
const imageModal = document.createElement('div');
imageModal.className = 'image-modal';
imageModal.innerHTML = `
  <div class="image-modal-inner">
    <button class="image-modal-close" type="button" aria-label="Close preview">×</button>
    <img class="image-modal-image" src="" alt="" />
    <div class="image-modal-caption"></div>
  </div>
`;
document.body.appendChild(imageModal);

const modalImage = imageModal.querySelector('.image-modal-image');
const modalCaption = imageModal.querySelector('.image-modal-caption');
const closeModal = () => {
  imageModal.classList.remove('active');
  document.body.style.overflow = '';
};

const openModal = (img) => {
  if (!img) return;
  modalImage.src = img.src;
  modalImage.alt = img.alt || '';
  modalCaption.textContent = img.alt || 'Project screenshot';
  imageModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

document.querySelectorAll('.screen-thumb').forEach((thumb) => {
  const img = thumb.querySelector('img');
  if (!img) return;

  thumb.setAttribute('role', 'button');
  thumb.setAttribute('tabindex', '0');

  thumb.addEventListener('click', () => openModal(img));
  thumb.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(img);
    }
  });
});

imageModal.addEventListener('click', (event) => {
  if (event.target === imageModal) {
    closeModal();
  }
});

imageModal.querySelector('.image-modal-close')?.addEventListener('click', closeModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});
