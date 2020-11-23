/**
 * @overview Main application entry point.
 *
 * @module
 */

import './utils/error-interceptor.js';
import config from './config.ts';
import storage from './utils/storage.ts';
import load from './utils/loader.js';
import app from './app.js';

app.addListeners({
    'auth:success': async data => {
        console.log('AUTH::success');

        await storage.setUserInfo(data);

        try {
            await app.initUser(data);
            app.dom.$app.innerHTML = await load(app.views.accessUser);
            app.init(app.views.accessUser);
        } catch ( exception ) {
            console.error(exception);
            location.reload();
        }
    },
    'auth:error': error => {},
    logout: async () => {
        await storage.clear();
        location.reload();
    }
});

(async () => {
    try {
        let userInfo = await storage.getUserInfo();

        if ( userInfo ) {
            if ( userInfo.sessionId ) {
                await app.checkLogin({login: userInfo.login, sessionId: userInfo.sessionId});
            } else {
                const data = {
                    [config.STORAGE_KEY_USER_INFO]: userInfo,
                    [config.STORAGE_KEY_APP_DATA]: await storage.getAppData()
                };

                throw new Error(`Local storage data is corrupt: ${JSON.stringify(data)}`);
            }
        } else {
            // fresh session, maybe after logout, browser data cleaning or brand-new user
            app.dom.$app.innerHTML = await load(app.views.accessGuest);
            app.init(app.views.accessGuest);
        }
    } catch ( exception ) {
        // storage data is corrupt
        console.error(exception);

        await storage.clear();
        app.dom.$app.innerHTML = await load(app.views.accessGuest);
        app.init(app.views.accessGuest);
    }
})();
