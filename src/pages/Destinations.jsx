import React from 'react';
import { useSearchParams } from 'react-router';
import DestinationGrid from '../components/travel/DestinationGrid';
export default function Destinations() {
  const [params] = useSearchParams();
  return (
    <section className="page-width pt-12">
      <p className="eyebrow">TU PRÓXIMA HISTORIA ESTÁ AQUÍ</p>
      <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        ¿Hacia dónde vamos?
      </h1>
      <p className="mb-9 mt-5 max-w-xl text-sm leading-7 text-muted">
        Descubre países, actividades y opciones para tu próxima escapada. Elige un destino para
        consultar sus vuelos y hoteles.
      </p>
      <DestinationGrid initialSearch={params.get('buscar') || ''} />
    </section>
  );
}
