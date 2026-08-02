// js/modules/pagination.js
// Lógica de paginación en el cliente. La API de películas no expone
// parámetros de página/offset (solo /limit/:limit), así que el listado
// completo se trae una vez y se recorta aquí en fragmentos de tamaño fijo.

import { createEl, clearNode } from "../utils/dom.js";

/**
 * Calcula el número total de páginas necesarias.
 * @param {number} totalItems
 * @param {number} perPage
 * @returns {number}
 */
export function getTotalPages(totalItems, perPage) {
  return Math.max(1, Math.ceil(totalItems / perPage));
}

/**
 * Devuelve el subconjunto de `items` correspondiente a `page`.
 * @param {Array} items
 * @param {number} page 1-indexado
 * @param {number} perPage
 */
export function paginate(items, page, perPage) {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

/**
 * Genera la lista de "páginas" a renderizar, colapsando rangos largos
 * con el marcador "…" (ej: 1 … 4 5 6 … 12).
 * @param {number} currentPage
 * @param {number} totalPages
 * @returns {Array<number|"...">}
 */
function buildPageList(currentPage, totalPages) {
  const delta = 1;
  const range = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }
  const withDots = [];
  let prev = 0;
  for (const page of range) {
    if (prev && page - prev > 1) withDots.push("...");
    withDots.push(page);
    prev = page;
  }
  return withDots;
}

/**
 * Renderiza los controles de paginación (anterior / números / siguiente)
 * dentro del contenedor dado.
 * @param {HTMLElement} container
 * @param {Object} options
 * @param {number} options.currentPage
 * @param {number} options.totalPages
 * @param {(page:number) => void} options.onPageChange
 */
export function renderPagination(container, { currentPage, totalPages, onPageChange }) {
  clearNode(container);

  if (totalPages <= 1) {
    container.closest("#pagination")?.setAttribute("hidden", "");
    return;
  }
  container.closest("#pagination")?.removeAttribute("hidden");

  const makeButton = (label, targetPage, { disabled = false, current = false, ariaLabel } = {}) => {
    const btn = createEl("button", {
      className: `pagination__btn${current ? " pagination__btn--current" : ""}`,
      text: label,
      attrs: {
        type: "button",
        ...(disabled ? { disabled: "disabled" } : {}),
        ...(current ? { "aria-current": "page" } : {}),
        "aria-label": ariaLabel || `Ir a la página ${targetPage}`,
      },
    });
    if (!disabled && !current) {
      btn.addEventListener("click", () => onPageChange(targetPage));
    }
    return btn;
  };

  container.append(
    makeButton("‹ Anterior", currentPage - 1, {
      disabled: currentPage === 1,
      ariaLabel: "Ir a la página anterior",
    })
  );

  for (const page of buildPageList(currentPage, totalPages)) {
    if (page === "...") {
      container.append(createEl("span", { className: "pagination__ellipsis", text: "…" }));
    } else {
      container.append(makeButton(String(page), page, { current: page === currentPage }));
    }
  }

  container.append(
    makeButton("Siguiente ›", currentPage + 1, {
      disabled: currentPage === totalPages,
      ariaLabel: "Ir a la página siguiente",
    })
  );
}
