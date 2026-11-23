import React from 'react';
import { Link } from 'react-router';
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line py-9">
      <div className="page-width flex flex-col justify-between gap-5 sm:flex-row">
        <div>
          <Link to="/" className="text-2xl font-bold tracking-tight text-forest">
            rumbo.
          </Link>
          <p className="mt-2 text-xs text-muted">Tu próximo destino empieza con una idea.</p>
        </div>
        <p className="max-w-sm text-xs leading-6 text-muted">
          Destinos y opciones de viaje de demostración. Precios referenciales en CLP. Este sitio no
          realiza reservas ni cobros.
        </p>
      </div>
    </footer>
  );
}
