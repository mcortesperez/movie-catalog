# CineVault 🎬

Catálogo de películas construido en **JavaScript Vanilla**, que consume la
API REST pública [Devs API Hub — API Movies](https://devsapihub.com/docs/api-movies)
para mostrar un listado paginado de películas con una interfaz inspirada en
plataformas de streaming (Netflix / Spotify).

Actividad práctica sobre manipulación del DOM, consumo de API REST,
programación asíncrona (`fetch` + `async/await`) y organización modular de
proyectos en JavaScript sin frameworks.

---

## Índice

1. [Requisitos cumplidos](#requisitos-cumplidos)
2. [Funcionalidades adicionales](#funcionalidades-adicionales)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Tecnologías utilizadas](#tecnologías-utilizadas)
5. [API utilizada](#api-utilizada)
6. [Instalación y ejecución](#instalación-y-ejecución)
7. [Cómo funciona la aplicación](#cómo-funciona-la-aplicación)
8. [Decisiones de diseño](#decisiones-de-diseño)
9. [Posibles mejoras futuras](#posibles-mejoras-futuras)

---

## Requisitos cumplidos

| # | Requisito del enunciado | Dónde se implementa |
|---|---|---|
| 1 | Consumir una API REST pública con solicitudes `GET` | `js/api/movieService.js` (3 endpoints distintos) |
| 2 | Obtener la información con `fetch()` usando `async`/`await` | Todas las funciones de `movieService.js` |
| 3 | Mostrar resultados en tarjetas (imagen, título, año) | `js/components/movieCard.js` |
| 4 | Paginación para navegar entre resultados | `js/modules/pagination.js` |
| 5 | Tarjetas construidas 100% por JavaScript (sin HTML estático) | `index.html` solo define contenedores vacíos (`#movie-grid`, etc.) |
| 6 | Estructura modular de proyecto | Ver [estructura](#estructura-del-proyecto) |

Cada tarjeta incluye, como mínimo, **imagen (póster)**, **título** y **año de
publicación**, además de género y calificación en estrellas.

## Funcionalidades adicionales

Para complementar el enunciado se agregaron algunas funcionalidades propias
de un catálogo tipo streaming, reutilizando más endpoints de la misma API:

- **Búsqueda por título** (filtrado en cliente, con *debounce*).
- **Filtro por género**, consumiendo el endpoint `GET /api-movies/genre/:genre`.
- **Modal de detalle**: al hacer clic en una tarjeta se consulta
  `GET /api-movies/:id` y se muestra la sinopsis completa.
- **Manejo de estados**: carga, error con botón de reintento, y "sin
  resultados" cuando un filtro no encuentra coincidencias.
- **Imagen de respaldo** si un póster no carga (`onerror` del `<img>`).
- Accesibilidad básica: navegación por teclado en las tarjetas, foco
  visible, `aria-live` en las regiones de estado y respeto a
  `prefers-reduced-motion`.

## Estructura del proyecto

```
movie-catalog/
├── index.html                  # Contenedores vacíos; el JS inyecta el contenido
├── css/
│   └── styles.css              # Sistema de diseño (variables, tarjetas, modal, etc.)
├── js/
│   ├── config.js                # Constantes centralizadas (URL de la API, etc.)
│   ├── app.js                   # Punto de entrada: estado + orquestación
│   ├── api/
│   │   └── movieService.js      # Toda la comunicación fetch con la API
│   ├── components/
│   │   ├── movieCard.js         # Construye una tarjeta de película
│   │   └── modal.js             # Controla el modal de detalle
│   ├── modules/
│   │   └── pagination.js        # Lógica y render de la paginación
│   └── utils/
│       └── dom.js               # Helpers genéricos de DOM (qs, debounce, etc.)
└── README.md
```

La separación sigue el principio de una responsabilidad por módulo:

- **`api/`** → nunca toca el DOM, solo hace `fetch` y devuelve datos.
- **`components/`** → construyen y devuelven elementos del DOM a partir de datos.
- **`modules/`** → lógica de negocio reutilizable (paginación).
- **`utils/`** → funciones genéricas sin relación con el dominio de películas.
- **`app.js`** → es el único archivo que conoce a todos los demás y coordina
  el estado de la aplicación.

## Tecnologías utilizadas

- HTML5 semántico
- CSS3 (variables/custom properties, Grid, Flexbox, `prefers-reduced-motion`)
- JavaScript ES6+ (módulos nativos `import`/`export`, `async`/`await`, clases del DOM)
- Sin frameworks ni dependencias de build: no requiere `npm install`.
- Fuentes vía Google Fonts (Bebas Neue, Work Sans, JetBrains Mono).

## API utilizada

**Devs API Hub — API Movies**: `https://devsapihub.com/api-movies`
Documentación oficial: <https://devsapihub.com/docs/api-movies>

Endpoints consumidos en la aplicación:

| Endpoint | Uso en la app |
|---|---|
| `GET /api-movies` | Carga inicial del catálogo completo |
| `GET /api-movies/:id` | Detalle de una película (modal) |
| `GET /api-movies/genre/:genre` | Filtro por género |

> La API no expone parámetros de página/`offset` (solo `GET /limit/:limit`
> para acotar la cantidad de resultados). Por eso el catálogo completo se
> obtiene una única vez y la **paginación se calcula en el cliente**,
> recortando el arreglo en bloques de `MOVIES_PER_PAGE` elementos
> (configurable en `js/config.js`). Esta decisión se documenta aquí porque
> se aparta ligeramente de un "GET por página" tradicional, dado lo que la
> propia API permite.

## Instalación y ejecución

Este proyecto **no requiere instalación de dependencias** (no usa `npm`,
`webpack` ni ningún *bundler*). Sin embargo, como `index.html` carga los
scripts con `type="module"`, los navegadores **bloquean su ejecución si se
abre el archivo directamente con doble clic** (protocolo `file://`). Es
necesario servirlo desde un servidor local. Cualquiera de estas opciones
funciona:

**Opción A — Extensión "Live Server" de VS Code**
1. Abrir la carpeta del proyecto en VS Code.
2. Clic derecho sobre `index.html` → *Open with Live Server*.

**Opción B — Node.js**
```bash
npx serve .
# o
npx http-server .
```

**Opción C — Python** (ya viene instalado en la mayoría de sistemas)
```bash
python3 -m http.server 8080
```
Luego abrir `http://localhost:8080` en el navegador.

No se necesita configurar variables de entorno ni API keys: la API consumida
es pública y de solo lectura para los fines de esta actividad.

## Cómo funciona la aplicación

1. Al cargar la página, `app.js` llama a `getAllMovies()` y muestra un
   estado de carga mientras espera la respuesta.
2. Con los datos recibidos:
   - se genera dinámicamente el listado de géneros disponibles en el
     `<select>` de filtros;
   - se calcula el total de páginas según `MOVIES_PER_PAGE`;
   - se renderiza la primera página de tarjetas.
3. Al escribir en el buscador, se filtra por título (en memoria, sin nuevas
   peticiones) y se reinicia la paginación.
4. Al cambiar el género, se hace una nueva petición a
   `GET /api-movies/genre/:genre` y se repagina el resultado.
5. Al hacer clic (o presionar Enter) sobre una tarjeta, se abre un modal que
   consulta `GET /api-movies/:id` y muestra la sinopsis completa, géneros y
   calificación.
6. Los controles "Anterior / Siguiente" y los números de página actualizan
   solo la grilla visible, sin recargar la página.

## Decisiones de diseño

La interfaz se pensó como una "marquesina de cine" antes que como un clon
literal de Netflix o Spotify:

- **Paleta**: negro de sala (`#0B0B10`) como base, dorado de marquesina
  (`#E8B04B`) como acento principal y rojo terciopelo (`#B23A48`) como
  acento secundario para estados de error/calificación.
- **Tipografía**: `Bebas Neue` (estilo cartel de cine) para títulos,
  `Work Sans` para texto de lectura y `JetBrains Mono` para datos
  numéricos (año, estrellas, controles de paginación), evocando el
  ticket/boleto de cine.
- **Elemento distintivo**: una franja con "perforaciones" (efecto de
  fotograma de película) en el encabezado, el pie de página y la barra de
  paginación, como hilo conductor visual del sitio.

## Posibles mejoras futuras

- Persistir el filtro/búsqueda activos en la URL (`history.pushState`) para
  poder compartir un enlace con el estado exacto del catálogo.
- Agregar orden por calificación o año.
- Migrar la paginación en cliente a `GET /api-movies/limit/:limit` combinado
  con filtros por género/año si la API llegara a exponer `offset` en el futuro.
