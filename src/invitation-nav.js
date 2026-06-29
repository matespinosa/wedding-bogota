import gsap from 'gsap';

const SWIPE_THRESHOLD = 56;
const SWIPE_MAX_VERTICAL = 80;

/** Navegación pliego a pliego con animaciones GSAP. */
export function initInvitationNav() {
  const viewport = document.getElementById('invitation-viewport');
  const prevBtn = document.getElementById('inv-prev');
  const nextBtn = document.getElementById('inv-next');
  const progressEl = document.getElementById('inv-progress');
  if (!viewport || !prevBtn || !nextBtn || !progressEl) return;

  const spreads = [...viewport.querySelectorAll('.spread')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let animating = false;

  spreads.forEach((spread, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'inv-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Pliego ${index + 1} de ${spreads.length}`);
    dot.addEventListener('click', () => goTo(index));
    progressEl.appendChild(dot);
  });

  const dots = [...progressEl.querySelectorAll('.inv-dot')];

  function updateControls() {
    prevBtn.disabled = current === 0 || animating;
    if (current === spreads.length - 1) {
      nextBtn.innerHTML = 'Volver al inicio <span aria-hidden="true">↺</span>';
    } else {
      nextBtn.innerHTML = 'Siguiente <span aria-hidden="true">→</span>';
    }
    dots.forEach((dot, index) => {
      const active = index === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
      dot.tabIndex = active ? 0 : -1;
    });
  }

  function revealSpread(index) {
    const spread = spreads[index];
    const items = spread.querySelectorAll('.anim-item');

    if (reduced || items.length === 0) return Promise.resolve();

    gsap.set(items, { clearProps: 'all' });
    return gsap.from(items, {
      opacity: 0,
      y: 22,
      duration: 0.65,
      stagger: 0.07,
      ease: 'power2.out',
      delay: 0.05,
    });
  }

  async function goTo(index) {
    if (animating || index === current || index < 0 || index >= spreads.length) return;

    animating = true;
    const direction = index > current ? 1 : -1;
    const outgoing = spreads[current];
    const incoming = spreads[index];

    updateControls();

    if (reduced) {
      outgoing.classList.remove('is-active');
      outgoing.hidden = true;
      incoming.hidden = false;
      incoming.classList.add('is-active');
    } else {
      await gsap.to(outgoing, {
        opacity: 0,
        x: direction * -40,
        duration: 0.42,
        ease: 'power2.in',
      });

      outgoing.classList.remove('is-active');
      outgoing.hidden = true;
      gsap.set(outgoing, { clearProps: 'all' });

      incoming.hidden = false;
      incoming.classList.add('is-active');
      gsap.set(incoming, { opacity: 0, x: direction * 40 });

      await gsap.to(incoming, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    current = index;
    incoming.querySelector('.spread-body--rsvp, .spread-body')?.scrollTo?.(0, 0);
    await revealSpread(index);

    animating = false;
    updateControls();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => {
    if (current === spreads.length - 1) goTo(0);
    else goTo(current + 1);
  });

  window.addEventListener('keydown', (event) => {
    if (animating) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      if (current < spreads.length - 1) goTo(current + 1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      if (current > 0) goTo(current - 1);
    }
  });

  let touchStartX = 0;
  let touchStartY = 0;

  viewport.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    },
    { passive: true },
  );

  viewport.addEventListener(
    'touchend',
    (event) => {
      if (animating) return;
      const dx = event.changedTouches[0].clientX - touchStartX;
      const dy = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dy) > SWIPE_MAX_VERTICAL) return;
      if (dx < -SWIPE_THRESHOLD && current < spreads.length - 1) goTo(current + 1);
      if (dx > SWIPE_THRESHOLD && current > 0) goTo(current - 1);
    },
    { passive: true },
  );

  updateControls();
  revealSpread(0);
}
