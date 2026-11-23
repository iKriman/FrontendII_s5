import { getDestinations } from './rest.js';
export function createDestinationResource(config) {
  let data = null,
    updatedAt = 0,
    pending = null;
  return {
    read(force = false) {
      if (!force && data && Date.now() - updatedAt < 300000) return Promise.resolve(data);
      if (pending) return pending;
      pending = getDestinations(config)
        .then((result) => {
          data = result;
          updatedAt = Date.now();
          return result;
        })
        .finally(() => {
          pending = null;
        });
      return pending;
    },
  };
}
