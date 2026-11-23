import { isSearchValid } from './travel.js';
export function searchKey(destinationId, search) {
  return [destinationId, search.departureDate, search.returnDate, Number(search.travelers)].join(
    '|',
  );
}
export function selectOption(previous, destination, search, kind, option) {
  if (
    !['flight', 'hotel'].includes(kind) ||
    !isSearchValid(search) ||
    !option?.available ||
    option.destinationId !== destination.id
  )
    return previous;
  if (
    kind === 'flight' &&
    (option.departureDate !== search.departureDate ||
      option.returnDate !== search.returnDate ||
      option.seatsAvailable < Number(search.travelers))
  )
    return previous;
  if (
    kind === 'hotel' &&
    (option.checkIn !== search.departureDate ||
      option.checkOut !== search.returnDate ||
      option.capacity < Number(search.travelers))
  )
    return previous;
  const same =
    previous &&
    searchKey(previous.destination.id, previous.search) === searchKey(destination.id, search);
  return {
    ...(same ? previous : { flight: null, hotel: null }),
    destination,
    search: { ...search },
    [kind]: { ...option },
  };
}
export function tripPath(plan) {
  const params = new URLSearchParams({
    salida: plan.search.departureDate,
    regreso: plan.search.returnDate,
    viajeros: String(plan.search.travelers),
  });
  return '/destinos/' + plan.destination.id + '?' + params.toString();
}
