import React from 'react';
import { Link } from 'react-router';
import { useTrip } from '../context/TripContext';
import { tripPath } from '../lib/plan';
import { planTotal } from '../lib/travel';
import { currency, shortDate } from '../lib/format';
import DestinationScene from '../components/travel/DestinationScene';
export default function MyTrip() {
  const { plan, clearPlan } = useTrip();
  const total = planTotal(plan);
  return (
    <section className="page-width pt-12">
      <p className="eyebrow">UN PRIMER PASO HACIA TU PRÓXIMA HISTORIA</p>
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Mi plan de viaje.</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        Revisa tu selección y el costo estimado. Tu plan se mantiene mientras navegas por esta
        sesión.
      </p>
      {!plan ? (
        <div className="panel mt-8 py-16 text-center">
          <span aria-hidden="true" className="text-5xl text-forest">
            ↗
          </span>
          <h2 className="mt-5 text-xl font-semibold">Tu próximo rumbo está por elegir.</h2>
          <p className="mt-3 text-sm text-muted">
            Explora un destino y selecciona un vuelo y un hotel.
          </p>
          <Link className="button-primary mt-6" to="/destinos">
            Explorar destinos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-7 lg:grid-cols-[1.5fr_1fr]">
          <section className="panel overflow-hidden">
            <DestinationScene scene={plan.destination.scene} className="h-52 w-full" />
            <div className="p-6">
              <p className="eyebrow">{plan.destination.country}</p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                {plan.destination.name}
              </h2>
              <p className="mt-3 text-sm text-muted">
                {shortDate(plan.search.departureDate)} → {shortDate(plan.search.returnDate)} ·{' '}
                {plan.search.travelers} viajeros
              </p>
              <div className="mt-6 divide-y divide-line">
                <article className="py-5">
                  <h3 className="text-sm font-semibold text-forest">✈ Vuelo de ida y vuelta</h3>
                  <p className="mt-2 text-sm text-muted">
                    {plan.flight
                      ? plan.flight.airline +
                        ' · ' +
                        plan.flight.origin +
                        ' → ' +
                        plan.flight.arrival
                      : 'Aún no elegiste un vuelo.'}
                  </p>
                  {plan.flight && (
                    <p className="mt-2 text-xs text-muted">
                      {currency(plan.flight.price)} por persona · Salida {plan.flight.departureTime}
                    </p>
                  )}
                </article>
                <article className="py-5">
                  <h3 className="text-sm font-semibold text-forest">⌂ Alojamiento</h3>
                  <p className="mt-2 text-sm text-muted">
                    {plan.hotel
                      ? plan.hotel.name + ' · ' + plan.hotel.stars + ' estrellas'
                      : 'Aún no elegiste un hotel.'}
                  </p>
                  {plan.hotel && (
                    <p className="mt-2 text-xs text-muted">
                      {currency(plan.hotel.nightlyPrice)} por habitación y noche · Hasta{' '}
                      {plan.hotel.capacity} personas
                    </p>
                  )}
                </article>
              </div>
              <Link to={tripPath(plan)} className="button-secondary mt-4">
                Cambiar mi selección
              </Link>
            </div>
          </section>
          <aside className="panel p-6">
            <h2 className="text-lg font-semibold text-ink">Resumen estimado</h2>
            {total ? (
              <dl className="mt-6 space-y-5 text-sm">
                <div className="flex justify-between gap-5">
                  <dt className="text-muted">Vuelos · {plan.search.travelers} personas</dt>
                  <dd>{currency(total.flights)}</dd>
                </div>
                <div className="flex justify-between gap-5">
                  <dt className="text-muted">Hotel · {total.nights} noches</dt>
                  <dd>{currency(total.hotel)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-5 text-xl font-semibold text-forest">
                  <dt>Total</dt>
                  <dd>{currency(total.total)}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-sm leading-7 text-muted">
                Selecciona un vuelo y un hotel para ver el total estimado del viaje.
              </p>
            )}
            <p className="mt-6 text-xs leading-6 text-muted">
              Precios simulados en pesos chilenos. Incluyen el vuelo de ida y vuelta por viajero y
              una habitación para el grupo durante la estadía. Este plan no confirma una reserva ni
              garantiza disponibilidad real.
            </p>
            <Link to={tripPath(plan)} className="button-primary mt-6 w-full">
              {total ? 'Revisar opciones' : 'Completar mi plan'}
            </Link>
            <button
              className="mt-4 w-full py-3 text-xs text-muted underline underline-offset-4"
              onClick={clearPlan}
            >
              Descartar mi plan
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
