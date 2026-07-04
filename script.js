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
  ].filter(Boolean);
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
    revealObserver.observe(el);
  });
});

// ===== PROJECT VIDEOS =====
function keepProjectVideoMuted(video) {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.removeAttribute('controls');
  video.addEventListener('volumechange', () => {
    if (!video.muted || video.volume !== 0) {
      video.muted = true;
      video.volume = 0;
    }
  });
}
document.querySelectorAll('.project-video').forEach(keepProjectVideoMuted);

// ===== PROJECT MEDIA SLIDERS =====
document.querySelectorAll('.project-card').forEach(card => {
  const media = card.querySelector('.project-media');
  let activeMedia = media?.querySelector('.project-thumb, .project-video');
  const gallery = card.querySelector('.project-gallery');
  if (!media || !activeMedia || !gallery) return;

  const originalGalleryImages = [...gallery.querySelectorAll('img')];
  if (originalGalleryImages.length === 0) return;

  originalGalleryImages.forEach(image => {
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
  });

  const originalIsVideo = activeMedia.tagName.toLowerCase() === 'video';
  const originalSlide = {
    type: originalIsVideo ? 'video' : 'image',
    src: activeMedia.getAttribute('src'),
    poster: activeMedia.getAttribute('poster') || activeMedia.getAttribute('src'),
    alt: activeMedia.getAttribute('aria-label') || activeMedia.getAttribute('alt') || 'Project media',
    label: originalIsVideo ? 'Muted Site Video' : 'Photo Gallery',
  };

  const firstThumb = document.createElement('img');
  firstThumb.src = originalSlide.poster || originalSlide.src;
  firstThumb.alt = originalSlide.alt;
  firstThumb.setAttribute('tabindex', '0');
  firstThumb.setAttribute('role', 'button');
  gallery.prepend(firstThumb);

  const thumbs = [...gallery.querySelectorAll('img')];
  const slides = [
    originalSlide,
    ...originalGalleryImages.map(image => ({
      type: 'image',
      src: image.getAttribute('src'),
      alt: image.getAttribute('alt') || 'Project photo',
      label: 'Photo Gallery',
    })),
  ];
  let current = 0;

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'slider-btn slider-prev';
  prevButton.setAttribute('aria-label', 'Previous project photo');
  prevButton.textContent = '<';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'slider-btn slider-next';
  nextButton.setAttribute('aria-label', 'Next project photo');
  nextButton.textContent = '>';

  media.append(prevButton, nextButton);

  function createImage(slide) {
    const image = document.createElement('img');
    image.className = 'project-thumb';
    image.src = slide.src;
    image.alt = slide.alt;
    return image;
  }

  function createVideo(slide) {
    const video = document.createElement('video');
    video.className = 'project-video';
    video.src = slide.src;
    if (slide.poster) video.poster = slide.poster;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-label', slide.alt);
    keepProjectVideoMuted(video);
    return video;
  }

  function showSlide(index, shouldScroll = true) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    const nextMedia = slide.type === 'video' ? createVideo(slide) : createImage(slide);
    nextMedia.classList.add('is-changing');
    activeMedia.replaceWith(nextMedia);
    activeMedia = nextMedia;
    const label = media.querySelector('.media-label');
    if (label) label.textContent = slide.label;
    thumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle('active-thumb', thumbIndex === current);
    });
    if (shouldScroll) {
      thumbs[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    window.setTimeout(() => activeMedia.classList.remove('is-changing'), 160);
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => showSlide(index));
    thumb.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showSlide(index);
      }
    });
  });
  prevButton.addEventListener('click', () => showSlide(current - 1));
  nextButton.addEventListener('click', () => showSlide(current + 1));

  showSlide(0, false);
});
