import { http, graphql, HttpResponse, delay } from 'msw';
import { graphql as executeGraphql } from 'graphql';
import { destinations, publicDestination } from './data.js';
import { schema, resolveOptions } from './schema.js';
export function createHandlers(baseUrl, { latency = 450 } = {}) {
  const restUrl = new URL('api/destinations', baseUrl).href;
  const gqlUrl = new URL('graphql', baseUrl).href;
  let restFailed = false,
    gqlFailed = false;
  async function failure(request, kind) {
    const scenario = request.headers.get('x-demo-scenario') || '';
    await delay(scenario === 'slow' ? 2800 : latency);
    if (scenario === 'network') return HttpResponse.error();
    if (
      scenario === kind + '-500' ||
      (scenario === kind + '-once' && !(kind === 'rest' ? restFailed : gqlFailed))
    ) {
      if (scenario === 'rest-once') restFailed = true;
      else if (scenario === 'gql-once') gqlFailed = true;
      return HttpResponse.json(
        { message: 'Servicio temporalmente no disponible.' },
        { status: 500 },
      );
    }
    return null;
  }
  return [
    http.get(restUrl, async ({ request }) => {
      const failed = await failure(request, 'rest');
      if (failed) return failed;
      const scenario = request.headers.get('x-demo-scenario');
      return HttpResponse.json({
        data: scenario === 'rest-empty' ? [] : destinations.map(publicDestination),
      });
    }),
    graphql.link(gqlUrl).operation(async ({ query, variables, operationName, request }) => {
      const failed = await failure(request, 'gql');
      if (failed) return failed;
      const scenario = request.headers.get('x-demo-scenario');
      if (scenario === 'gql-error')
        return HttpResponse.json({
          errors: [
            {
              message: 'No pudimos consultar las opciones. Inténtalo nuevamente.',
              extensions: { code: 'SERVICE_UNAVAILABLE' },
            },
          ],
        });
      const result = await executeGraphql({
        schema,
        source: query,
        variableValues: variables,
        operationName,
        rootValue: { travelOptions: (args) => resolveOptions(args, scenario) },
      });
      return HttpResponse.json(result);
    }),
  ];
}
