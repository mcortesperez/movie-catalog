# JulMate Cinema

Pequeño catálogo de películas hecho en JavaScript sin frameworks. Este
README resume la estructura del proyecto, cómo ejecutarlo y la API que usa.

Estructura clave
- `index.html` — contenedores vacíos; el JS inyecta las tarjetas.
- `css/styles.css` — estilos y sistema visual.
- `js/` — código: `app.js` (entrada), `api/movieService.js`, `components/`, `modules/`, `utils/`.

Ejecutarlo localmente
- Con Live Server (VS Code): clic derecho en `index.html` → *Open with Live Server*.

Abrir `http://127.0.0.1:5500/` en el navegador.

API utilizada
- Devs API Hub — API Movies: https://devsapihub.com/api-movies
- Endpoints principales usados:
  - `GET /api-movies` — lista completa (se pagina en el cliente)
  - `GET /api-movies/:id` — detalle para el modal
  - `GET /api-movies/genre/:genre` — filtrado por género
