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
initSectionMotion();

// Navegación: fondo sólido tras hacer scroll fuera del hero.
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.7);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Motas de luz WebGPU sobre el hero (degrada con elegancia si no hay soporte).
initParticles(document.getElementById('hero-canvas')).catch((err) => {
  console.warn('[hero] WebGPU no disponible, se usa solo la fotografía:', err);
});

function initSectionMotion() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sections = [
    ...document.querySelectorAll('.date-band, .story, .gran-dia, .dress-code, .rsvp, .detail-band, .footer'),
  ];
  if (!sections.length) return;

  sections.forEach((section, index) => {
    section.classList.add('motion-section');
    section.style.setProperty('--section-direction', index % 2 === 0 ? '-1' : '1');
  });

  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -160 || rect.top > viewportHeight + 160) continue;

      const exitProgress = rect.top < 0
        ? Math.min(1, Math.abs(rect.top) / Math.max(rect.height * 0.58, 1))
        : 0;
      const direction = Number(section.style.getPropertyValue('--section-direction')) || 1;
      const opacity = 1 - exitProgress * 0.38;
      const blur = exitProgress * 7;
      const x = exitProgress * direction * -28;

      section.style.setProperty('--section-exit-opacity', opacity.toFixed(3));
      section.style.setProperty('--section-exit-blur', `${blur.toFixed(2)}px`);
      section.style.setProperty('--section-exit-x', `${x.toFixed(1)}px`);
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
