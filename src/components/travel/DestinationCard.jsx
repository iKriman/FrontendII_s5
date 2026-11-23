import React from 'react';
import { Link } from 'react-router';
import DestinationScene from './DestinationScene';
export default function DestinationCard({ destination }) {
  return (
    <Link to={'/destinos/' + destination.id} className="destination-card group">
      <div className="relative overflow-hidden">
        <DestinationScene
          scene={destination.scene}
          className="h-48 w-full transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-forest">
          {destination.country}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold tracking-tight text-ink">{destination.name}</h3>
        <p className="mt-2 text-xs leading-6 text-muted">{destination.tagline}</p>
        <p className="mt-4 text-[10px] leading-5 text-muted">
          {destination.activities.slice(0, 2).join(' · ')}
        </p>
        <span className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs font-semibold text-forest">
          Ver vuelos y hoteles<span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}
