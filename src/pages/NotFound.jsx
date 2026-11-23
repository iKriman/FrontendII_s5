import React from 'react';
import { Link } from 'react-router';
export default function NotFound() {
  return (
    <section className="page-width py-20 text-center">
      <p className="eyebrow">RUTA 404</p>
      <h1 className="text-4xl font-semibold tracking-tight text-ink">
        Este camino no está en el mapa.
      </h1>
      <p className="mt-5 text-sm text-muted">Vuelve a los destinos y encuentra tu próximo rumbo.</p>
      <Link className="button-primary mt-7" to="/destinos">
        Explorar destinos
      </Link>
    </section>
  );
}
