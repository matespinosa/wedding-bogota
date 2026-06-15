/**
 * Propuesta 2 — "Cálida editorial" (tierra/arena, oliva, collage).
 * Reutiliza los módulos existentes; sin partículas WebGPU (hero fotográfico puro).
 */
import { initCountdown } from './countdown.js';
import { initReveal } from './reveal.js';
import { loadGuestData } from './combobox.js';
import { initRsvp } from './rsvp.js';

// 3 de octubre de 2026, 4:00 p.m. (hora de Bogotá, UTC-5)
const WEDDING_DATE = new Date('2026-10-03T16:00:00-05:00');
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyBBA0C4XRj9DaHfyZIt_JEfAUr8lkMNuV-8TBKR7OJIVIrr9q98fDEQyO5EWFiv0tgmA/exec';

initReveal();
initCountdown(WEDDING_DATE);
loadGuestData(ENDPOINT);
initRsvp(ENDPOINT);

// Nav: pasa a fondo sólido al salir del hero.
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () =>
    nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.7);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Parallax muy sutil del hero (respeta prefers-reduced-motion).
const heroImg = document.querySelector('.ed-hero-frame img');
if (heroImg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.transform = `scale(1.06) translateY(${y * 0.05}px)`;
        ticking = false;
      });
    },
    { passive: true },
  );
}
