import gsap from 'gsap';

const SWIPE_THRESHOLD = 56;
const SWIPE_MAX_VERTICAL = 80;

/** Navegación pliego a pliego con animaciones GSAP tipo pasar página. */
export function initInvitationNav() {
  const viewport = document.getElementById('invitation-viewport');
  const prevBtn = document.getElementById('inv-prev');
  const nextBtn = document.getElementById('inv-next');
  const progressEl = document.getElementById('inv-progress');
  if (!viewport || !prevBtn || !nextBtn || !progressEl) return;

  const spreads = [...viewport.querySelectorAll('.spread')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact = matchMedia('(max-width: 760px)').matches;
  let current = 0;
  let animating = false;

  ensurePageShadow(viewport);

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

  function getScrollableBody(spread) {
    return spread.querySelector('.spread-body');
  }

  function revealSpread(index) {
    const spread = spreads[index];
    const items = spread.querySelectorAll('.anim-item');

    if (reduced || items.length === 0) return Promise.resolve();

    gsap.set(items, { clearProps: 'opacity,transform' });
    return gsap.from(items, {
      opacity: 0,
      y: 18,
      duration: compact ? 0.5 : 0.62,
      stagger: compact ? 0.05 : 0.07,
      ease: 'power2.out',
      delay: 0.08,
    });
  }

  function resetSpread(spread) {
    spread.classList.remove('is-active', 'is-leaving', 'is-entering');
    gsap.set(spread, { clearProps: 'all' });
  }

  function instantSwap(outgoing, incoming) {
    outgoing.classList.remove('is-active');
    outgoing.hidden = true;
    resetSpread(outgoing);

    incoming.hidden = false;
    incoming.classList.add('is-active');
  }

  function animatePageTurn(outgoing, incoming, direction) {
    const duration = compact ? 0.62 : 0.78;
    const outOrigin = direction > 0 ? 'left center' : 'right center';
    const inOrigin = direction > 0 ? 'right center' : 'left center';
    const outRotate = direction > 0 ? -78 : 78;
    const inStart = direction > 0 ? 78 : -78;

    outgoing.classList.remove('is-active');
    outgoing.classList.add('is-leaving');
    incoming.hidden = false;
    incoming.classList.add('is-entering');
    viewport.classList.add('is-turning');

    gsap.set(outgoing, {
      zIndex: 3,
      transformOrigin: outOrigin,
      rotationY: 0,
      x: 0,
      opacity: 1,
      visibility: 'visible',
      pointerEvents: 'none',
    });

    gsap.set(incoming, {
      zIndex: 2,
      transformOrigin: inOrigin,
      rotationY: inStart,
      x: 0,
      opacity: 0.72,
      visibility: 'visible',
      pointerEvents: 'none',
    });

    const shadow = viewport.querySelector('.page-turn-shadow');
    if (shadow) gsap.set(shadow, { opacity: 0.22 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut', transformPerspective: 1200 },
    });

    tl.to(
      outgoing,
      {
        rotationY: outRotate,
        x: direction * (compact ? -18 : -28),
        opacity: 0,
        duration,
      },
      0,
    )
      .to(
        incoming,
        {
          rotationY: 0,
          x: 0,
          opacity: 1,
          duration,
        },
        0.06,
      )
      .to(
        shadow,
        {
          opacity: 0,
          duration: duration * 0.85,
        },
        0.1,
      );

    return tl;
  }

  async function goTo(index) {
    if (animating || index === current || index < 0 || index >= spreads.length) return;

    animating = true;
    const direction = index > current ? 1 : -1;
    const outgoing = spreads[current];
    const incoming = spreads[index];

    updateControls();

    if (reduced) {
      instantSwap(outgoing, incoming);
    } else {
      await animatePageTurn(outgoing, incoming, direction);

      outgoing.classList.remove('is-active', 'is-leaving');
      outgoing.hidden = true;
      resetSpread(outgoing);

      incoming.classList.remove('is-entering');
      incoming.classList.add('is-active');
      gsap.set(incoming, { clearProps: 'transform,opacity,zIndex,transformOrigin,visibility,pointerEvents' });
      viewport.classList.remove('is-turning');
    }

    current = index;
    getScrollableBody(incoming)?.scrollTo?.(0, 0);
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

      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      if (Math.abs(dy) > SWIPE_MAX_VERTICAL) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.2) return;

      const body = getScrollableBody(spreads[current]);
      if (body && body.scrollHeight > body.clientHeight + 8) {
        const atTop = body.scrollTop <= 4;
        const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 4;
        if (dx < 0 && !atBottom) return;
        if (dx > 0 && !atTop) return;
      }

      if (dx < -SWIPE_THRESHOLD && current < spreads.length - 1) goTo(current + 1);
      if (dx > SWIPE_THRESHOLD && current > 0) goTo(current - 1);
    },
    { passive: true },
  );

  updateControls();
  revealSpread(0);
}

function ensurePageShadow(viewport) {
  if (viewport.querySelector('.page-turn-shadow')) return;
  const shadow = document.createElement('div');
  shadow.className = 'page-turn-shadow';
  shadow.setAttribute('aria-hidden', 'true');
  viewport.appendChild(shadow);
}
