const whatsapp = 'https://wa.me/5537998373799';
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  const message = link.dataset.subject ? `Olá! Gostaria de conversar sobre ${link.dataset.subject}.` : 'Olá! Gostaria de solicitar um atendimento com a Dra. Walquíria Santana.';
  link.href = `${whatsapp}?text=${encodeURIComponent(message)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const header = document.querySelector('.header');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menu');
  header.classList.remove('menu-open');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  header.classList.toggle('menu-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
window.matchMedia('(min-width: 1101px)').addEventListener('change', () => closeMenu());

const reducedMotion = { matches: false };
document.querySelectorAll('.about-visual, .property-photo, .office > div:first-child').forEach(element => element.classList.add('reveal-left'));
document.querySelectorAll('.about-copy, .property-copy, .map-wrap').forEach(element => element.classList.add('reveal-right'));
document.querySelectorAll('.service-card, .insight, .faq-item').forEach(element => element.classList.add('reveal-scale'));
document.querySelectorAll('.section-heading, .experience > div:first-child').forEach(element => element.classList.add('reveal-blur'));
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: .1 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur').forEach(element => observer.observe(element));
}
const progress = document.querySelector('.scroll-progress');
let scheduled = false;
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
  scheduled = false;
}
window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();

// Infinite editorial marquee. Duplicate content remains hidden from assistive technology.
const practiceStrip = document.querySelector('.practice-strip');
if (practiceStrip && !reducedMotion.matches) {
  const original = Array.from(practiceStrip.children);
  const track = document.createElement('div');
  track.className = 'marquee-track';
  original.forEach(item => track.append(item));
  original.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.append(clone);
  });
  practiceStrip.append(track);
}

// Count years of practice once the badge enters the viewport.
const counter = document.querySelector('.experience-number');
if (counter && !reducedMotion.matches) {
  const counterObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    const start = performance.now();
    const duration = 3200;
    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      counter.textContent = `+${Math.floor(10 * progress)}`;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    observer.disconnect();
  }, { threshold: .7 });
  counterObserver.observe(counter);
}

// Short typing accent; only decorative hero copy changes.
const typingTarget = document.querySelector('.hero .eyebrow');
if (typingTarget && !reducedMotion.matches) {
  const line = typingTarget.querySelector('.small-line');
  const textNode = Array.from(typingTarget.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
  const phrase = textNode?.textContent.trim();
  if (textNode && phrase) {
    textNode.textContent = '';
    typingTarget.classList.add('typing');
    let index = 0;
    const type = () => {
      textNode.textContent = phrase.slice(0, index++);
      if (index <= phrase.length) window.setTimeout(type, 38);
      else typingTarget.classList.remove('typing');
    };
    window.setTimeout(type, 250);
  }
}

// Accessible accordion.
document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const opening = !item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('button').setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('open', opening);
    button.setAttribute('aria-expanded', String(opening));
  });
});

// Lightweight premium motion. Everything remains usable when motion is reduced.
if (!reducedMotion.matches) {
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  const propertyPhoto = document.querySelector('.property-photo img');

  hero.addEventListener('pointermove', event => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    heroVisual.style.setProperty('--pointer-x', `${x * 12}px`);
    heroVisual.style.setProperty('--pointer-y', `${y * 8}px`);
    hero.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
    hero.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
  });

  hero.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--pointer-x', '0px');
    heroVisual.style.setProperty('--pointer-y', '0px');
  });

  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('pointermove', event => {
      const bounds = button.getBoundingClientRect();
      const x = Math.max(-5, Math.min(5, (event.clientX - bounds.left - bounds.width / 2) * .08));
      const y = Math.max(-5, Math.min(5, (event.clientY - bounds.top - bounds.height / 2) * .08));
      button.style.setProperty('--magnetic-x', `${x}px`);
      button.style.setProperty('--magnetic-y', `${y}px`);
    });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--magnetic-x', '0px');
      button.style.setProperty('--magnetic-y', '0px');
    });
  });

  document.querySelectorAll('.service-card, .insight').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const rotateY = ((x / bounds.width) - .5) * 5;
      const rotateX = (.5 - (y / bounds.height)) * 5;
      card.style.setProperty('--spot-x', `${x}px`);
      card.style.setProperty('--spot-y', `${y}px`);
      card.style.setProperty('--tilt-x', `${rotateX}deg`);
      card.style.setProperty('--tilt-y', `${rotateY}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });

  function updateParallax() {
    const heroBounds = hero.getBoundingClientRect();
    const shift = Math.max(-22, Math.min(22, heroBounds.top * -.035));
    heroVisual.style.setProperty('--scroll-y', `${shift}px`);

    const propertyBounds = propertyPhoto.parentElement.getBoundingClientRect();
    const propertyShift = Math.max(-18, Math.min(18, (window.innerHeight / 2 - propertyBounds.top) * .035));
    propertyPhoto.style.setProperty('--photo-y', `${propertyShift}px`);
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}
