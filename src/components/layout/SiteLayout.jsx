import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';
export default function SiteLayout() {
  const main = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    document.title =
      'Rumbo · ' +
      (pathname === '/'
        ? 'Viajes para descubrir'
        : pathname === '/destinos'
          ? 'Destinos'
          : pathname === '/mi-viaje'
            ? 'Mi viaje'
            : pathname.startsWith('/destinos/')
              ? 'Vuelos y hoteles'
              : 'Página no encontrada');
    main.current?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a
        href="#contenido"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} ref={main} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
