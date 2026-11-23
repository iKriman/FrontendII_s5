# Rumbo · Planificador de viajes

Aplicación web para explorar destinos, consultar vuelos y hoteles y armar un plan de viaje con un presupuesto estimado. El catálogo de destinos se obtiene mediante una API REST mock y las opciones de transporte y alojamiento se consultan con GraphQL y Apollo Client.

## Funcionalidades

- Catálogo de seis destinos con país, descripción y actividades populares.
- Búsqueda por destino, país o actividad, sin distinguir mayúsculas ni tildes.
- Filtro por región.
- Consulta de vuelos y hoteles según destino, fechas y cantidad de viajeros.
- Precios en pesos chilenos, fechas y disponibilidad de cada opción.
- Selección de un vuelo y un hotel para revisar el costo estimado en **Mi viaje**.
- Estados de carga, mensajes de error, reintentos y resultados vacíos.
- Navegación con React Router y página para rutas no encontradas.
- Diseño adaptable a dispositivos móviles y escritorio, etiquetas de formulario y navegación por teclado.

Los datos son de demostración. Las aerolíneas, alojamientos, precios y cupos no representan una oferta comercial; el sitio no realiza reservas ni cobros.

## Tecnologías

| Herramienta               | Uso                                   |
| ------------------------- | ------------------------------------- |
| React 19                  | Componentes, estado y efectos         |
| React Router 7            | Navegación entre páginas              |
| Apollo Client 4 y GraphQL | Consulta y caché de vuelos y hoteles  |
| Mock Service Worker 2     | Simulación de las APIs REST y GraphQL |
| Tailwind CSS 4            | Estilos y diseño responsive           |
| Vite 7                    | Desarrollo y compilación              |
| Node Test Runner          | Pruebas automatizadas                 |
| Prettier                  | Formato del código                    |

## Ejecutar en local

Se necesita Node.js 22.12 o superior y npm. Se recomienda Node.js 24.

```bash
git clone https://github.com/iKriman/FrontendII_s5.git
cd FrontendII_s5
npm ci
npm run dev
```

Abrir la dirección que indique Vite en la terminal. Las APIs mock se inician automáticamente; no es necesario levantar otro servidor ni configurar claves.

El proyecto debe ejecutarse desde un servidor local o mediante HTTPS. Abrir `index.html` directamente como archivo no permite iniciar el Service Worker.

## Recorrido de uso

1. Buscar un destino o explorar las tarjetas del catálogo.
2. Entrar a un destino para ver sus actividades y opciones de viaje.
3. Elegir salida, regreso y cantidad de viajeros y pulsar **Buscar opciones**.
4. Seleccionar un vuelo y un hotel disponibles.
5. Abrir **Mi viaje** para revisar la selección y el presupuesto.

El catálogo contempla viajes entre el **1 de enero y el 31 de marzo de 2027**, con estadías de **1 a 30 noches** y grupos de **1 a 4 viajeros**. Rapa Nui permite comprobar el estado de un destino sin opciones disponibles.

El total suma el vuelo de ida y vuelta por cada viajero y una habitación para el grupo por cada noche de estadía. Las opciones sin cupos o con capacidad insuficiente no se pueden seleccionar.

El plan se conserva al navegar dentro de la aplicación y se pierde al recargar o cerrar la página. Al aplicar otra búsqueda, se descarta la selección anterior para evitar mezclar fechas, viajeros o destinos.

## Integración con las APIs

### REST

`GET /api/destinations` devuelve los destinos disponibles, incluyendo país y actividades. En GitHub Pages, la ruta incorpora el prefijo `/FrontendII_s5/`.

La respuesta se valida antes de mostrarla. El recurso evita solicitudes simultáneas duplicadas, mantiene una caché en memoria de cinco minutos y permite recargar ante un error.

### GraphQL

`/graphql` recibe la consulta `TravelOptions`, con estas variables:

```json
{
  "destinationId": "san-pedro",
  "departureDate": "2027-01-10",
  "returnDate": "2027-01-15",
  "travelers": 2
}
```

La consulta obtiene vuelos y hoteles en una misma operación. El mock ejecuta un esquema GraphQL con validación de los argumentos y cálculo de disponibilidad. Apollo mantiene los resultados separados según las variables de búsqueda.

Los handlers de ambos servicios están en `src/mocks/handlers.js`. El esquema y los resolvers se encuentran en `src/mocks/schema.js`.

## Organización del proyecto

```text
src/
  api/                 Clientes REST y GraphQL, caché y validación de respuestas
  components/
    layout/            Encabezado, pie de página y estructura compartida
    travel/            Catálogo, formularios y tarjetas de opciones
  context/             Estado del catálogo y del plan de viaje
  hooks/               Consulta de opciones con Apollo
  lib/                 Fechas, validación, formato y selección
  mocks/               Datos, handlers, esquema e inicio de MSW
  pages/               Inicio, destinos, detalle, mi viaje y página 404
  App.jsx              Rutas de la aplicación
  main.jsx             Inicio y configuración de los proveedores
  styles.css           Tema y estilos compartidos
public/                Service Worker de MSW
tests/                 Pruebas de servicios y reglas del viaje
docs/                  Versión compilada para GitHub Pages
.github/workflows/     Publicación alternativa mediante Actions
```

## Comandos

| Comando                | Descripción                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Inicia el servidor de desarrollo         |
| `npm test`             | Ejecuta las pruebas automatizadas        |
| `npm run format:check` | Comprueba el formato                     |
| `npm run format`       | Aplica el formato                        |
| `npm run build`        | Compila en `dist/`                       |
| `npm run preview`      | Sirve la compilación de `dist/`          |
| `npm run build:pages`  | Compila en `docs/` para este repositorio |
| `npm run mock:init`    | Regenera el Service Worker de MSW        |

## Pruebas

La suite automatizada cubre fechas y viajeros inválidos, disponibilidad, selección inmutable, presupuesto, errores REST, recuperación, respuestas parciales de GraphQL, caché de Apollo y separación de búsquedas.

```bash
npm test
npm run format:check
npm run build
```

Para verificar la versión destinada a GitHub Pages:

```bash
npm run build:pages
npm run preview -- --outDir docs --base /FrontendII_s5/
```

Abrir la dirección indicada con la ruta `/FrontendII_s5/`.

### Escenarios de error

Se pueden activar escenarios de prueba agregando `escenario` antes del fragmento `#`. Por ejemplo, en desarrollo:

```text
http://localhost:5173/?escenario=partial#/destinos/san-pedro
```

| Valor        | Comportamiento                                         |
| ------------ | ------------------------------------------------------ |
| `rest-500`   | Error HTTP del catálogo                                |
| `rest-once`  | Falla la primera consulta REST y permite reintentar    |
| `rest-empty` | Catálogo sin destinos                                  |
| `gql-500`    | Error HTTP al consultar opciones                       |
| `gql-once`   | Falla la primera consulta GraphQL y permite reintentar |
| `gql-error`  | Respuesta GraphQL con errores                          |
| `partial`    | Vuelos disponibles y fallo al consultar hoteles        |
| `empty`      | Búsqueda sin vuelos ni hoteles                         |
| `network`    | Error de conexión en los servicios                     |
| `slow`       | Respuesta demorada para observar la carga              |

Para volver al funcionamiento normal, quitar el parámetro y recargar.

### Revisión en navegadores

Comprobar el siguiente recorrido en Chrome y en otro navegador, como Edge o Firefox:

- Abrir el catálogo y usar búsqueda y filtros.
- Consultar un destino con distintas fechas y viajeros.
- Seleccionar vuelo y hotel y revisar el total.
- Navegar entre páginas y volver al detalle.
- Probar resultados vacíos y recuperación de errores.
- Revisar la vista móvil y la navegación con teclado.
- Abrir y recargar un enlace directo al detalle.

Las pruebas automatizadas no reemplazan esta revisión visual en distintos navegadores.

## Publicación en GitHub Pages

La carpeta `docs/` contiene la compilación preparada para **FrontendII_s5**.

1. Subir a la rama `main` el código fuente, los archivos de configuración y la carpeta `docs`. No subir `node_modules`, archivos `.env` personales ni `dist`.
2. Comprobar que el repositorio contiene `docs/index.html`, sin una carpeta adicional entre ambos.
3. Entrar a **Settings → Pages**.
4. En **Source**, elegir **Deploy from a branch**.
5. Seleccionar **main** y **/docs**, y guardar.
6. Esperar a que GitHub termine la publicación y abrir la dirección que muestre Pages.

La dirección prevista es:

https://ikriman.github.io/FrontendII_s5/

Después de modificar el código, ejecutar `npm run build:pages` y subir nuevamente los archivos de `docs/`. GitHub Pages publica esa compilación, por lo que cambiar solo `src/` no actualiza la página.

Se utiliza `HashRouter` para permitir enlaces directos sin reglas adicionales de redirección. El Service Worker se registra dentro de la base de la aplicación.

El repositorio también incluye un workflow de publicación. Para usar esa alternativa, seleccionar **GitHub Actions** como origen de Pages; en ese caso el workflow compila y publica `dist/` automáticamente. Elegir un solo método de publicación.

Si cambia el nombre del repositorio, actualizar la base del comando `build:pages` en `package.json`, volver a compilar y actualizar los enlaces de este documento.

## Configuración opcional

El archivo `.env.example` contiene las variables disponibles:

| Variable           | Uso                                                |
| ------------------ | -------------------------------------------------- |
| `VITE_BASE_PATH`   | Base usada por la compilación general              |
| `VITE_API_MODE`    | `mock` por defecto; `real` para servicios externos |
| `VITE_REST_URL`    | URL base REST a la que se agrega `destinations`    |
| `VITE_GRAPHQL_URL` | Dirección del endpoint GraphQL externo             |

Los servicios externos deben respetar los contratos utilizados por la aplicación y permitir las solicitudes desde el sitio. Las variables de Vite son públicas en la compilación; no deben contener contraseñas ni claves privadas.
