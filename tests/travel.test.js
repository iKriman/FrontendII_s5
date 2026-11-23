import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSearch, nightCount, DEFAULT_SEARCH, planTotal } from '../src/lib/travel.js';
import { normalize } from '../src/lib/format.js';
import { selectOption, tripPath } from '../src/lib/plan.js';
import { resolveOptions, schema } from '../src/mocks/schema.js';
import { destinations } from '../src/mocks/data.js';
import { graphql } from 'graphql';
const search = { ...DEFAULT_SEARCH };
const args = { ...search, travelers: 2, destinationId: 'san-pedro' };
test('fechas reales, ventana del catálogo y viajeros enteros', () => {
  assert.deepEqual(validateSearch(search), {});
  for (const departureDate of ['2027-02-30', '2026-12-31', '2027-04-01', 'incorrecta'])
    assert.ok(validateSearch({ ...search, departureDate }).departureDate);
  assert.ok(validateSearch({ ...search, returnDate: search.departureDate }).returnDate);
  assert.ok(validateSearch({ ...search, returnDate: '2027-03-20' }).returnDate);
  for (const travelers of ['0', '5', '2e0', '0x2', ' 2', '2.0'])
    assert.ok(validateSearch({ ...search, travelers }).travelers);
  assert.equal(nightCount('2027-01-30', '2027-02-02'), 3);
  assert.equal(normalize('RÍO de Janeiro'), 'rio de janeiro');
});
test('disponibilidad según viajeros y destino sin resultados', () => {
  const options = resolveOptions({ ...args, travelers: 3 });
  assert.deepEqual(
    options.flights.map((x) => x.available),
    [true, false, false],
  );
  assert.deepEqual(
    options.hotels.map((x) => x.available),
    [true, false, false],
  );
  assert.deepEqual(resolveOptions({ ...args, destinationId: 'rapa-nui' }).flights, []);
  assert.throws(() => resolveOptions({ ...args, destinationId: 'inexistente' }), /destino/);
});
test('selecciones inmutables, total por persona y habitación, cambio de fechas', () => {
  const dest = destinations[0],
    options = resolveOptions(args);
  const first = selectOption(null, dest, search, 'flight', options.flights[0]);
  const before = structuredClone(first);
  const complete = selectOption(first, dest, search, 'hotel', options.hotels[0]);
  assert.deepEqual(first, before);
  const totals = planTotal(complete);
  assert.equal(totals.total, 139990 * 2 + 65990 * 5);
  assert.equal(totals.nights, 5);
  assert.equal(selectOption(complete, dest, search, 'flight', options.flights[2]), complete);
  assert.equal(
    selectOption(complete, dest, search, 'hotel', { ...options.hotels[0], destinationId: 'cusco' }),
    complete,
  );
  assert.equal(
    selectOption(
      complete,
      dest,
      { ...search, departureDate: '2027-01-11' },
      'flight',
      options.flights[0],
    ),
    complete,
  );
  const changedSearch = { ...search, departureDate: '2027-01-11' };
  const changed = resolveOptions({ ...args, ...changedSearch, travelers: 2 });
  const next = selectOption(complete, dest, changedSearch, 'flight', changed.flights[0]);
  assert.equal(next.hotel, null);
  assert.equal(planTotal(next), null);
  assert.match(tripPath(complete), /salida=2027-01-10/);
});
test('el esquema ejecuta selecciones y devuelve errores parciales', async () => {
  const source =
    'query($id:ID!){travelOptions(destinationId:$id,departureDate:"2027-01-10",returnDate:"2027-01-15",travelers:2){destinationId flights{id} hotels{id}}}';
  const result = await graphql({
    schema,
    source,
    variableValues: { id: 'san-pedro' },
    rootValue: { travelOptions: (a) => resolveOptions(a, 'partial') },
  });
  assert.equal(result.data.travelOptions.flights.length, 3);
  assert.equal(result.data.travelOptions.hotels, null);
  assert.equal(result.errors[0].extensions.code, 'HOTELS_UNAVAILABLE');
  const invalid = await graphql({ schema, source: '{campoInexistente}' });
  assert.ok(invalid.errors);
});
