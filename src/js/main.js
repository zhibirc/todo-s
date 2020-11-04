/**
 * @overview Main application entry point.
 *
 * @module
 */

import './utils/error-interceptor.js';
import storage from './utils/storage.js';
import app from './app.js';

app.dom.$iframe = document.createElement('iframe');
app.dom.$iframe.sandbox = 'allow-same-origin allow-scripts';

window.addEventListener('message', event => {
    let message;

    try {
        message = JSON.parse(event.data);
    } catch ( error ) {
        message = event.data ? {subject: event.data} : 'unknown';
    }

    switch ( message.subject ) {
        case 'login':
            app.emit('login', message.data);
            break;
        default:
            console.error('I don\'t know nothing about message: ', message);
    }
});

app.addListeners({
    'auth:success': data => {
        console.log('User is authorized successfully!');
    },
    'auth:error': () => app.dom.$iframe.contentWindow.postMessage('auth:error', '*')
});

if ( storage.userInfo ) {
    app.dom.$iframe.src = 'src/views/private/index.html';
    app.dom.body.appendChild(app.dom.$iframe);
    app.dom.body.classList.add(`ui-theme-${app.data.storage.theme}`);

    app.load();
} else {
    app.dom.$iframe.src = 'src/views/public/index.html';
    app.dom.body.appendChild(app.dom.$iframe);
}
