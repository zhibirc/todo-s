/**
 * Login page implementation.
 */

'use strict';

const app = require('../app');

// ENTER
// TODO: check for cross-browsing
const enterKeyListener = event => event.keyCode === 13 && loginButtonHandler();

// TODO: implement
const inputs = {
    // placeholder "'Type here'"
    email: null,
    password: null
};

const validateLoginForm = (email, password) => {
    const validate = require('<validator>'); // TODO: implement

    let isLoginFormValid = true;

    if ( !validate.email(email.value) || !validate.password(password.value) ) {
        isLoginFormValid = false;
    } else {
        // set state
    }

    return isLoginFormValid;
};

const loginButtonHandler = async function loginButtonHandler () {
    if ( validateLoginForm(inputs.email, inputs.password) ) {
        app.preloader.hidden = false;

        try {
            await app.authorize(inputs.email.value, inputs.password.value);
            // authorize
        } catch ( error ) {
            // set invalid state
        }

        app.preloader.hidden = true;
    }
};

// set handler for Login button such as "loginButtonHandler"

// public
module.exports = {}; // fixme
