import React from 'react';
import { currency, shortDate } from '../../lib/format';
export default function HotelCard({ hotel, selected, onSelect }) {
  return (
    <article className={'option-card ' + (selected ? 'option-selected' : '')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            aria-label={hotel.stars + ' estrellas'}
            className="text-xs tracking-widest text-amber-600"
          >
            {'★'.repeat(hotel.stars)}
          </p>
          <h3 className="mt-2 font-semibold text-ink">{hotel.name}</h3>
        </div>
        <span className={'status-pill ' + (hotel.available ? 'status-ok' : 'status-off')}>
          {hotel.available ? hotel.roomsAvailable + ' habitaciones' : 'No disponible'}
        </span>
      </div>
      <p className="mt-3 text-xs text-muted">
        {hotel.location} · Hasta {hotel.capacity} personas
      </p>
      <div className="my-4 flex flex-wrap gap-2">
        {hotel.amenities.map((a) => (
          <span key={a} className="rounded-md bg-sand px-2 py-1 text-[10px] text-muted">
            {a}
          </span>
        ))}
      </div>
      <p className="text-xs leading-6 text-muted">
        Entrada: {shortDate(hotel.checkIn)}
        <br />
        Salida: {shortDate(hotel.checkOut)}
      </p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
        <p className="text-xl font-semibold text-forest">
          {currency(hotel.nightlyPrice)}
          <small className="mt-1 block text-[10px] font-normal text-muted">
            Por habitación · por noche
          </small>
        </p>
        <button
          className={selected ? 'button-selected' : 'button-secondary'}
          disabled={!hotel.available}
          aria-pressed={selected}
          onClick={onSelect}
        >
          {selected ? 'Hotel elegido ✓' : 'Elegir hotel'}
        </button>
      </div>
    </article>
  );
}
