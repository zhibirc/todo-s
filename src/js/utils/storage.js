/**
 * @overview Convenient implementation for working with Local Storage.
 *
 * @module
 */

import config from '../config.js';

const storage = {
    get userInfo () {
        return localStorage.getItem(config.STORAGE_KEY_USER_INFO);
    },

    set userInfo ( value ) {
        if ( Object.prototype.toString.call(value) !== '[object Object]' ) {
            throw new Error('Saved data should be Object');
        }

        localStorage.setItem(config.STORAGE_KEY_USER_INFO, JSON.stringify(value));
    },

    get appData () {
        return localStorage.getItem(config.STORAGE_KEY_APP_DATA);
    },

    set appData ( value ) {
        if ( Object.prototype.toString.call(value) !== '[object Object]' ) {
            throw new Error('Saved data should be Object');
        }

        let appData = this.appData;

        try {
            appData = JSON.parse(appData);
        } catch ( error ) {
            appData = {};

            console.error(error);
        }

        localStorage.setItem(
            config.STORAGE_KEY_APP_DATA,
            Object.assign(appData, JSON.stringify(value))
        );
    }
};


export default storage;
