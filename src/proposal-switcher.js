/** Catálogo de propuestas disponibles. */
export const PROPOSALS = [
  {
    id: 'main',
    href: '/',
    title: 'Propuesta 1',
    subtitle: 'Bosque & Papel',
    description: 'Invitación ceremonial con scroll vertical',
  },
  {
    id: 'propuesta2',
    href: '/propuesta-2.html',
    title: 'Propuesta 2',
    subtitle: 'Editorial moderno',
    description: 'Estilo revista con tipografía Bodoni',
  },
  {
    id: 'invitacion',
    href: '/invitacion.html',
    title: 'Invitación interactiva',
    subtitle: 'Pliego a pliego',
    description: 'Recorre la invitación como una carta',
  },
];

/**
 * Botón flotante + popover para cambiar entre propuestas.
 * @param {{ current?: string }} options  id de la propuesta activa
 */
export function initProposalSwitcher({ current } = {}) {
  const mount = document.getElementById('proposal-switcher-mount');
  if (!mount) return;

  const activeId = current ?? mount.dataset.current ?? detectCurrentId();
  mount.innerHTML = buildMarkup(activeId);
  mount.classList.add('proposal-switcher');

  const fab = mount.querySelector('.proposal-switcher__fab');
  const popover = mount.querySelector('.proposal-switcher__popover');
  const backdrop = mount.querySelector('.proposal-switcher__backdrop');
  if (!fab || !popover || !backdrop) return;

  const close = () => {
    popover.hidden = true;
    backdrop.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
  };

  const open = () => {
    popover.hidden = false;
    backdrop.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    popover.querySelector('.proposal-switcher__item.is-current a')?.focus();
  };

  const toggle = () => {
    if (popover.hidden) open();
    else close();
  };

  fab.addEventListener('click', (event) => {
    event.stopPropagation();
    toggle();
  });

  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !popover.hidden) close();
  });

  document.addEventListener('click', (event) => {
    if (!mount.contains(event.target)) close();
  });
}

function detectCurrentId() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path.endsWith('propuesta-2.html')) return 'propuesta2';
  if (path.endsWith('invitacion.html')) return 'invitacion';
  return 'main';
}

function buildMarkup(activeId) {
  const items = PROPOSALS.map((proposal) => {
    const isCurrent = proposal.id === activeId;
    return `
      <li class="proposal-switcher__item${isCurrent ? ' is-current' : ''}" role="none">
        <a
          class="proposal-switcher__link"
          href="${proposal.href}"
          role="menuitem"
          ${isCurrent ? 'aria-current="page"' : ''}
        >
          <span class="proposal-switcher__link-title">${proposal.title}</span>
          <span class="proposal-switcher__link-sub">${proposal.subtitle}</span>
          <span class="proposal-switcher__link-desc">${proposal.description}</span>
          ${isCurrent ? '<span class="proposal-switcher__badge">Actual</span>' : ''}
        </a>
      </li>
    `;
  }).join('');

  return `
    <button
      type="button"
      class="proposal-switcher__fab"
      aria-haspopup="true"
      aria-expanded="false"
      aria-controls="proposal-switcher-menu"
      aria-label="Cambiar propuesta de invitación"
    >
      <svg class="proposal-switcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </button>
    <div class="proposal-switcher__backdrop" hidden></div>
    <div
      class="proposal-switcher__popover"
      id="proposal-switcher-menu"
      role="menu"
      aria-label="Propuestas de invitación"
      hidden
    >
      <header class="proposal-switcher__head">
        <p class="proposal-switcher__eyebrow">Cambiar vista</p>
        <h2 class="proposal-switcher__title">Propuestas</h2>
      </header>
      <ul class="proposal-switcher__list" role="none">
        ${items}
      </ul>
    </div>
  `;
}
