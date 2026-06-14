/**
 * Aparición suave al hacer scroll.
 *
 * El contenido es visible por defecto. Solo ocultamos (`is-hidden`) lo que
 * está claramente debajo del pliegue al cargar, y lo revelamos al entrar en
 * el viewport. Un timeout de seguridad garantiza que nada quede oculto, aun
 * si el observador no dispara (pestaña en segundo plano, render headless…).
 */
export function initReveal() {
  const items = [...document.querySelectorAll('.reveal')];
  if (!items.length) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return; // todo queda visible

  // Oculta solo lo que está bajo el pliegue al cargar.
  for (const el of items) {
    if (el.getBoundingClientRect().top > window.innerHeight * 0.85) {
      el.classList.add('is-hidden');
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-hidden');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  for (const el of items) {
    if (el.classList.contains('is-hidden')) observer.observe(el);
  }

  // Red de seguridad: nunca dejar contenido oculto.
  setTimeout(() => items.forEach((el) => el.classList.remove('is-hidden')), 2500);
}
