/**
 * @overview Basic methods for simplifying manipulations with DOM.
 *
 * @module
 */

/**
 * Show DOM element.
 *
 * @param {string|Element} value - DOM selector or DOM element to show
 */
export function $show ( value, text ) {
    const $element = typeof value === 'string' ? $find(value) : value;

    text && ($element.textContent = text);
    $element.classList.remove('hidden');
}


/**
 * Hide DOM element.
 *
 * @param {string|Element} value - DOM selector or DOM element to hide
 */
export function $hide ( value ) {
    const $element = typeof value === 'string' ? $find(value) : value;

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


/**
 *
 * @param {string} htmlString - HTML to parse into DOM element
 *
 * @return {Element} created DOM element
 */
export function $getNodeFromString ( htmlString ) {
    const div = document.createElement('div');

    div.innerHTML = htmlString;

    return div.firstElementChild;
}
