/**
 * @overview Main application entry point.
 *
 * @module
 */

import './utils/error-interceptor.js';
import storage from './utils/storage.js';
import app from './app.js';

app.dom.$iframe = document.createElement('iframe');
app.dom.$iframe.sandbox = 'allow-scripts';

window.addEventListener('message', event => {
    console.log('Event from frame: ', event);
});

if ( storage.userInfo ) {
    app.dom.$iframe.src = 'src/views/private/index.html';
    app.dom.body.appendChild(app.dom.$iframe);
    app.dom.body.classList.add(`ui-theme-${app.data.storage.theme}`);

    app.load();
} else {
    app.dom.$iframe.src = 'src/views/public/index.html';
    app.dom.body.appendChild(app.dom.$iframe);
}
