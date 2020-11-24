/**
 * @overview Convenient implementation for working with browser storage as offline database backend.
 *
 * @module
 */

import config from '../config';
// TODO: there is one interesting alternative -- "PouchDB", research it later
import localForage from 'localforage';

localForage.config({
    driver: localForage.INDEXEDDB,
    name: config.PRODUCT_NAME,
    version: 1.0,
    description: 'User data storage/database for buffering/runtime or fully offline working mode.'
});

const storage = {
    getUserInfo: async () : Promise<object> => localForage.getItem(config.STORAGE_KEY_USER_INFO),

    setUserInfo: async (value: object) : Promise<object> => localForage.setItem(config.STORAGE_KEY_USER_INFO, value),

    getAppData: async () : Promise<object> => localForage.getItem(config.STORAGE_KEY_APP_DATA),

    setAppData: async (value: object) : Promise<object> => {
        let appData;

        try {
            appData = await storage.getAppData();
        } catch ( exception ) {
            appData = {};
        }

        return localForage.setItem(
            config.STORAGE_KEY_APP_DATA,
            Object.assign(appData, value)
        );
    },

    clear: async () : Promise<void> => {
        sessionStorage.clear();
        await localForage.clear();
    }
};


export default storage;
