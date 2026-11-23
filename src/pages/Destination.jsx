import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { useDestinations } from '../context/DestinationsContext';
import { useTrip } from '../context/TripContext';
import { useTravelOptions } from '../hooks/useTravelOptions';
import { DEFAULT_SEARCH, isSearchValid } from '../lib/travel';
import { searchKey } from '../lib/plan';
import DestinationScene from '../components/travel/DestinationScene';
import TripSearch from '../components/travel/TripSearch';
import FlightCard from '../components/travel/FlightCard';
import HotelCard from '../components/travel/HotelCard';
import PlanPreview from '../components/travel/PlanPreview';
import { Loading, ServiceError, EmptyState } from '../components/ServiceState';
export default function Destination() {
  const { destinationId } = useParams();
  const [params, setParams] = useSearchParams();
  const destinations = useDestinations();
  const { plan, choose, changeSearch } = useTrip();
  const destination = destinations.data?.find((item) => item.id === destinationId);
  const search = {
    departureDate: params.get('salida') || DEFAULT_SEARCH.departureDate,
    returnDate: params.get('regreso') || DEFAULT_SEARCH.returnDate,
    travelers: params.get('viajeros') || DEFAULT_SEARCH.travelers,
  };
  const query = useTravelOptions(
    destinationId,
    search,
    Boolean(destination) && isSearchValid(search),
  );
  const same =
    plan &&
    destination &&
    searchKey(plan.destination.id, plan.search) === searchKey(destination.id, search);
  function apply(values) {
    changeSearch(destination, values);
    setParams({
      salida: values.departureDate,
      regreso: values.returnDate,
      viajeros: String(values.travelers),
    });
  }
  return (
    <section className="page-width pb-5 pt-8">
      <Link className="back-link" to="/destinos">
        ← Todos los destinos
      </Link>
      {destinations.error && (
        <div className="mt-6">
          <ServiceError
            message={destinations.error}
            onRetry={destinations.reload}
            loading={destinations.loading}
          />
        </div>
      )}
      {destinations.loading && !destination && (
        <div className="mt-6">
          <Loading label="Buscando el destino…" />
        </div>
      )}
      {!destinations.loading && !destinations.error && !destination && (
        <div className="mt-8">
          <EmptyState
            title="No encontramos este destino"
            description="Vuelve al catálogo para explorar los destinos disponibles."
          />
        </div>
      )}
      {destination && (
        <>
          <div className="my-7 grid items-center gap-7 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="eyebrow">{destination.country.toUpperCase()} · EXPLORA A TU RITMO</p>
              <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {destination.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
                {destination.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {destination.activities.map((activity) => (
                  <span
                    key={activity}
                    className="rounded-full border border-line bg-white px-3 py-2 text-[10px] text-forest"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
            <DestinationScene scene={destination.scene} className="h-48 w-full rounded-xl" />
          </div>
          <TripSearch search={search} onApply={apply} loading={query.loading} />
          <div className="my-7 flex flex-wrap gap-4 text-xs">
            <a
              className="text-forest underline underline-offset-4"
              href="#vuelos"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('vuelos')?.scrollIntoView();
              }}
            >
              Ver vuelos ↓
            </a>
            <a
              className="text-forest underline underline-offset-4"
              href="#hoteles"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('hoteles')?.scrollIntoView();
              }}
            >
              Ver hoteles ↓
            </a>
          </div>
          {query.error && (
            <ServiceError message={query.error} onRetry={query.refresh} loading={query.loading} />
          )}
          {query.loading && <Loading label="Consultando vuelos y hoteles para estas fechas…" />}
          {query.data && !query.loading && (
            <>
              <section id="vuelos" className="mt-9 scroll-mt-6">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">IDA Y VUELTA DESDE SANTIAGO</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-ink">
                      Elige cómo llegar.
                    </h2>
                  </div>
                  <span className="text-xs text-muted">
                    {query.data.flights?.length || 0} opciones de vuelo
                  </span>
                </div>
                {query.data.flights?.length ? (
                  <div className="grid gap-5 lg:grid-cols-3">
                    {query.data.flights.map((flight) => (
                      <FlightCard
                        key={flight.id}
                        flight={flight}
                        travelers={search.travelers}
                        selected={Boolean(same && plan.flight?.id === flight.id)}
                        onSelect={() => choose(destination, search, 'flight', flight)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title={
                      query.data.flights === null
                        ? 'No pudimos cargar los vuelos'
                        : 'Sin vuelos para estas fechas'
                    }
                    description="Prueba otro destino o modifica las fechas de tu búsqueda."
                  />
                )}
              </section>
              <section id="hoteles" className="mt-10 scroll-mt-6">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">{query.data.nights} NOCHES PARA DISFRUTAR</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-ink">
                      Encuentra dónde quedarte.
                    </h2>
                  </div>
                  <span className="text-xs text-muted">
                    {query.data.hotels?.length || 0} opciones de hotel
                  </span>
                </div>
                {query.data.hotels?.length ? (
                  <div className="grid gap-5 lg:grid-cols-3">
                    {query.data.hotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        selected={Boolean(same && plan.hotel?.id === hotel.id)}
                        onSelect={() => choose(destination, search, 'hotel', hotel)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title={
                      query.data.hotels === null
                        ? 'No pudimos cargar los hoteles'
                        : 'Sin hoteles para estas fechas'
                    }
                    description="Puedes consultar otras fechas o explorar otro destino."
                  />
                )}
              </section>
            </>
          )}
          {!isSearchValid(search) && (
            <p role="alert" className="mt-6 text-sm text-red-800">
              Corrige los datos de búsqueda para consultar las opciones.
            </p>
          )}
          <PlanPreview destination={destination} search={search} />
        </>
      )}
    </section>
  );
}
