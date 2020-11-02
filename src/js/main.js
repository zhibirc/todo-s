/**
 * @overview Main application entry point.
 *
 * @module
 */

import './utils/error-interceptor.js';
import storage from './utils/storage.js';
import app from './app.js';

app.dom.root.classList.remove('no-js');

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


if ( storage.userInfo ) {
    app.dom.body.classList.add(`ui-theme-${app.data.storage.theme}`);
    app.load();
}

app.dom.body.classList.remove('hidden');
