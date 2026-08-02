// js/utils/dom.js
// Pequeñas utilidades de DOM reutilizables en toda la aplicación.

/**
 * Atajo para querySelector.
 * @param {string} selector
 * @param {ParentNode} [parent]
 */
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Crea un elemento del DOM con atributos y clases dadas.
 * @param {string} tag
 * @param {Object} [options]
 * @param {string} [options.className]
 * @param {string} [options.text]
 * @param {string} [options.html]
 * @param {Object<string,string>} [options.attrs]
 */
export function createEl(tag, { className, text, html, attrs } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  if (html !== undefined) el.innerHTML = html;
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

/**
 * Vacía por completo un contenedor del DOM.
 * @param {HTMLElement} node
 */
export function clearNode(node) {
  node.replaceChildren();
}

/**
 * Devuelve una versión "debounced" de una función: solo se ejecuta
 * después de que pase `delay` ms sin nuevas llamadas. Se usa en el
 * campo de búsqueda para no filtrar en cada tecla presionada.
 * @param {Function} fn
 * @param {number} delay
 */
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
