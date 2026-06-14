/**
 * Combobox editable (autocomplete) para el campo Nombre + datos compartidos.
 *
 * `loadGuestData(endpoint)` trae desde Google Sheets:
 *   - la lista de invitados (pestaña 2)
 *   - quiénes ya confirmaron (pestaña 1 de respuestas)
 * Sin conexión, usa FALLBACK_LIST como respaldo.
 *
 * `createCombobox(wrapper, opts)` conecta un wrapper con input[role=combobox]
 * a la lista. Se puede crear más de uno (acompañantes).
 */
const FALLBACK_LIST = [
  'Jose Saenz', 'Gladys Saenz', 'Adriana Cubillos', 'Andrea Saenz', 'Sara Saenz',
  'Laura Saenz', 'Gio Saenz', 'Johana', 'Bonifacio Saenz', 'Dora Murcia',
  'Viviana Saenz', 'Nicolas', 'Jessica saenz', 'Daniel Esposo', 'Miguel Saenz',
  'Diana Saenz', 'Beto Saenz', 'Carolina +', 'Daniel Saenz', 'Camilo Saenz',
  'Maria Jose', 'German Saenz', 'Marlen Murcia', 'Cristian', 'Geraldine Saenz',
  'hijo', 'Rosita Saenz', 'Carmen Saenz', 'Nubia Gordillo', 'Lucho Rojas',
  'Sebastian Rojas', 'Santiago Rojas', 'Diana Guzman', 'Gio Gordillo', 'Saray',
  'Pablito', 'Martin', 'Dona Cecilia', 'Elizabeth Ortiz', 'Nicolas Ortiz',
  'Juan David', 'Tia Maruja', 'Javier Otriz', 'Daniela Esposa+', 'Dario Alarcon',
  'Milena Alarcon', 'Javier Ortiz S', 'Clarena +', 'Julio Escobar', 'Betty Escobar',
  'Paty Saenta', 'Tefa', 'Richar Alarcon', 'Esposa+', 'Hijo+',
  'Jessica calderon', 'Sebastian Marulanda', 'Luisa Fernanda', 'Cristian Arevalo',
  'Karen Gomez', 'Valentina Marulanda', 'Sandra Garcia', 'Alicia Garcia',
  'Liliana Cubillos', 'Raul Borie', 'Jaime Cubillos', 'Sara Cubillos',
  'Malu Prieto', 'Alejandra Cubillos', 'Daniela Borie', 'Miguel Borie',
  'Sabine Borie', 'Xochilt Espinosa', 'Fernanda Iglesia', 'Juan David Velasquez',
  'Camila', 'Elias Nassar', 'Hr. Felipe', 'Hna. Leandra', 'Hno Cristian',
  'Hna Jaqueline', 'Luis Mendoza', 'Maribel +', 'Marina Quintero', 'Samuel',
  'Daniela Quintero', 'Vicente Quintero', 'Blanca Quintero', 'Horario Zapata',
  'Blanca Gallego', 'Juan José Díaz', 'Juan José Díaz (Novia)', 'Paula lenis',
  'Sebastian Varon', 'Erika Ceballos',
];

const norm = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Estado compartido (mutable: se actualiza al cargar desde la hoja).
let GUESTS = [...FALLBACK_LIST];
let CONFIRMED = new Set();
let uid = 0;

/** Carga lista de invitados + confirmados desde la hoja. No bloquea el render. */
export function loadGuestData(endpoint = '') {
  if (!endpoint) return Promise.resolve();
  return fetch(endpoint)
    .then((r) => r.json())
    .then((data) => {
      if (Array.isArray(data.names) && data.names.length > 0) GUESTS = data.names;
      if (Array.isArray(data.confirmed)) CONFIRMED = new Set(data.confirmed.map(norm));
    })
    .catch(() => { /* respaldo estático ya cargado */ });
}

export const isOnList = (name) => GUESTS.some((g) => norm(g) === norm(name));
export const isConfirmed = (name) => CONFIRMED.has(norm(name));
export const markConfirmed = (name) => CONFIRMED.add(norm(name));

/**
 * Conecta un wrapper [data-combobox] a la lista de invitados.
 * @param {HTMLElement} wrapper
 * @param {{ onChange?: (value: string) => void }} opts
 */
export function createCombobox(wrapper, { onChange = () => {} } = {}) {
  const input = wrapper.querySelector('input[role="combobox"]');
  const list = wrapper.querySelector('[role="listbox"]');
  if (!input || !list) return null;

  // IDs únicos por instancia (varios comboboxes en la misma página).
  const listId = `cb-list-${++uid}`;
  list.id = listId;
  input.setAttribute('aria-controls', listId);

  let activeIndex = -1;
  let options = [];

  const open = () => {
    if (list.hidden && options.length) {
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }
  };
  const close = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  };

  const setActive = (i) => {
    options.forEach((el) => el.classList.remove('is-active'));
    activeIndex = i;
    if (i >= 0 && options[i]) {
      const el = options[i];
      el.classList.add('is-active');
      input.setAttribute('aria-activedescendant', el.id);
      el.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  };

  const select = (value) => {
    input.value = value;
    close();
    onChange(value);
  };

  const render = () => {
    const q = norm(input.value);
    const matches = q ? GUESTS.filter((n) => norm(n).includes(q)) : GUESTS;

    list.innerHTML = '';
    options = matches.map((name, i) => {
      const li = document.createElement('li');
      li.id = `${listId}-opt-${i}`;
      li.className = 'combobox-option';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.textContent = name;
      li.addEventListener('mousedown', (e) => {
        e.preventDefault(); // evita blur antes del click
        select(name);
      });
      list.appendChild(li);
      return li;
    });
    activeIndex = -1;
    if (matches.length) open();
    else close();
  };

  input.addEventListener('focus', render);
  input.addEventListener('input', () => { render(); onChange(input.value); });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (list.hidden) render();
      if (options.length) setActive((activeIndex + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (options.length) setActive((activeIndex - 1 + options.length) % options.length);
    } else if (e.key === 'Enter') {
      if (!list.hidden && activeIndex >= 0) {
        e.preventDefault(); // selecciona en vez de enviar el formulario
        select(options[activeIndex].textContent);
      }
    } else if (e.key === 'Escape') {
      close();
    }
  });

  input.addEventListener('blur', () => setTimeout(close, 120));
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) close();
  });

  return {
    get value() { return input.value; },
    reset: () => { input.value = ''; close(); },
    focus: () => input.focus(),
  };
}
