/**
 * Track and handle asynchronous promise rejections.
 *
 * @module
 */

'use strict';

const app = require('../app');

window.addEventListener('unhandledrejection', event => {
    // TODO: some actions with modal

    console.warn('Unhandled rejection from promise: ', event.promise);
});


// public
module.exports = {};
