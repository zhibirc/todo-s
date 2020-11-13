/**
 * @overview Main application entry point.
 *
 * @module
 */

import './utils/error-interceptor.js';
import storage from './utils/storage.js';
import load from './utils/loader.js';
import app from './app.js';

app.addListeners({
    'auth:success': async data => {
        console.log('AUTH::success');

        storage.userInfo = data;

        try {
            app.dom.$app.innerHTML = await load(app.views.accessUser);
            app.init(app.views.accessUser);
        } catch ( exception ) {
            console.error(exception);
            //app.emit('logout');
        }
    },
    logout: () => {
        console.log('LOGOUT');

        sessionStorage.clear();
        localStorage.clear();
        location.reload();
    }
});

(async () => {
    if ( storage.userInfo ) {
        app.init(app.views.accessUser);
    } else {
        try {
            app.dom.$app.innerHTML = await load(app.views.accessGuest);
            app.init(app.views.accessGuest);
        } catch ( exception ) {
            console.error(exception);
        }
    }
})();
