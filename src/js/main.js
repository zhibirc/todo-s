/**
 * @overview Main application entry point.
 *
 * @module
 */

'use strict';

import 'utils/error-interceptor';
import {app} from './app';

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}


app.once('auth:error', app.logout);

app.once('authorize', async () => {
    // TODO: init main view

    if ( location.pathname === '/login' ) {
        // TODO: go to root
    }
});

app.init();

if ( !app.auth.user ) {
    // TODO: check also from storage because of reload page
}
