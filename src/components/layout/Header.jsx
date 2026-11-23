import React from 'react';
import { Link, NavLink } from 'react-router';
import { useTrip } from '../../context/TripContext';
export default function Header() {
  const { plan } = useTrip();
  const count = Number(Boolean(plan?.flight)) + Number(Boolean(plan?.hotel));
  return (
    <>
      <div className="bg-forest px-5 py-2 text-center text-[10px] tracking-wider text-white/90">
        CATÁLOGO SIMULADO · VIAJES ENTRE ENERO Y MARZO DE 2027
      </div>
      <header className="border-b border-line bg-white">
        <div className="page-width flex flex-wrap items-center justify-between gap-4 py-5">
          <Link aria-label="Rumbo, inicio" to="/" className="flex items-center gap-2 text-forest">
            <span aria-hidden="true" className="brand-icon">
              ↗
            </span>
            <span className="text-3xl font-bold tracking-tight">
              rumbo<span className="text-orange">.</span>
              <small className="mt-1 block text-[8px] font-medium tracking-[.25em]">
                VIAJES PARA DESCUBRIR
              </small>
            </span>
          </Link>
          <nav
            aria-label="Navegación principal"
            className="flex items-center gap-5 text-xs sm:gap-8"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) => 'nav-link ' + (isActive ? 'nav-active' : '')}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/destinos"
              className={({ isActive }) => 'nav-link ' + (isActive ? 'nav-active' : '')}
            >
              Destinos
            </NavLink>
            <NavLink
              to="/mi-viaje"
              className={({ isActive }) => 'plan-link ' + (isActive ? 'bg-sand' : '')}
            >
              Mi viaje{' '}
              <span className="rounded-full bg-forest px-2 py-0.5 text-[10px] text-white">
                {count}
              </span>
            </NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}
