/**
 * Formulario de confirmación (RSVP) — multi-invitado.
 *
 * - Una persona puede confirmar para varias, pero CADA nombre debe estar en la
 *   lista de invitados (los acompañantes se eligen del combobox).
 * - Si un nombre ya confirmó, se avisa y no se reenvía.
 * - Teléfono y asistencia se comparten para todo el grupo.
 *
 * Las confirmaciones se envían a Google Sheets (una fila por persona) y se
 * guardan en localStorage como respaldo.
 */
import { createCombobox, isOnList, isConfirmed, markConfirmed } from './combobox.js';

/** @param {string} endpoint  URL del Apps Script /exec */
export function initRsvp(endpoint = '') {
  const form = document.getElementById('rsvp-form');
  const note = document.getElementById('form-note');
  const guestsEl = document.getElementById('guests');
  const addBtn = document.getElementById('add-guest');
  const tpl = document.getElementById('guest-tpl');
  if (!form || !note || !guestsEl || !addBtn || !tpl) return;

  const button = form.querySelector('button[type="submit"]');
  const entries = []; // { el, msg, combobox }

  const setNote = (text, state = '') => {
    note.textContent = text;
    note.className = `form-note${state ? ' ' + state : ''}`;
  };

  /** Mensaje en línea por persona (ya confirmó / no está en la lista). */
  const updateEntryMsg = (entry, value) => {
    const name = value.trim();
    entry.msg.className = 'guest-msg';
    if (!name) { entry.msg.textContent = ''; return; }
    if (isConfirmed(name)) {
      entry.msg.textContent = '✓ Esta persona ya confirmó su asistencia.';
      entry.msg.classList.add('is-confirmed');
    } else if (!isOnList(name)) {
      entry.msg.textContent = 'Este nombre no está en la lista de invitados.';
      entry.msg.classList.add('is-error');
    } else {
      entry.msg.textContent = '';
    }
  };

  const addEntry = (removable) => {
    const frag = tpl.content.cloneNode(true);
    const el = frag.querySelector('.guest-entry');
    const wrapper = frag.querySelector('[data-combobox]');
    const msg = frag.querySelector('.guest-msg');
    const removeBtn = frag.querySelector('.guest-remove');

    const entry = { el, msg, combobox: null };
    entry.combobox = createCombobox(wrapper, {
      onChange: (val) => updateEntryMsg(entry, val),
    });

    if (removable) {
      removeBtn.hidden = false;
      removeBtn.addEventListener('click', () => {
        const i = entries.indexOf(entry);
        if (i >= 0) entries.splice(i, 1);
        el.remove();
      });
    }

    guestsEl.appendChild(frag);
    entries.push(entry);
    return entry;
  };

  // Primera persona (no se puede quitar).
  addEntry(false);
  addBtn.addEventListener('click', () => {
    const last = entries[entries.length - 1];
    if (!last?.combobox.value.trim()) {
      last?.combobox.focus();
      return;
    }
    const entry = addEntry(true);
    entry.combobox?.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const names = entries.map((en) => en.combobox.value.trim()).filter(Boolean);

    if (names.length === 0 || !data.telefono?.trim() || !data.asistencia) {
      setNote('Completa al menos un nombre, el teléfono y si nos acompañas.', 'is-error');
      return;
    }

    // Cada nombre debe estar en la lista de invitados.
    const notListed = names.filter((n) => !isOnList(n));
    if (notListed.length) {
      setNote(
        `No está en la lista de invitados: ${notListed.join(', ')}. Solo las personas registradas podrán asistir.`,
        'is-error',
      );
      return;
    }

    // No reenviar a quien ya confirmó.
    const already = names.filter((n) => isConfirmed(n));
    if (already.length) {
      setNote(
        `Ya había(n) confirmado: ${already.join(', ')}. Puedes quitar ese nombre del formulario.`,
        'is-error',
      );
      return;
    }

    const record = {
      nombres: names,
      nombre: names.join(', '), // compatibilidad
      telefono: data.telefono.trim(),
      asistencia: data.asistencia,
      ts: new Date().toISOString(),
    };

    // Respaldo local (siempre).
    try {
      const all = JSON.parse(localStorage.getItem('rsvp') || '[]');
      all.push(record);
      localStorage.setItem('rsvp', JSON.stringify(all));
    } catch {
      /* almacenamiento no disponible: no es crítico */
    }

    // Envío a la hoja (si está configurada).
    if (endpoint) {
      button.disabled = true;
      setNote('Enviando…');
      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors', // Apps Script no devuelve CORS; el envío sí se registra
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(record),
        });
      } catch {
        /* el respaldo local ya quedó guardado */
      } finally {
        button.disabled = false;
      }
    }

    names.forEach(markConfirmed);

    const first = names[0].split(' ')[0];
    setNote(
      data.asistencia === 'si'
        ? `¡Gracias, ${first}! ${names.length > 1 ? 'Los esperamos' : 'Nos vemos'} el 3 de octubre. 🥂`
        : 'Gracias por avisarnos. Te vamos a extrañar 💛',
      'is-ok',
    );

    // Reset: conservar solo la primera persona, vacía.
    form.reset();
    const [firstEntry, ...rest] = entries;
    rest.forEach((en) => en.el.remove());
    entries.length = 0;
    entries.push(firstEntry);
    firstEntry.combobox.reset();
    firstEntry.msg.textContent = '';
    firstEntry.msg.className = 'guest-msg';
  });
}
