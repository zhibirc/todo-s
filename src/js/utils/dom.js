/**
 * @overview Basic methods for simplifying manipulations with DOM.
 *
 * @module
 */

/**
 * Show DOM element.
 *
 * @param {Element} $element - DOM element to show
 */
export function $show ( $element ) {
    $element.classList.remove('hidden');
}


/**
 * Hide DOM element.
 *
 * @param {Element} $element - DOM element to hide
 */
export function $hide ( $element ) {
    $element.classList.add('hidden');
}


/**
 * Find an element with given selector in DOM tree.
 *
 * @param {string} selector - string which represents valid DOM element selector
 *
 * @return {Element|null} selected element or `null` if it's absent
 */
export function $find ( selector ) {
    return document.querySelector(selector);
}
