// js/components/modal.js
// Controla el modal de detalle de película: abrir, cerrar y pintar
// sus distintos estados (cargando, error, contenido).

import { qs, clearNode, createEl } from "../utils/dom.js";
import { FALLBACK_POSTER } from "../config.js";

const overlay = qs("#modal-overlay");
const body = qs("#modal-body");
const closeBtn = qs("#modal-close");

let lastFocusedElement = null;

export function openModal() {
  lastFocusedElement = document.activeElement;
  overlay.hidden = false;
  document.body.classList.add("no-scroll");
  closeBtn.focus();
}

export function closeModal() {
  overlay.hidden = true;
  document.body.classList.remove("no-scroll");
  if (lastFocusedElement) lastFocusedElement.focus();
}

export function renderModalLoading() {
  clearNode(body);
  body.append(createEl("p", { className: "modal__status", text: "Cargando detalle de la película…" }));
}

export function renderModalError(message) {
  clearNode(body);
  body.append(
    createEl("p", { className: "modal__status modal__status--error", text: message })
  );
}

/**
 * Pinta el contenido completo del modal para una película.
 * @param {Object} movie
 */
export function renderModalContent(movie) {
  const { title, description, year, image_url, genre = [], stars } = movie;
  clearNode(body);

  const poster = createEl("img", {
    className: "modal__poster",
    attrs: { src: image_url, alt: `Póster de ${title}` },
  });
  poster.addEventListener("error", () => {
    poster.src = FALLBACK_POSTER;
  });

  const info = createEl("div", { className: "modal__info" });
  const heading = createEl("h2", { className: "modal__title", text: title, attrs: { id: "modal-title" } });
  const metaLine = createEl("p", {
    className: "modal__meta",
    text: `${year} · ${Number(stars).toFixed(1)} / 5 ★`,
  });

  const genresWrap = createEl("div", { className: "modal__genres" });
  genre.forEach((g) => genresWrap.append(createEl("span", { className: "chip", text: g })));

  const desc = createEl("p", { className: "modal__description", text: description || "Sin descripción disponible." });

  info.append(heading, metaLine, genresWrap, desc);
  body.append(poster, info);
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !overlay.hidden) closeModal();
});
