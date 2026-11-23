import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import DestinationScene from '../components/travel/DestinationScene';
import DestinationGrid from '../components/travel/DestinationGrid';
export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  return (
    <>
      <section className="page-width grid items-center gap-9 pb-12 pt-10 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pt-14">
        <div>
          <p className="eyebrow">HAY UN MUNDO POR DESCUBRIR</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-6xl">
            Sal de la rutina.
            <br />
            <span className="text-forest">
              Encuentra tu
              <br className="hidden sm:block" /> próximo rumbo.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted">
            De una escapada entre montañas a una ciudad por recorrer. Explora destinos, compara
            opciones y arma un viaje a tu medida.
          </p>
          <form
            className="mt-7 flex max-w-lg gap-2 rounded-xl border border-line bg-white p-2 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/destinos' + (search ? '?buscar=' + encodeURIComponent(search) : ''));
            }}
          >
            <label htmlFor="hero-search" className="sr-only">
              Buscar un destino o actividad
            </label>
            <input
              id="hero-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="¿Dónde te gustaría ir?"
              className="min-w-0 flex-1 border-0 bg-transparent"
            />
            <button className="button-primary" type="submit">
              Explorar ↗
            </button>
          </form>
          <p className="mt-5 text-[10px] text-muted">
            Vuelos + hoteles · Salidas desde Santiago · Planificación sin apuro
          </p>
        </div>
        <div className="hero-scene">
          <DestinationScene scene="mountain" className="h-full w-full" />
          <div className="hero-label">
            <span className="text-[9px] tracking-widest text-white/80">
              INSPÍRATE EN LA PATAGONIA
            </span>
            <p className="mt-2 text-2xl font-semibold text-white">
              El viaje empieza
              <br />
              antes de partir.
            </p>
            <Link
              to="/destinos/puerto-natales"
              className="mt-4 inline-block text-xs text-white underline underline-offset-4"
            >
              Descubrir Puerto Natales ↗
            </Link>
          </div>
          <div className="scene-tag">
            <span aria-hidden="true">✦</span> Lugares que se quedan contigo
          </div>
        </div>
      </section>
      <section className="border-y border-line bg-sand">
        <div className="page-width grid gap-4 py-5 text-xs text-muted sm:grid-cols-3">
          <span>✧ &nbsp; Descubre destinos y actividades</span>
          <span>✈ &nbsp; Compara fechas y vuelos</span>
          <span>⌂ &nbsp; Encuentra dónde quedarte</span>
        </div>
      </section>
      <section className="page-width pt-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">ELIGE TU PRÓXIMO DESTINO</p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink">
              Un lugar para cada forma de viajar.
            </h2>
          </div>
          <Link
            className="text-xs font-semibold text-forest underline underline-offset-4"
            to="/destinos"
          >
            Ver destinos →
          </Link>
        </div>
        <DestinationGrid />
      </section>
    </>
  );
}
