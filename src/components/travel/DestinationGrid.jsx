import React, { useState } from 'react';
import { useDestinations } from '../../context/DestinationsContext';
import { normalize } from '../../lib/format';
import FormField from '../FormField';
import { Loading, ServiceError, EmptyState } from '../ServiceState';
import DestinationCard from './DestinationCard';
export default function DestinationGrid({ initialSearch = '' }) {
  const { data, loading, error, reload } = useDestinations();
  const [search, setSearch] = useState(initialSearch);
  const [region, setRegion] = useState('Todos');
  const visible = data?.filter(
    (item) =>
      normalize(item.name + ' ' + item.country + ' ' + item.activities.join(' ')).includes(
        normalize(search),
      ) &&
      (region === 'Todos' || item.region === region),
  );
  return (
    <>
      <div className="mb-7 grid items-end gap-4 sm:grid-cols-[1fr_220px]">
        <FormField id="destination-search" label="Buscar destino o actividad">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Patagonia, playas, cultura…"
          />
        </FormField>
        <FormField id="region" label="Región">
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>Todos</option>
            <option>Chile</option>
            <option>Sudamérica</option>
          </select>
        </FormField>
      </div>
      {error && <ServiceError message={error} onRetry={reload} loading={loading} />}{' '}
      {loading && !data && <Loading label="Buscando destinos para tu próximo viaje…" />}
      {loading && data && (
        <p role="status" className="mb-4 text-xs text-muted">
          Actualizando destinos…
        </p>
      )}
      {data && (
        <>
          {visible.length ? (
            <>
              <p role="status" className="mb-4 text-xs text-muted">
                {visible.length} destinos para descubrir
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>
            </>
          ) : (
            <>
              <EmptyState
                title="No encontramos destinos"
                description={
                  data.length
                    ? 'Prueba otro nombre o actividad.'
                    : 'Aún no hay destinos publicados. Puedes volver a consultar.'
                }
              />
              <button
                className="button-secondary mt-4"
                onClick={() => {
                  if (data.length) {
                    setSearch('');
                    setRegion('Todos');
                  } else reload();
                }}
              >
                {data.length ? 'Limpiar filtros' : 'Volver a consultar'}
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}
