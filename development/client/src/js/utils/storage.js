/**
 * @overview Convenient implementation for working with browser storage as offline database backend.
 *
 * @module
 */

import config from '../config.ts';

// TODO: there is one interesting alternative -- "PouchDB", research it later
const localForage = require('localforage');

localForage.config({
    driver: localForage.INDEXEDDB,
    name: config.PRODUCT_NAME,
    version: 1.0,
    // size of database, in bytes, WebSQL-only for now
    //size: 4980736,
    // should be alphanumeric, with underscores
    //storeName: 'keyvaluepairs',
    description: 'User data storage/database for buffering/runtime or fully offline working mode.'
});

const storage = {
    getUserInfo: async () => localForage.getItem(config.STORAGE_KEY_USER_INFO),

    setUserInfo: async value => await localForage.setItem(config.STORAGE_KEY_USER_INFO, value),

    getAppData: async () => localForage.getItem(config.STORAGE_KEY_APP_DATA),

    setAppData: async value => {
        let appData = this.appData;

        try {
            appData = JSON.parse(appData);
        } catch ( exception ) {
            appData = {};

            console.error(exception);
        }

        await localForage.setItem(
            config.STORAGE_KEY_APP_DATA,
            Object.assign(appData, value)
        );
    },

    clear: async () => {
        sessionStorage.clear();
        await localForage.clear();
    }
};


export default storage;
