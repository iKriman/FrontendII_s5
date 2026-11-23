import { useQuery } from '@apollo/client/react';
import { TRAVEL_OPTIONS } from '../api/graphql';
import { validOptions } from '../api/contracts';
export function useTravelOptions(destinationId, search, enabled) {
  const result = useQuery(TRAVEL_OPTIONS, {
    variables: {
      destinationId,
      departureDate: search.departureDate,
      returnDate: search.returnDate,
      travelers: Number(search.travelers),
    },
    skip: !enabled,
  });
  const raw = result.data?.travelOptions;
  const matching =
    raw &&
    validOptions(raw) &&
    raw.destinationId === destinationId &&
    raw.departureDate === search.departureDate &&
    raw.returnDate === search.returnDate &&
    raw.travelers === Number(search.travelers);
  const error = result.error
    ? result.error.errors?.map((item) => item.message).join(' ') ||
      'No pudimos consultar vuelos y hoteles. Revisa la conexión y vuelve a intentarlo.'
    : raw && !matching
      ? 'La información recibida no corresponde a esta búsqueda. Inténtalo nuevamente.'
      : !result.loading && enabled && result.data && !raw
        ? 'No encontramos opciones para este destino.'
        : null;
  return {
    data: matching ? raw : null,
    loading: result.loading,
    error,
    refresh: () => {
      void result.refetch().catch(() => {});
    },
  };
}
