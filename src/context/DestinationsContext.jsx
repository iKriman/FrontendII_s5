import React, { createContext, useContext, useState, useEffect } from 'react';
import { createDestinationResource } from '../api/destinations';
const Context = createContext(null);
export function DestinationsProvider({ config, children }) {
  const [resource] = useState(() =>
    createDestinationResource({ url: config.restUrl, scenario: config.scenario }),
  );
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: null }));
    resource
      .read(attempt > 0)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState((previous) => ({ ...previous, loading: false, error: error.message }));
      });
    return () => {
      active = false;
    };
  }, [resource, attempt]);
  return (
    <Context.Provider value={{ ...state, reload: () => setAttempt((value) => value + 1) }}>
      {children}
    </Context.Provider>
  );
}
export function useDestinations() {
  const context = useContext(Context);
  if (!context) throw new Error('Falta DestinationsProvider.');
  return context;
}
