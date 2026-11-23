import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import { ApolloProvider } from '@apollo/client/react';
import { createApollo } from './api/graphql';
import { DestinationsProvider } from './context/DestinationsContext';
import { TripProvider } from './context/TripContext';
import App from './App';
import './styles.css';
const root = createRoot(document.getElementById('root'));
function StartupError() {
  return (
    <main className="page-width py-20">
      <h1 className="text-3xl font-semibold text-ink">No pudimos iniciar el catálogo de viajes.</h1>
      <p className="mt-5 text-sm leading-7 text-muted">
        Comprueba la conexión y que el sitio permita iniciar sus servicios. Después vuelve a cargar.
      </p>
      <button className="button-primary mt-6" onClick={() => window.location.reload()}>
        Volver a cargar
      </button>
    </main>
  );
}
async function start() {
  try {
    const base = new URL(import.meta.env.BASE_URL, window.location.origin);
    const mock = import.meta.env.VITE_API_MODE !== 'real';
    if (mock) {
      const { startMock } = await import('./mocks/browser');
      await startMock();
    }
    const scenario = mock ? new URLSearchParams(window.location.search).get('escenario') || '' : '';
    const client = createApollo({
      uri: import.meta.env.VITE_GRAPHQL_URL || new URL('graphql', base).href,
      scenario,
    });
    const config = {
      restUrl: import.meta.env.VITE_REST_URL
        ? new URL(
            'destinations',
            import.meta.env.VITE_REST_URL.endsWith('/')
              ? import.meta.env.VITE_REST_URL
              : import.meta.env.VITE_REST_URL + '/',
          ).href
        : new URL('api/destinations', base).href,
      scenario,
    };
    root.render(
      <React.StrictMode>
        <HashRouter>
          <ApolloProvider client={client}>
            <DestinationsProvider config={config}>
              <TripProvider>
                <App />
              </TripProvider>
            </DestinationsProvider>
          </ApolloProvider>
        </HashRouter>
      </React.StrictMode>,
    );
  } catch {
    root.render(<StartupError />);
  }
}
root.render(
  <p role="status" className="page-width py-20 text-center text-sm text-muted">
    Preparando tu próximo rumbo…
  </p>,
);
void start();
