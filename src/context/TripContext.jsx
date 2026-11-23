import React, { createContext, useContext, useState } from 'react';
import { selectOption, searchKey } from '../lib/plan';
const Context = createContext(null);
export function TripProvider({ children }) {
  const [plan, setPlan] = useState(null);
  function choose(destination, search, kind, option) {
    setPlan((previous) => selectOption(previous, destination, search, kind, option));
  }
  function changeSearch(destination, search) {
    setPlan((previous) =>
      previous &&
      searchKey(previous.destination.id, previous.search) !== searchKey(destination.id, search)
        ? null
        : previous,
    );
  }
  return (
    <Context.Provider value={{ plan, choose, changeSearch, clearPlan: () => setPlan(null) }}>
      {children}
    </Context.Provider>
  );
}
export function useTrip() {
  const context = useContext(Context);
  if (!context) throw new Error('Falta TripProvider.');
  return context;
}
