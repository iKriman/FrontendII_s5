export const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export const currency = (amount) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
export const shortDate = (value) =>
  new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value + 'T12:00:00Z'));
export const duration = (minutes) =>
  Math.floor(minutes / 60) + ' h ' + String(minutes % 60).padStart(2, '0') + ' min';
