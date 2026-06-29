/**
 * Invitación interactiva — Mateo & Julieth
 * Experiencia pliego a pliego basada en la propuesta botánica.
 */
import { initInvitationNav } from './invitation-nav.js';
import { initCountdown } from './countdown.js';
import { loadGuestData } from './combobox.js';
import { initRsvp } from './rsvp.js';

const WEDDING_DATE = new Date('2026-10-03T16:00:00-05:00');
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyBBA0C4XRj9DaHfyZIt_JEfAUr8lkMNuV-8TBKR7OJIVIrr9q98fDEQyO5EWFiv0tgmA/exec';

initInvitationNav();
initCountdown(WEDDING_DATE);
loadGuestData(ENDPOINT);
initRsvp(ENDPOINT);
