/**
 * @overview Main application entry point.
 *
 * @module
 */

import './utils/error-interceptor.js';
import storage from './utils/storage.js';
import app from './app.js';
import request from "./utils/request.js";

window.app = app;

const views = {
    accessPublic:  'src/views/public/index.html',
    accessPrivate: 'src/views/private/index.html'
};

app.addListeners({
    'auth:success': data => {
        storage.userInfo = JSON.stringify(data);
        app.load();
    },
    'auth:error': () => {},
    logout: () => {
        sessionStorage.clear();
        localStorage.clear();
        location.reload();
    }
});

if ( storage.userInfo ) {
    app.dom.body.classList.add(`ui-theme-${app.data.storage.theme}`);
    app.initWindowEvents();
} else {
    request('GET', views.accessPublic, (text, status) => {
        if ( status === 200 ) {
            app.dom.$app.innerHTML = text;
            app.initWindowEvents();
        }
    });
}
