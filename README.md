# JulMate Cinema

Pequeño catálogo de películas hecho en JavaScript sin frameworks. Este
README resume la estructura del proyecto, cómo ejecutarlo y la API que usa.

Estructura clave
- `index.html` — contenedores vacíos; el JS inyecta las tarjetas.
- `css/styles.css` — estilos y sistema visual.
- `js/` — código: `app.js` (entrada), `api/movieService.js`, `components/`, `modules/`, `utils/`.

Ejecutarlo localmente
- Con Live Server (VS Code): clic derecho en `index.html` → *Open with Live Server*.
- Con Node (si tienes `npx`):
```bash
npx serve .
```
- Con Python:
```bash
python3 -m http.server 8080
```
Abrir `http://localhost:8080` en el navegador.

API utilizada
- Devs API Hub — API Movies: https://devsapihub.com/api-movies
- Endpoints principales usados:
  - `GET /api-movies` — lista completa (se pagina en el cliente)
  - `GET /api-movies/:id` — detalle para el modal
  - `GET /api-movies/genre/:genre` — filtrado por género

Notas rápidas
- No hay dependencias ni build: basta servir los archivos estáticos.
- Si quieres, puedo hacer un commit con este cambio o levantar el servidor para que lo revises en el navegador.
