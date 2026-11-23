import React from 'react';
export function Loading({ label = 'Consultando opciones…' }) {
  return (
    <p
      role="status"
      className="flex items-center gap-3 rounded-xl border border-line bg-white p-5 text-sm text-muted"
    >
      <span aria-hidden="true" className="loader" />
      {label}
    </p>
  );
}
export function ServiceError({ message, onRetry, loading }) {
  return (
    <section role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <h2 className="font-semibold text-ink">No pudimos completar la consulta</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
      <button className="button-primary mt-4" onClick={onRetry} disabled={loading}>
        {loading ? 'Consultando…' : 'Volver a intentar'}
      </button>
    </section>
  );
}
export function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white p-8 text-center">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
