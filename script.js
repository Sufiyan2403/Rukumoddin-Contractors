// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== ACTIVE NAV LINK =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  links.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  });
}
let countersStarted = false;

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// ===== HERO COUNTER OBSERVER =====
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    animateCounters();
  }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// Apply reveal to elements
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = [
    ...document.querySelectorAll('.service-card'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.why-card'),
    ...document.querySelectorAll('.contact-info-card'),
    document.querySelector('.about-grid'),
    document.querySelector('.contact-form'),
  ].filter(Boolean);
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
    revealObserver.observe(el);
  });
});

// ===== PLAY BUTTON (video placeholder interaction) =====
document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const label = btn.closest('.video-placeholder').querySelector('.video-label');
    label.textContent = '📹 Add your video src to this placeholder';
    label.style.background = 'rgba(249,115,22,0.8)';
    btn.style.display = 'none';
  });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !phone || !message) {
    alert('Please fill in all required fields (Name, Phone, Message).');
    return;
  }
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;
  setTimeout(() => {
    form.reset();
    btn.innerHTML = '<span>Send Message</span><span class="btn-arrow">→</span>';
    btn.disabled = false;
    successMsg.style.display = 'block';
    setTimeout(() => successMsg.style.display = 'none', 5000);
  }, 1500);
});
