// js/api/movieService.js
// Capa de acceso a datos: toda comunicación HTTP con la API de películas
// vive en este módulo. El resto de la aplicación nunca llama a fetch()
// directamente, sino que consume estas funciones.

import { API_BASE_URL } from "../config.js";

/**
 * Lanza un error legible a partir de una respuesta HTTP no exitosa.
 * @param {Response} response
 */
async function assertOk(response) {
  if (!response.ok) {
    throw new Error(
      `La API respondió con un error (HTTP ${response.status}) al consultar ${response.url}`
    );
  }
}

/**
 * Obtiene el listado completo de películas.
 * GET /api-movies
 * @returns {Promise<Array<Object>>}
 */
export async function getAllMovies() {
  try {
    const response = await fetch(API_BASE_URL);
    await assertOk(response);
    return await response.json();
  } catch (error) {
    console.error("[movieService] Error en getAllMovies:", error);
    throw new Error("No se pudo obtener el catálogo de películas. Intenta de nuevo.");
  }
}

/**
 * Obtiene una película específica por su identificador.
 * GET /api-movies/:id
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function getMovieById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    await assertOk(response);
    return await response.json();
  } catch (error) {
    console.error(`[movieService] Error en getMovieById(${id}):`, error);
    throw new Error("No se pudo cargar el detalle de esta película.");
  }
}

/**
 * Obtiene películas filtradas por uno o varios géneros.
 * GET /api-movies/genre/:genre  (admite "Drama,Crime")
 * @param {string} genre
 * @returns {Promise<Array<Object>>}
 */
export async function getMoviesByGenre(genre) {
  try {
    const response = await fetch(`${API_BASE_URL}/genre/${encodeURIComponent(genre)}`);
    if (response.status === 404) {
      // La API responde 404 cuando el género no tiene coincidencias.
      return [];
    }
    await assertOk(response);
    return await response.json();
  } catch (error) {
    console.error(`[movieService] Error en getMoviesByGenre(${genre}):`, error);
    throw new Error("No se pudo filtrar el catálogo por género.");
  }
}
