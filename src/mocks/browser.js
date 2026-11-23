import { setupWorker } from 'msw/browser';
import { createHandlers } from './handlers';
export async function startMock() {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin);
  const worker = setupWorker(...createHandlers(base.href));
  await worker.start({
    serviceWorker: {
      url: new URL('mockServiceWorker.js', base).href,
      options: { scope: base.pathname },
    },
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
  return worker;
}
