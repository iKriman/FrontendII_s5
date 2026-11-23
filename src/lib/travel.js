export const TRAVEL_START = '2027-01-01';
export const TRAVEL_END = '2027-03-31';
export const DEFAULT_SEARCH = {
  departureDate: '2027-01-10',
  returnDate: '2027-01-15',
  travelers: '2',
};
export function isDate(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function nightCount(start, end) {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86400000);
}
export function validateSearch(values) {
  const errors = {};
  if (
    !isDate(values.departureDate) ||
    values.departureDate < TRAVEL_START ||
    values.departureDate > TRAVEL_END
  )
    errors.departureDate = 'Elige una salida entre enero y marzo de 2027.';
  if (
    !isDate(values.returnDate) ||
    values.returnDate < TRAVEL_START ||
    values.returnDate > TRAVEL_END
  )
    errors.returnDate = 'Elige un regreso entre enero y marzo de 2027.';
  else if (isDate(values.departureDate) && values.returnDate <= values.departureDate)
    errors.returnDate = 'El regreso debe ser posterior a la salida.';
  else if (nightCount(values.departureDate, values.returnDate) > 30)
    errors.returnDate = 'La estadía puede tener hasta 30 noches.';
  if (!/^[1-4]$/.test(String(values.travelers)))
    errors.travelers = 'Selecciona entre 1 y 4 viajeros.';
  return errors;
}
export const isSearchValid = (values) => Object.keys(validateSearch(values)).length === 0;
export function planTotal(plan) {
  if (!plan?.flight || !plan?.hotel || !isSearchValid(plan.search)) return null;
  const nights = nightCount(plan.search.departureDate, plan.search.returnDate);
  return {
    nights,
    flights: plan.flight.price * Number(plan.search.travelers),
    hotel: plan.hotel.nightlyPrice * nights,
    total: plan.flight.price * Number(plan.search.travelers) + plan.hotel.nightlyPrice * nights,
  };
}
