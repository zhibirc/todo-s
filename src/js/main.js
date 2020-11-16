/**
 * @overview Main application entry point.
 *
 * @module
 */

import './utils/error-interceptor.js';
import config from './config.js';
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
            location.reload();
        }
    },
    'auth:error': error => {},
    logout: () => {
        console.log('LOGOUT');

        sessionStorage.clear();
        localStorage.clear();
        location.reload();
    }
});

(async () => {
    try {
        if ( storage.userInfo ) {
            const userInfo = JSON.parse(storage.userInfo);

            if ( userInfo.sessionId ) {
                await app.checkLogin({login: userInfo.login, sessionId: userInfo.sessionId});
            } else {
                const data = {
                    [config.STORAGE_KEY_USER_INFO]: storage.userInfo,
                    [config.STORAGE_KEY_APP_DATA]: storage.appData
                };

                throw new Error(`Local storage data is corrupt: ${JSON.stringify(data)}`);
            }
        } else {
            // fresh session, maybe after logout, browser data cleaning or brand-new user
            app.dom.$app.innerHTML = await load(app.views.accessGuest);
            app.init(app.views.accessGuest);
        }
    } catch ( exception ) {
        // local storage data is corrupt
        console.error(exception);

        sessionStorage.clear();
        localStorage.clear();
        app.dom.$app.innerHTML = await load(app.views.accessGuest);
        app.init(app.views.accessGuest);
    }
})();
