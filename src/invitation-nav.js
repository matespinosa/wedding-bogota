import { PageFlip } from 'page-flip';
import 'page-flip/src/Style/stPageFlip.css';
import gsap from 'gsap';

const PAGE_WIDTH = 390;
const PAGE_HEIGHT = 620;

/** Navegación de libro con StPageFlip + entrada de contenido con GSAP. */
export function initInvitationNav() {
  const viewport = document.getElementById('invitation-viewport');
  const prevBtn = document.getElementById('inv-prev');
  const nextBtn = document.getElementById('inv-next');
  const progressEl = document.getElementById('inv-progress');
  if (!viewport || !prevBtn || !nextBtn || !progressEl) return;

  const spreads = [...viewport.querySelectorAll('.spread')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let pageFlip = null;

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
    prevBtn.disabled = current === 0;
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

    gsap.set(items, { clearProps: 'opacity,transform' });
    return gsap.from(items, {
      opacity: 0,
      y: 18,
      duration: 0.55,
      stagger: 0.055,
      ease: 'power2.out',
      delay: 0.04,
    });
  }

  function setCurrent(index) {
    if (index < 0 || index >= spreads.length) return;
    current = index;
    spreads.forEach((spread, spreadIndex) => {
      spread.classList.toggle('is-active', spreadIndex === current);
      if (spreadIndex === current) spread.querySelector('.spread-body')?.scrollTo?.(0, 0);
    });
    updateControls();
    revealSpread(index);
  }

  function goTo(index) {
    if (!pageFlip || index === current || index < 0 || index >= spreads.length) return;
    if (reduced) pageFlip.turnToPage(index);
    else pageFlip.flip(index, 'bottom');
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

  pageFlip = new PageFlip(viewport, {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    size: 'stretch',
    minWidth: 300,
    maxWidth: 460,
    minHeight: 460,
    maxHeight: 720,
    drawShadow: !reduced,
    flippingTime: reduced ? 1 : 850,
    usePortrait: true,
    showCover: true,
    autoSize: false,
    maxShadowOpacity: 0.38,
    mobileScrollSupport: true,
    swipeDistance: 36,
    clickEventForward: true,
    showPageCorners: false,
    disableFlipByClick: false,
  });

  pageFlip.on('init', (event) => setCurrent(event.data.page ?? 0));
  pageFlip.on('flip', (event) => setCurrent(event.data));
  pageFlip.on('changeOrientation', () => {
    // StPageFlip may change between one-page and two-page spreads on resize.
    setCurrent(pageFlip.getCurrentPageIndex());
  });
  pageFlip.loadFromHTML(spreads);
  protectInteractiveControls(viewport);
  updateControls();
}

function protectInteractiveControls(viewport) {
  const selector = 'a, button, input, select, textarea, label, .combobox, .combobox-list';
  const stopWhenInteractive = (event) => {
    if (event.target instanceof Element && event.target.closest(selector)) {
      event.stopPropagation();
    }
  };

  viewport.addEventListener('mousedown', stopWhenInteractive, true);
  viewport.addEventListener('touchstart', stopWhenInteractive, true);
}
