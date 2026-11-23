import { isDestinations } from './contracts.js';
export async function getDestinations({
  url,
  signal,
  scenario = '',
  fetchImpl = fetch,
  timeoutMs = 8000,
}) {
  const controller = new AbortController();
  const cancel = () => controller.abort(signal.reason);
  if (signal?.aborted) controller.abort(signal.reason);
  else signal?.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(
    () => controller.abort(new DOMException('Tiempo agotado', 'TimeoutError')),
    timeoutMs,
  );
  try {
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json', ...(scenario ? { 'x-demo-scenario': scenario } : {}) },
    });
    if (!response.ok)
      throw new Error(
        response.status === 404
          ? 'No encontramos el catálogo de destinos.'
          : 'No pudimos consultar los destinos. Inténtalo nuevamente.',
      );
    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new Error('El servicio de destinos respondió con un formato inválido.');
    }
    if (!isDestinations(payload?.data))
      throw new Error('La información de destinos está incompleta.');
    return payload.data;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (controller.signal.aborted)
      throw new Error('La consulta de destinos tardó demasiado. Vuelve a intentarlo.');
    if (error instanceof TypeError)
      throw new Error('No pudimos conectar. Revisa tu conexión y vuelve a intentarlo.');
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}
