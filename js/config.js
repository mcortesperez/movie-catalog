// js/config.js
// Constantes centralizadas de la aplicación.
// Mantener aquí los valores "mágicos" facilita el mantenimiento del proyecto.

export const API_BASE_URL = "https://devsapihub.com/api-movies";

// Cantidad de tarjetas mostradas por página en el catálogo.
export const MOVIES_PER_PAGE = 8;

// Tiempo de espera (ms) para el debounce del campo de búsqueda.
export const SEARCH_DEBOUNCE_MS = 300;

// Ruta de imagen usada cuando el póster original falla al cargar.
export const FALLBACK_POSTER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
      <rect width="300" height="450" fill="#1E1D26"/>
      <text x="50%" y="50%" fill="#9C9AA5" font-family="sans-serif" font-size="18"
        text-anchor="middle" dominant-baseline="middle">Sin póster disponible</text>
    </svg>
  `);
