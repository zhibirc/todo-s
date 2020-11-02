/**
 * @overview Application core.
 *
 * @module
 */

import config from './config';
import validate from './utils/validate';
import {$find} from './utils/dom';

const auth = {};

const app = {
    dom: {
        preloader: $find('.preloader'),
        modals: {
            auth: $find('.modal-auth')
        },
        buttons: {
            login: $find('.button-login'),
            createProject: $find('.button-create-project')
        }
    },
    data: {
        storage: null,
        runtime: null
    }
};

/**
 * Sugar wrapper around native `fetch`.
 *
 * @param {string} url - base url for request
 * @param {object} config - native fetch configuration
 * @param {object} options - URL parameters
 *
 * @return {object} response - API response
 *
 * @example
 * app.fetch('api/endpoints', {method: 'GET'}, {userId:3, typeId:4, meter.resourceTypeId: 2, with: ['users', 'meters']})
 */
app.fetch = (url, config = {}, options) => {
    let response;

    if ( config.headers ) {
        config.headers['Content-type'] = 'application/json';
    } else {
        config.headers = {
            'Content-type': 'application/json'
        };
    }

    // TODO: refactor
    // dealing with "options"

    console.info('api:get:', url);

    response = fetch(
        API_BASE_PATH_URL + url,
        config
    ).then(async fetchResponse => {
        if ( fetchResponse.status === 401 ) {
            console.log('bad request');
            try {
                // fixme

                return app.fetch(url, config);
            } catch ( error ) {
                console.error(error);
                app.emit('auth:error');
            }

            return false;
        }

        return fetchResponse;
    });

    return response;
};

app.authorize = (email, password) => {
    return new Promise((resolve, reject) => {
        fetch(API_BASE_PATH_URL, {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                const User = null; // fixme: get user!!!

                // fixme
                app.user = {};

                resolve(app.user);
            })
            .catch(error => console.error(error) && reject(error));
    });
};

// TODO: rework
app.logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    location.reload();
};

app.init = () => new Promise(resolve => {
    const User = null; // TODO: implement

    // TODO: init actions probably should be here
});

app.createRequest = (method, url) => {
    const request = new XMLHttpRequest();

    request.open(method, app.config.API_BASE_PATH_URL + url);
    //request.setRequestHeader();

    return request;
};

export default app;
