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

// Navegación: fondo sólido tras hacer scroll fuera del hero.
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.7);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Motas de luz WebGPU sobre el hero (degrada con elegancia si no hay soporte).
initParticles(document.getElementById('hero-canvas')).catch((err) => {
  console.warn('[hero] WebGPU no disponible, se usa solo la fotografía:', err);
});
