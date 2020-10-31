/**
 * @overview Main application entry point.
 *
 * @module
 */

'use strict';

import './error-interceptor';
import {app} from './app';

// Get the modal
var modal = document.getElementById('auth-modal');

window.addEventListener('unhandledrejection', event => {
    // TODO: some actions with modal

    console.warn('Unhandled rejection from promise: ', event.promise);
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if ( event.target === modal ) {
        modal.style.display = 'none';
    }
}

// TODO: set pointers to views

//app.preloader = new Preloader();
//document.body.appendChild(app.preloader.$node);

require('error-interceptor');

app.once('auth:error', app.logout);

app.once('authorize', async () => {
    // TODO: init main view

    if ( location.pathname === '/login' ) {
        // TODO: go to root
    }
});

// app.init();

if ( !app.user ) {
   // TODO: start authorization process
}
