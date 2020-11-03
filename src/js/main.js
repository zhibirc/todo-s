/**
 * @overview Main application entry point.
 *
 * @module
 */

import './utils/error-interceptor.js';
import storage from './utils/storage.js';
import app from './app.js';

window.onclick = event => {
    if ( event.target === app.dom.modals.auth ) {
        app.dom.modals.auth.classList.add('hidden');
    }
}


/*app.once('auth:error', app.logout);

app.once('authorize', async () => {
    // TODO: init main view

    if ( location.pathname === '/login' ) {
        // TODO: go to root
    }
});*/

app.dom.$iframe = document.createElement('iframe');

if ( storage.userInfo ) {
    app.dom.$iframe.src = 'src/views/private/index.html';
    app.dom.body.appendChild(app.dom.$iframe);
    app.dom.body.classList.add(`ui-theme-${app.data.storage.theme}`);

    app.load();
} else {
    app.dom.$iframe.src = 'src/views/public/index.html';
    app.dom.body.appendChild(app.dom.$iframe);
}
