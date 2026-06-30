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
initScrollParallax();

// Navegación: fondo sólido tras hacer scroll fuera del hero.
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.7);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Motas de luz WebGPU sobre el hero (degrada con elegancia si no hay soporte).
initParticles(document.getElementById('hero-canvas')).catch((err) => {
  console.warn('[hero] WebGPU no disponible, se usa solo la fotografía:', err);
});

function initScrollParallax() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const configs = [
    ['.hero-media img', 0.16],
    ['.date-leaf', -0.12],
    ['.story-figure', 0.08],
    ['.story-text', -0.05],
    ['.gd-figure', 0.08],
    ['.dress-look', 0.06],
    ['.rsvp-form', 0.05],
    ['.detail-band img', 0.14],
  ];

  const items = configs.flatMap(([selector, speed]) =>
    [...document.querySelectorAll(selector)].map((el) => {
      el.classList.add('parallax-item');
      return { el, speed };
    }),
  );

  if (!items.length) return;

  let ticking = false;

  const update = () => {
    const viewportCenter = window.innerHeight / 2;

    for (const item of items) {
      const rect = item.el.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) continue;

      const elementCenter = rect.top + rect.height / 2;
      const offset = (viewportCenter - elementCenter) * item.speed;
      const clamped = Math.max(-38, Math.min(38, offset));
      item.el.style.setProperty('--parallax-y', `${clamped.toFixed(1)}px`);
    }

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
