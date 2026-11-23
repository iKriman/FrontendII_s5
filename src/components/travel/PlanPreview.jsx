import React from 'react';
import { Link } from 'react-router';
import { useTrip } from '../../context/TripContext';
import { planTotal } from '../../lib/travel';
import { currency } from '../../lib/format';
import { searchKey } from '../../lib/plan';
export default function PlanPreview({ destination, search }) {
  const { plan } = useTrip();
  const matching =
    plan && searchKey(plan.destination.id, plan.search) === searchKey(destination.id, search);
  const total = matching ? planTotal(plan) : null;
  return (
    <aside className="plan-preview">
      <div>
        <p className="text-xs font-semibold text-forest">Tu plan para {destination.name}</p>
        <p className="mt-1 text-xs text-muted">
          {matching && plan.flight ? 'Vuelo elegido ✓' : 'Elige un vuelo'} ·{' '}
          {matching && plan.hotel ? 'Hotel elegido ✓' : 'Elige un hotel'}
        </p>
      </div>
      <div className="flex items-center gap-5">
        {total && (
          <p className="text-lg font-semibold text-forest">
            {currency(total.total)}
            <small className="block text-right text-[9px] font-normal text-muted">
              Total estimado
            </small>
          </p>
        )}
        <Link className="button-primary" to="/mi-viaje">
          Ver mi plan →
        </Link>
      </div>
    </aside>
  );
}
