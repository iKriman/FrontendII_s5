import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { setupServer } from 'msw/node';
import { createHandlers } from '../src/mocks/handlers.js';
import { getDestinations } from '../src/api/rest.js';
import { createDestinationResource } from '../src/api/destinations.js';
import { createApollo, TRAVEL_OPTIONS } from '../src/api/graphql.js';
const base = 'http://localhost/FrontendII_s5/';
const server = setupServer(...createHandlers(base, { latency: 0 }));
server.listen({ onUnhandledRequest: 'error' });
after(() => server.close());
const config = { url: base + 'api/destinations' };
const variables = {
  destinationId: 'san-pedro',
  departureDate: '2027-01-10',
  returnDate: '2027-01-15',
  travelers: 2,
};
test('REST funciona bajo la ruta de GitHub Pages y no expone precios de vuelos', async () => {
  const data = await getDestinations(config);
  assert.equal(data.length, 6);
  assert.ok(data.every((d) => d.activities.length && d.country));
  assert.equal(data[0].basePrice, undefined);
});
test('REST diferencia error HTTP, red, vacío y recuperación', async () => {
  await assert.rejects(getDestinations({ ...config, scenario: 'rest-500' }), /consultar/);
  await assert.rejects(getDestinations({ ...config, scenario: 'network' }), /conectar/);
  assert.deepEqual(await getDestinations({ ...config, scenario: 'rest-empty' }), []);
  const once = { ...config, scenario: 'rest-once' };
  await assert.rejects(getDestinations(once));
  assert.equal((await getDestinations(once)).length, 6);
});
test('REST valida contrato y tiempo máximo', async () => {
  await assert.rejects(
    getDestinations({
      ...config,
      fetchImpl: async () => Response.json({ data: [{ id: 'malo' }] }),
    }),
    /incompleta/,
  );
  await assert.rejects(
    getDestinations({
      ...config,
      timeoutMs: 5,
      fetchImpl: (_, { signal }) =>
        new Promise((resolve, reject) =>
          signal.addEventListener('abort', () => reject(signal.reason)),
        ),
    }),
    /tardó/,
  );
});
test('catálogo deduplica solicitudes y permite recarga explícita', async () => {
  let calls = 0;
  const resource = createDestinationResource({
    ...config,
    fetchImpl: (...a) => {
      calls++;
      return fetch(...a);
    },
  });
  const [a, b] = await Promise.all([resource.read(), resource.read()]);
  assert.equal(a, b);
  assert.equal(calls, 1);
  await resource.read();
  assert.equal(calls, 1);
  await resource.read(true);
  assert.equal(calls, 2);
});
test('Apollo consulta GraphQL, usa caché y separa variables', async () => {
  let calls = 0;
  const client = createApollo({
    uri: base + 'graphql',
    fetchImpl: (...a) => {
      calls++;
      return fetch(...a);
    },
  });
  try {
    const first = await client.query({ query: TRAVEL_OPTIONS, variables });
    assert.equal(first.data.travelOptions.flights.length, 3);
    await client.query({ query: TRAVEL_OPTIONS, variables });
    assert.equal(calls, 1);
    const next = await client.query({
      query: TRAVEL_OPTIONS,
      variables: { ...variables, departureDate: '2027-01-11' },
    });
    assert.equal(calls, 2);
    assert.equal(next.data.travelOptions.flights[0].departureDate, '2027-01-11');
    const cached = await client.query({ query: TRAVEL_OPTIONS, variables });
    assert.equal(cached.data.travelOptions.flights[0].departureDate, '2027-01-10');
  } finally {
    client.stop();
  }
});
test('Apollo conserva vuelos ante fallo parcial de hoteles y recupera HTTP500', async () => {
  const partial = createApollo({ uri: base + 'graphql', scenario: 'partial' });
  try {
    const result = await partial.query({ query: TRAVEL_OPTIONS, variables });
    assert.equal(result.data.travelOptions.hotels, null);
    assert.equal(result.data.travelOptions.flights.length, 3);
    assert.ok(result.error);
  } finally {
    partial.stop();
  }
  const retry = createApollo({ uri: base + 'graphql', scenario: 'gql-once' });
  try {
    const failed = await retry.query({ query: TRAVEL_OPTIONS, variables });
    assert.ok(failed.error);
    const recovered = await retry.query({
      query: TRAVEL_OPTIONS,
      variables,
      fetchPolicy: 'network-only',
    });
    assert.equal(recovered.data.travelOptions.hotels.length, 3);
  } finally {
    retry.stop();
  }
});
