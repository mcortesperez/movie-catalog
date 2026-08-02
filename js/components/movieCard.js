// js/components/movieCard.js
// Componente "tarjeta de película": recibe los datos de una película y
// devuelve un elemento del DOM completamente armado. No conoce nada del
// resto de la aplicación (ni fetch, ni paginación), solo sabe renderizar.

import { createEl } from "../utils/dom.js";
import { FALLBACK_POSTER } from "../config.js";

/**
 * Construye el bloque de estrellas (0 a 5) a partir del rating numérico.
 * @param {number} stars
 */
function buildStars(stars) {
  const rounded = Math.round(Number(stars) || 0);
  const full = "★".repeat(Math.max(0, Math.min(5, rounded)));
  const empty = "☆".repeat(5 - Math.max(0, Math.min(5, rounded)));
  return `${full}${empty}`;
}

/**
 * Crea el elemento <article> de una tarjeta de película.
 * @param {Object} movie
 * @param {(id:number) => void} onSelect callback ejecutado al hacer clic/Enter en la tarjeta
 * @returns {HTMLElement}
 */
export function createMovieCard(movie, onSelect) {
  const { id, title, year, image_url, genre = [], stars } = movie;

  const card = createEl("article", {
    className: "movie-card",
    attrs: { tabindex: "0", role: "button", "aria-label": `Ver detalle de ${title}` },
  });

  const posterWrap = createEl("div", { className: "movie-card__poster-wrap" });

  const poster = createEl("img", {
    className: "movie-card__poster",
    attrs: { src: image_url, alt: `Póster de ${title}`, loading: "lazy" },
  });
  poster.addEventListener("error", () => {
    poster.src = FALLBACK_POSTER;
  });

  const overlay = createEl("div", { className: "movie-card__overlay" });
  const overlayLabel = createEl("span", { className: "movie-card__overlay-label", text: "Ver detalles" });
  overlay.append(overlayLabel);

  posterWrap.append(poster, overlay);

  const body = createEl("div", { className: "movie-card__body" });
  const titleEl = createEl("h3", { className: "movie-card__title", text: title });
  const meta = createEl("div", { className: "movie-card__meta" });
  const yearEl = createEl("span", { className: "movie-card__year", text: String(year) });
  const starsEl = createEl("span", {
    className: "movie-card__stars",
    text: buildStars(stars),
    attrs: { "aria-label": `Calificación ${stars} de 5` },
  });
  meta.append(yearEl, starsEl);

  const chips = createEl("div", { className: "movie-card__genres" });
  genre.slice(0, 2).forEach((g) => {
    chips.append(createEl("span", { className: "chip", text: g }));
  });

  body.append(titleEl, meta, chips);
  card.append(posterWrap, body);

  const activate = () => onSelect(id);
  card.addEventListener("click", activate);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });

  return card;
}
