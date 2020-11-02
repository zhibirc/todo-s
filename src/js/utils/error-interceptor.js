/**
 * @overview Module for handle uncaught errors and promises rejections.
 *
 * @module
 */

// listen to uncaught errors
window.addEventListener('error', event => {
    console.error('Error occurred during execution: ', event.error);
});

// listen to uncaught promises rejections
window.addEventListener('unhandledrejection', event => {
    console.warn('Unhandled rejection from promise: ', event.promise);
});
