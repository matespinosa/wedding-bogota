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
  let isFlipping = false;
  let navigationSteps = [0];

  function getNavigationSteps() {
    if (!pageFlip || pageFlip.getOrientation() === 'portrait') {
      return spreads.map((_, index) => index);
    }

    const steps = [0];
    for (let index = 1; index < spreads.length; index += 2) steps.push(index);
    return steps;
  }

  function renderProgress() {
    navigationSteps = getNavigationSteps();
    progressEl.replaceChildren();
    progressEl.dataset.total = String(navigationSteps.length);

    navigationSteps.forEach((pageIndex, stepIndex) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'inv-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Pliego ${stepIndex + 1} de ${navigationSteps.length}`);
      dot.addEventListener('click', () => goTo(pageIndex));
      progressEl.appendChild(dot);
    });
  }

  function getCurrentStepIndex() {
    const exactIndex = navigationSteps.indexOf(current);
    if (exactIndex >= 0) return exactIndex;
    return Math.max(0, navigationSteps.findLastIndex((pageIndex) => pageIndex <= current));
  }

  function updateControls() {
    const currentStep = getCurrentStepIndex();
    const lastStep = navigationSteps.length - 1;
    const dots = [...progressEl.querySelectorAll('.inv-dot')];

    prevBtn.disabled = currentStep === 0 || isFlipping;
    nextBtn.disabled = isFlipping;
    if (currentStep === lastStep) {
      nextBtn.innerHTML = 'Volver al inicio <span aria-hidden="true">↺</span>';
    } else {
      nextBtn.innerHTML = 'Siguiente <span aria-hidden="true">→</span>';
    }
    dots.forEach((dot, index) => {
      const active = index === currentStep;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
      dot.tabIndex = active ? 0 : -1;
    });
    progressEl.dataset.current = String(currentStep + 1);
    progressEl.setAttribute('aria-label', `Pliego ${currentStep + 1} de ${navigationSteps.length}`);
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
    const landscape = pageFlip?.getOrientation() === 'landscape';
    const visiblePages = landscape && current > 0 && current < spreads.length - 1
      ? [current, current + 1]
      : [current];

    spreads.forEach((spread, spreadIndex) => {
      const active = visiblePages.includes(spreadIndex);
      spread.classList.toggle('is-active', active);
      if (active) spread.querySelector('.spread-body')?.scrollTo?.(0, 0);
    });
    viewport.classList.toggle('is-front-cover', landscape && current === 0);
    viewport.classList.toggle('is-back-cover', landscape && current === spreads.length - 1);
    updateControls();
    visiblePages.forEach(revealSpread);
  }

  function refreshBookLayout() {
    if (!pageFlip) return;
    pageFlip.update();
    renderProgress();
    setCurrent(pageFlip.getCurrentPageIndex());
  }

  function scheduleLayoutRefresh() {
    const refreshSoon = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(refreshBookLayout);
      });
    };

    refreshSoon();
    window.addEventListener('load', refreshSoon, { once: true });
    document.fonts?.ready?.then(refreshSoon).catch(() => {});

    viewport.querySelectorAll('img').forEach((image) => {
      if (image.complete) return;
      image.addEventListener('load', refreshSoon, { once: true });
      image.addEventListener('error', refreshSoon, { once: true });
    });
  }

  function goTo(index) {
    if (!pageFlip || isFlipping || index === current || index < 0 || index >= spreads.length) return;
    isFlipping = true;
    viewport.classList.remove('is-front-cover', 'is-back-cover');
    updateControls();
    if (reduced) pageFlip.turnToPage(index);
    else pageFlip.flip(index, 'bottom');
  }

  function goToSpread(spreadName) {
    const spreadIndex = spreads.findIndex((spread) => spread.dataset.spread === spreadName);
    if (spreadIndex >= 0) goTo(spreadIndex);
  }

  function navigateBy(stepDelta) {
    const currentStep = getCurrentStepIndex();
    const targetStep = currentStep + stepDelta;
    if (targetStep >= 0 && targetStep < navigationSteps.length) goTo(navigationSteps[targetStep]);
  }

  prevBtn.addEventListener('click', () => navigateBy(-1));
  nextBtn.addEventListener('click', () => {
    const currentStep = getCurrentStepIndex();
    if (currentStep === navigationSteps.length - 1) goTo(navigationSteps[0]);
    else navigateBy(1);
  });
  viewport.querySelectorAll('[data-go-to-spread]').forEach((trigger) => {
    trigger.addEventListener('click', () => goToSpread(trigger.dataset.goToSpread));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      navigateBy(1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      navigateBy(-1);
    }
  });

  pageFlip = new PageFlip(viewport, {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 460,
    minHeight: 320,
    maxHeight: 720,
    drawShadow: !reduced,
    flippingTime: reduced ? 1 : 850,
    usePortrait: true,
    showCover: true,
    autoSize: true,
    maxShadowOpacity: 0.38,
    mobileScrollSupport: true,
    swipeDistance: 36,
    clickEventForward: true,
    showPageCorners: false,
    disableFlipByClick: false,
  });

  pageFlip.on('init', (event) => {
    renderProgress();
    setCurrent(event.data.page ?? 0);
  });
  pageFlip.on('flip', (event) => {
    isFlipping = false;
    setCurrent(event.data);
  });
  pageFlip.on('changeState', (event) => {
    isFlipping = event.data === 'flipping';
    updateControls();
  });
  pageFlip.on('changeOrientation', () => {
    // StPageFlip may change between one-page and two-page spreads on resize.
    renderProgress();
    setCurrent(pageFlip.getCurrentPageIndex());
  });
  pageFlip.loadFromHTML(spreads);
  protectInteractiveControls(viewport);
  scheduleLayoutRefresh();
}

function protectInteractiveControls(viewport) {
  // StPageFlip already forwards links and buttons. Forms need to stop the
  // gesture at their own boundary so inputs remain focusable and scrollable.
  viewport.querySelectorAll('form, .combobox').forEach((controlGroup) => {
    controlGroup.addEventListener('mousedown', (event) => event.stopPropagation());
    controlGroup.addEventListener('touchstart', (event) => event.stopPropagation(), { passive: true });
  });
}
