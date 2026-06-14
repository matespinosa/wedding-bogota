/** Cuenta regresiva en vivo hasta la fecha del matrimonio. */
export function initCountdown(targetDate) {
  const root = document.getElementById('countdown');
  if (!root) return;

  const cells = {
    dias: root.querySelector('[data-unit="dias"]'),
    horas: root.querySelector('[data-unit="horas"]'),
    minutos: root.querySelector('[data-unit="minutos"]'),
    segundos: root.querySelector('[data-unit="segundos"]'),
  };

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const diff = targetDate.getTime() - Date.now();

    if (diff <= 0) {
      cells.dias.textContent = '00';
      cells.horas.textContent = '00';
      cells.minutos.textContent = '00';
      cells.segundos.textContent = '00';
      const title = document.querySelector('#fecha .section-title');
      if (title) title.textContent = '¡Hoy nos casamos!';
      clearInterval(timer);
      return;
    }

    const s = Math.floor(diff / 1000);
    cells.dias.textContent = pad(Math.floor(s / 86400));
    cells.horas.textContent = pad(Math.floor((s % 86400) / 3600));
    cells.minutos.textContent = pad(Math.floor((s % 3600) / 60));
    cells.segundos.textContent = pad(s % 60);
  }

  tick();
  const timer = setInterval(tick, 1000);
}
