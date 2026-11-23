import React from 'react';
import { currency, duration, shortDate } from '../../lib/format';
export default function FlightCard({ flight, selected, onSelect, travelers }) {
  return (
    <article className={'option-card ' + (selected ? 'option-selected' : '')}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-ink">{flight.airline}</h3>
        <span className={'status-pill ' + (flight.available ? 'status-ok' : 'status-off')}>
          {flight.available ? flight.seatsAvailable + ' cupos' : 'No disponible para ' + travelers}
        </span>
      </div>
      <div className="my-5 flex items-center gap-4">
        <div>
          <p className="text-xl font-semibold text-ink">{flight.departureTime}</p>
          <p className="mt-1 text-xs text-muted">{flight.origin}</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-[10px] text-muted">{duration(flight.durationMinutes)}</p>
          <div className="my-2 h-px bg-line" />
          <p className="text-[10px] text-muted">
            {flight.stops ? '1 escala' : 'Directo'} <span aria-hidden="true">✈</span>
          </p>
        </div>
        <p className="text-xs font-medium text-ink">{flight.arrival}</p>
      </div>
      <p className="text-xs leading-6 text-muted">
        Ida: {shortDate(flight.departureDate)}
        <br />
        Vuelta: {shortDate(flight.returnDate)}
      </p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
        <p className="text-xl font-semibold text-forest">
          {currency(flight.price)}
          <small className="mt-1 block text-[10px] font-normal text-muted">
            Ida y vuelta · por persona
          </small>
        </p>
        <button
          className={selected ? 'button-selected' : 'button-secondary'}
          disabled={!flight.available}
          aria-pressed={selected}
          onClick={onSelect}
        >
          {selected ? 'Vuelo elegido ✓' : 'Elegir vuelo'}
        </button>
      </div>
    </article>
  );
}
