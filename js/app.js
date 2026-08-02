// js/app.js
// Punto de entrada de la aplicación. Mantiene el estado en memoria,
// conecta los eventos de la interfaz y coordina los demás módulos
// (servicio de API, componentes y paginación). No contiene lógica de
// fetch ni de construcción de DOM de bajo nivel: eso vive en sus
// respectivos módulos.

import { MOVIES_PER_PAGE, SEARCH_DEBOUNCE_MS } from "./config.js";
import { getAllMovies, getMovieById, getMoviesByGenre } from "./api/movieService.js";
import { createMovieCard } from "./components/movieCard.js";
import { openModal, renderModalLoading, renderModalError, renderModalContent } from "./components/modal.js";
import { paginate, getTotalPages, renderPagination } from "./modules/pagination.js";
import { qs, clearNode, debounce } from "./utils/dom.js";

// ---- Referencias al DOM --------------------------------------------------

const grid = qs("#movie-grid");
const paginationControls = qs("#pagination-controls");
const catalogMeta = qs("#catalog-meta");
const statusRegion = qs("#status-region");
const searchInput = qs("#search-input");
const genreSelect = qs("#genre-select");

// ---- Estado en memoria ----------------------------------------------------

const state = {
  allMovies: [], // catálogo completo, tal como llega de la API
  baseMovies: [], // subconjunto activo según el filtro de género
  searchTerm: "",
  currentPage: 1,
};

// ---- Utilidades de render de estado ---------------------------------------

function showStatus(message, { isError = false } = {}) {
  statusRegion.hidden = false;
  statusRegion.setAttribute("aria-busy", isError ? "false" : "true");
  statusRegion.className = `status-region${isError ? " status-region--error" : ""}`;
  clearNode(statusRegion);

  const text = document.createElement("p");
  text.textContent = message;
  statusRegion.append(text);

  if (isError) {
    const retryBtn = document.createElement("button");
    retryBtn.type = "button";
    retryBtn.className = "status-region__retry";
    retryBtn.textContent = "Reintentar";
    retryBtn.addEventListener("click", init);
    statusRegion.append(retryBtn);
  }
}

function hideStatus() {
  statusRegion.hidden = true;
  clearNode(statusRegion);
}

function renderCatalogMeta(visibleCount, totalCount) {
  clearNode(catalogMeta);
  const text = document.createElement("p");
  text.className = "catalog-meta__text";
  text.textContent =
    totalCount === 0
      ? "No se encontraron películas con los filtros actuales."
      : `Mostrando ${visibleCount} de ${totalCount} película${totalCount === 1 ? "" : "s"}.`;
  catalogMeta.append(text);
}

// ---- Derivación de datos visibles -----------------------------------------

function getFilteredMovies() {
  const term = state.searchTerm.trim().toLowerCase();
  if (!term) return state.baseMovies;
  return state.baseMovies.filter((movie) => movie.title.toLowerCase().includes(term));
}

// ---- Render del catálogo ---------------------------------------------------

function renderGrid() {
  const filtered = getFilteredMovies();
  const totalPages = getTotalPages(filtered.length, MOVIES_PER_PAGE);
  state.currentPage = Math.min(state.currentPage, totalPages);

  const pageItems = paginate(filtered, state.currentPage, MOVIES_PER_PAGE);

  clearNode(grid);
  pageItems.forEach((movie) => {
    grid.append(createMovieCard(movie, openMovieDetail));
  });

  renderCatalogMeta(pageItems.length, filtered.length);
  renderPagination(paginationControls, {
    currentPage: state.currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });
}

function handlePageChange(page) {
  state.currentPage = page;
  renderGrid();
  qs("#catalog-section").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---- Filtro de género -------------------------------------------------------

function populateGenreOptions(movies) {
  const genres = new Set();
  movies.forEach((movie) => (movie.genre || []).forEach((g) => genres.add(g)));

  [...genres]
    .sort((a, b) => a.localeCompare(b))
    .forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreSelect.append(option);
    });
}

async function handleGenreChange() {
  const genre = genreSelect.value;
  state.currentPage = 1;

  if (genre === "all") {
    state.baseMovies = state.allMovies;
    renderGrid();
    return;
  }

  try {
    genreSelect.disabled = true;
    state.baseMovies = await getMoviesByGenre(genre);
    renderGrid();
  } catch (error) {
    showStatus(error.message, { isError: true });
  } finally {
    genreSelect.disabled = false;
  }
}

// ---- Búsqueda por título ------------------------------------------------

const handleSearchInput = debounce((value) => {
  state.searchTerm = value;
  state.currentPage = 1;
  renderGrid();
}, SEARCH_DEBOUNCE_MS);

// ---- Detalle de película (modal) ------------------------------------------

async function openMovieDetail(id) {
  openModal();
  renderModalLoading();
  try {
    const movie = await getMovieById(id);
    renderModalContent(movie);
  } catch (error) {
    renderModalError(error.message);
  }
}

// ---- Inicialización ---------------------------------------------------------

async function init() {
  showStatus("Cargando catálogo…");
  grid.setAttribute("aria-busy", "true");

  try {
    const movies = await getAllMovies();
    state.allMovies = movies;
    state.baseMovies = movies;

    populateGenreOptions(movies);
    hideStatus();
    renderGrid();
  } catch (error) {
    showStatus(error.message, { isError: true });
    renderCatalogMeta(0, 0);
  } finally {
    grid.setAttribute("aria-busy", "false");
  }
}

searchInput.addEventListener("input", (event) => handleSearchInput(event.target.value));
genreSelect.addEventListener("change", handleGenreChange);
qs("#filters-form").addEventListener("submit", (event) => event.preventDefault());

init();
