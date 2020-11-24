/**
 * @overview Application core.
 *
 * @module
 */

import config from './config';
import User from './models/user';
import EventEmitter from './utils/event.emitter.js';
import validate from './utils/validate.js';
import {$show, $hide, $find} from './utils/dom.js';
import Project from './components/project.js';
import Task from './components/task.js';

const noop = () => {};

const authorize = data => {
    return new Promise((resolve, reject) => {
        fetch(`${config.API_BASE_PATH_URL}/sessions`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if ( response.status >= 400 ) {
                    reject('Bad request');
                }

                return response.json();
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
};

const app = new EventEmitter();

Object.assign(app, {
    views: {
        accessGuest: '../../../src/views/guest/index.html',
        accessUser:  '../../../src/views/user/index.html'
    },
    dom: {
        $html: document.documentElement,
        $app: $find('#app'),
        $preloader: $find('.preloader')
    },
    data: {
        storage: {
            theme: config.UI_THEME
        },
        runtime: null
    }
});

app.login = async data => {
    if ( validate.login(data.login) && validate.password(data.password) ) {
        try {
            const response = await authorize({login: data.login, password: data.password});

            if ( !('sessionId' in response) ) {
                throw new Error('Server error, check your internet connection and try again');
            }

            app.emit('auth:success', {name: data.login, sessionId: response.sessionId});
        } catch ( exception ) {
            console.error(exception);

            $show('#login-error-info', exception.message);
            app.emit('auth:error');
        }
    } else {
        $show('#login-error-info');
    }
};

app.checkLogin = async data => {
    try {
        const response = await authorize(data);

        if ( !('logged' in response) ) {
            throw new Error('Server error, check your internet connection and try again');
        }

        if ( response.logged ) {
            app.emit('auth:success', data);
        } else {
            app.emit('logout');
        }
    } catch ( exception ) {
        console.error(exception);

        $show('#login-error-info', exception.message);
        app.emit('auth:error');
    }
};

app.initUser = async data => {
    app.user = new User(data);
    app.user.data = await app.user.findAll();
};

// TODO: think about Garbage Collection for pointers from obsolete views
app.init = view => {
    const hideModal = () => {
        $find('.modal.is-active').classList.remove('is-active');
        app.dom.$html.classList.remove('is-clipped');
    };

    let handlers;

    if ( view === app.views.accessGuest ) {
        const hideModalAuth = () => hideModal() && ($find('#login').value = $find('#password').value = '');

        handlers = {
            'button-login-form-show': () => {
                $find('#modal-auth').classList.add('is-active');
                app.dom.$html.classList.add('is-clipped');
            },
            'button-work-offline-info-show': () => {
                $find('#modal-accept-offline').classList.add('is-active');
                app.dom.$html.classList.add('is-clipped');
            },
            'modal-background': hideModalAuth,
            'button-login': async () => {
                $show(app.dom.$preloader);
                await app.login({login: $find('#login').value, password: $find('#password').value});
                $hide(app.dom.$preloader);
            },
            'button-offline-accept': () => {
                $show(app.dom.$preloader);
                app.emit('work:offline');
                hideModal();
                $hide(app.dom.$preloader);
            },
            'button-login-cancel':   hideModalAuth,
            'button-offline-cancel': hideModal,
            'modal-close':           hideModalAuth
        };
    } else {
        // TODO: implement Tabs component
        app.dom.$tabs = $find('#tabs');
        app.dom.$tabsContent = $find('#tabs-content');
        app.dom.$tabs.addEventListener('click', event => {
            const $tab = event.target.closest('li');

            Project.activate($tab);
            [...app.dom.$tabsContent.children].forEach($hide);
            $show($find(`section[data-content="${$tab.dataset.content}"]`));
        });

        app.dom.$tabsContent.addEventListener('click', event => {
            console.log(event.target.closest('button'));
        });

        app.user.data.forEach((project, index) => {
            project = new Project(project);

            const $section = document.createElement('section');
            $hide($section);

            $section.dataset.content = index;

            project.tasks.forEach(task => {
                task = new Task(task);

                $section.appendChild(task.$node);
            });

            app.dom.$tabs.appendChild(project.$node);
            app.dom.$tabsContent.appendChild($section);

            if ( index === app.user.data.length - 1 ) {
                Project.activate(project.$node);
                $show($section);
            }
        });

        handlers = {
            'button-create-project-form-show': () => {
                $find('#modal-create-project').classList.add('is-active');
                app.dom.$html.classList.add('is-clipped');
            },
            'button-create-project': async () => {
                const data = {
                    name:        $find('#input-project-name').value,
                    description: $find('#input-project-description').value
                };

                try {
                    const project = new Project(data);

                    $show(app.dom.$preloader);
                    await app.user.create(User.RESOURCE_TYPE_PROJECT, {name: project.name, description: project.description});
                    app.dom.$tabs.appendChild(project.$node);
                } catch ( exception ) {
                    console.error(exception);
                }

                hideModal();
                $hide(app.dom.$preloader);
            },
            'button-cancel-project': hideModal,
            'modal-background': hideModal,
            'modal-close':      hideModal,
            'button-logout':    () => app.emit('logout')
        };
    }

    window.addEventListener('click', event => (handlers[event.target.id || event.target.classList[0]] || noop)());
};


export default app;
