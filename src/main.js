import { initParticles } from './particles.js';
import { initCountdown } from './countdown.js';
import { initReveal } from './reveal.js';
import { loadGuestData } from './combobox.js';
import { initRsvp } from './rsvp.js';

// 3 de octubre de 2026, 4:00 p.m. (hora de Bogotá, UTC-5)
const WEDDING_DATE = new Date('2026-10-03T16:00:00-05:00');

const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyBBA0C4XRj9DaHfyZIt_JEfAUr8lkMNuV-8TBKR7OJIVIrr9q98fDEQyO5EWFiv0tgmA/exec';

initReveal();
initCountdown(WEDDING_DATE);
loadGuestData(ENDPOINT); // lista + confirmados desde la hoja (en background)
initRsvp(ENDPOINT);
initParallaxExperience();

// Navegación: fondo sólido tras hacer scroll fuera del hero.
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.7);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Motas de luz WebGPU sobre el hero (degrada con elegancia si no hay soporte).
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  initParticles(document.getElementById('hero-canvas')).catch((err) => {
    console.warn('[hero] WebGPU no disponible, se usa solo la fotografía:', err);
  });
}

function initParallaxExperience() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mediaLayers = [
    ...document.querySelectorAll(
      '.hero-media > img, .story-figure > img, .gd-figure > img, .detail-band > img',
    ),
  ];
  if (!mediaLayers.length) return;

  const activeLayers = new Set();
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-parallax-active', entry.isIntersecting);
          if (entry.isIntersecting) activeLayers.add(entry.target);
          else activeLayers.delete(entry.target);
        });
      },
      { rootMargin: '14% 0px' },
    )
    : null;

  mediaLayers.forEach((layer) => {
    const isHero = layer.closest('.hero-media');
    const isFullBleed = layer.closest('.detail-band');
    layer.classList.add('parallax-media');
    layer.dataset.parallaxStrength = String(isHero ? 48 : isFullBleed ? 40 : 28);
    layer.style.setProperty('--parallax-scale', isHero || isFullBleed ? '1.11' : '1.09');
    if (observer) observer.observe(layer);
    else activeLayers.add(layer);
  });

  const edgeBlur = document.createElement('div');
  edgeBlur.className = 'viewport-edge-blur viewport-edge-blur--top';
  edgeBlur.setAttribute('aria-hidden', 'true');
  const bottomEdgeBlur = edgeBlur.cloneNode();
  bottomEdgeBlur.className = 'viewport-edge-blur viewport-edge-blur--bottom';
  document.body.append(edgeBlur, bottomEdgeBlur);

  let ticking = false;
  let lastScrollY = window.scrollY;

  const update = () => {
    const viewportHeight = window.innerHeight;
    const scrollDelta = window.scrollY - lastScrollY;

    if (Math.abs(scrollDelta) > 0.5) {
      document.documentElement.dataset.scrollDirection = scrollDelta > 0 ? 'down' : 'up';
    }
    if (window.scrollY <= 1) delete document.documentElement.dataset.scrollDirection;

    for (const layer of activeLayers) {
      const rect = layer.getBoundingClientRect();
      const travelRange = (viewportHeight + rect.height) / 2;
      const centerOffset = rect.top + rect.height / 2 - viewportHeight / 2;
      const progress = Math.max(-1, Math.min(1, centerOffset / travelRange));
      const baseStrength = Number(layer.dataset.parallaxStrength) || 16;
      const strength = window.innerWidth <= 620 ? baseStrength * 0.62 : baseStrength;
      layer.style.setProperty('--parallax-y', `${(-progress * strength).toFixed(2)}px`);
    }

    lastScrollY = window.scrollY;
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
}
