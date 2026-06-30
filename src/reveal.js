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

  prepareRevealChildren(items);

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
          revealItem(entry.target);
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
  setTimeout(() => items.forEach(revealItem), 2500);
}

function prepareRevealChildren(items) {
  for (const item of items) {
    const children = getRevealChildren(item);
    children.forEach((child, index) => {
      child.classList.add('reveal-child');
      child.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`);
    });
  }
}

function revealItem(item) {
  item.classList.remove('is-hidden');
  item.classList.add('is-visible');
}

function getRevealChildren(item) {
  const direct = [...item.children].filter((child) => {
    if (child.tagName === 'TEMPLATE') return false;
    if (child.matches('script, style')) return false;
    return child.nodeType === Node.ELEMENT_NODE;
  });

  if (direct.length > 1) return direct;

  const nested = direct[0] ? [...direct[0].children].filter((child) => child.tagName !== 'TEMPLATE') : [];
  return nested.length > 1 ? nested : direct;
}
