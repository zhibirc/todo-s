/**
 * @overview Main application entry point.
 *
 * @module
 */

'use strict';

import './utils/error-interceptor.js';
import storage from './utils/storage.js';
import app from './app.js';

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
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
    app.dom.root.className = 'private';
    app.dom.body.classList.add(`ui-theme-${app.data.storage.theme}`);
    app.init(true);
} else {
    app.dom.root.className = 'public';
}

app.dom.body.classList.remove('hidden');
