import React, { useState, useEffect, useRef } from 'react';
import FormField from '../FormField';
import { validateSearch, TRAVEL_START, TRAVEL_END } from '../../lib/travel';
export default function TripSearch({ search, onApply, loading }) {
  const [form, setForm] = useState(search);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  useEffect(() => {
    setForm(search);
    setErrors(validateSearch(search));
  }, [search.departureDate, search.returnDate, search.travelers]);
  function update(e) {
    setForm((previous) => ({ ...previous, [e.target.name]: e.target.value }));
    setErrors((previous) => ({ ...previous, [e.target.name]: undefined }));
  }
  function submit(e) {
    e.preventDefault();
    const next = validateSearch(form);
    setErrors(next);
    const invalid = Object.keys(next);
    if (invalid.length) {
      formRef.current.elements.namedItem(invalid[0])?.focus();
      return;
    }
    onApply(form);
  }
  return (
    <form ref={formRef} onSubmit={submit} noValidate className="search-panel">
      <FormField id="departureDate" label="Fecha de salida" error={errors.departureDate}>
        <input
          name="departureDate"
          type="date"
          min={TRAVEL_START}
          max={TRAVEL_END}
          value={form.departureDate}
          onChange={update}
          required
        />
      </FormField>
      <FormField id="returnDate" label="Fecha de regreso" error={errors.returnDate}>
        <input
          name="returnDate"
          type="date"
          min={TRAVEL_START}
          max={TRAVEL_END}
          value={form.returnDate}
          onChange={update}
          required
        />
      </FormField>
      <FormField id="travelers" label="Viajeros" error={errors.travelers}>
        <select name="travelers" value={form.travelers} onChange={update}>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'viajero' : 'viajeros'}
            </option>
          ))}
        </select>
      </FormField>
      <button className="button-primary self-start sm:self-end" disabled={loading} type="submit">
        {loading ? 'Consultando…' : 'Buscar opciones'}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="col-span-full text-[10px] leading-5 text-muted">
        Catálogo simulado para enero–marzo de 2027. Salidas desde Santiago. Estadías de 1 a 30
        noches.
      </p>
    </form>
  );
}
