/**
 * @overview Main application entry point.
 *
 * @module
 */

import './utils/error-interceptor.js';
import storage from './utils/storage.js';
import app from './app.js';

window.app = app;

const views = {
    accessPublic:  'src/views/public/index.html',
    accessPrivate: 'src/views/private/index.html'
};

app.addListeners({
    'auth:success': data => {
        console.log('AUTH::success');

        storage.userInfo = JSON.stringify(data);
        app.load();
    },
    'auth:error': () => {
        console.log('AUTH::error');
    },
    logout: () => {
        sessionStorage.clear();
        localStorage.clear();
        location.reload();
    }
});

(async () => {
    if ( storage.userInfo ) {
        app.dom.body.classList.add(`ui-theme-${app.data.storage.theme}`);
        app.initWindowEvents();
    } else {
        const response = await fetch(views.accessPublic);

        if ( response.status === 200 /* response.ok */ ) {
            app.dom.$app.innerHTML = await response.text();
            app.initWindowEvents();
        }
    }
})();
