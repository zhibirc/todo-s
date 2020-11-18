/**
 * @overview Application core.
 *
 * @module
 */

import config from './config.js';
import User from './models/user.js';
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
        accessGuest: 'src/views/guest/index.html',
        accessUser:  'src/views/user/index.html'
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
            'modal-background': hideModalAuth,
            'button-login': async () => {
                $show(app.dom.$preloader);
                await app.login({login: $find('#login').value, password: $find('#password').value});
                $hide(app.dom.$preloader);
            },
            'button-login-cancel': hideModalAuth,
            'modal-close':         hideModalAuth
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

/*
var APP = (function () {
    'use strict';

    var app = {
        // Save shorthand and quickly access link to the localStorage object.
        db: localStorage,
        // Save shorthand and quickly access link to the document object.
        // As for this technique it significantly increases performance when we want to get acccess to the DOM or BOM.
        doc: document,
        objProto: Object.prototype,
        setPrefs: function (event, DB, dbLen, doc, settingsContainer, tasksContainer, overlay, popup, newItem) {
            var target = event.target,
                buttonBars = doc.getElementById('toggle_menu'),
                hasOwn = this.objProto.hasOwnProperty,
                themeItems,
                i;

            target.classList.contains('fa-bars') && buttonBars.classList.toggle('active');

            target.classList.contains('fa-unlock') && this.buildDefense(1, doc, settingsContainer, tasksContainer);
            target.classList.contains('fa-lock') && this.buildDefense(0, doc, settingsContainer, tasksContainer);

            if (target.tagName === 'LI') {
                if (target.hasAttribute('data-lang-switch')) {
                    overlay.classList.remove('hidden');
                    popup.classList.remove('hidden');
                    popup.dataset.aim = 'lang';
                } else if (target.hasAttribute('data-theme') && !target.classList.contains('active')) {
                    themeItems = doc.querySelectorAll('[data-theme]');
                    i = themeItems.length;

                    this.changeTheme(target.dataset.langEn.split(' ')[0].toLowerCase());

                    while (i--) {
                        themeItems[i].classList.toggle('active');
                    }
                } else if (target.hasAttribute('data-clear')) {
                    for (i in DB) {
                        if (hasOwn.call(DB, i) && !isNaN(i)) {
                            this.dbOperate('remove', i);
                        }
                    }
                    tasksContainer.innerHTML = newItem.join('0');
                    this.setStats(doc, tasksContainer);
                }
            }
        },
        changeTheme: function (newStyle) {
            var themeName = newStyle + '-theme',
                docBody = this.doc.body;

            docBody.className = '';
            docBody.classList.add(themeName);
            this.dbOperate('insert', 'theme', themeName);
        },
        pageTranslate: function (doc, currentLang) {
            var elems = doc.querySelectorAll('[data-lang-' + currentLang + ']'),
                i = elems.length,
                elem;

            while (i--) {
                elem = elems[i];
                // One of the fastest way nowdays to capitalize strings.
                elem.textContent = elem.dataset['lang' + currentLang.charAt(0).toUpperCase() + currentLang.substring(1)];
            }
        },
        setStats: function (doc, tasksContainer) {
            var totalCell = doc.getElementById('stat_total'),
                doneCell = doc.getElementById('stat_done'),
                planCell = doc.getElementById('stat_plan'),
                total = totalCell.textContent = tasksContainer.childNodes.length - 1,
                done = doneCell.textContent = tasksContainer.querySelectorAll('button[data-state="X"]').length;

            planCell.textContent = total - done;
        },
        listSort: function (event, doc, tasksContainer) {
            var target = event.target,
                doneTasks = tasksContainer.querySelectorAll('label[data-state="X"]'),
                doneTasksLen = doneTasks.length,
                fragment = doc.createDocumentFragment(),
                i;

            for (i = 0; i < doneTasksLen; i += 1) {
                fragment.appendChild(doneTasks[i]);
            }

            if (!target.dataset.state || target.dataset.state === 'asc') {
                tasksContainer.insertBefore(fragment, tasksContainer.firstChild);
                target.dataset.state = 'desc';
            } else {
                tasksContainer.insertBefore(fragment, tasksContainer.lastChild);
                target.dataset.state = 'asc';
            }
        },
        todoCreate: function (event, doc, tasksContainer, newItem) {
            var target = event.target,
                item = target.parentNode,
                input = target.previousSibling,
                trash = '<i class="fa fa-trash-o"></i>';

            if (target.tagName !== 'BUTTON' || !target.previousSibling.value) {
                return;
            }

            switch (target.dataset.state) {
                case 'add':
                    target.textContent = '−';
                    target.dataset.state = 'done';
                    tasksContainer.insertAdjacentHTML('beforeEnd', newItem.join(this.db.length + ''));
                    input.setAttribute('value', input.value);
                    input.dataset.id = this.db.length;
                    this.dbOperate('insert', this.db.length, item.outerHTML);
                    break;
                case 'done':
                    input.setAttribute('disabled', 'disabled');
                    input.classList.add('shadow');
                    target.innerHTML = trash;
                    target.dataset.state = item.dataset.state = 'X';
                    this.dbOperate('update', input.dataset.id, item.outerHTML);
                    break;
                case 'X':
                    item.parentNode.removeChild(item);
                    this.dbOperate('remove', input.dataset.id);
            }

            this.setStats(doc, tasksContainer);
        },

        buildDefense: function (flag, doc, settingsContainer, tasksContainer) {
            var lockIcon = doc.getElementById('fa_lock'),
                unlockIcon = doc.getElementById('fa_unlock'),
                menuIcon = doc.getElementById('fa_bars'),
                sortIcon = doc.getElementById('sort');

            if (flag === 1) {
                unlockIcon.classList.add('hidden');
                lockIcon.classList.remove('hidden');

                [menuIcon, settingsContainer, sortIcon, tasksContainer].forEach(function (elem) {
                    elem.classList.add('disabled');
                });

                this.dbOperate('insert', 'lock', 1);
            } else if (flag === 0) {
                unlockIcon.classList.remove('hidden');
                lockIcon.classList.add('hidden');

                [menuIcon, settingsContainer, sortIcon, tasksContainer].forEach(function (elem) {
                    elem.classList.remove('disabled');
                });

                this.dbOperate('insert', 'lock', 0);
            }

        },
        popupWork: function (event, doc, overlay, popup) {
            var target = event.target,
                popupAim = popup.dataset.aim;

            if (popupAim ==='lang' && !target.classList.contains('active')) {
                this.dbOperate('insert', 'lang', target.dataset.lang);
                this.pageTranslate(doc, target.dataset.lang);
                popup.querySelector('.active').classList.remove('active');
                target.classList.add('active');
            }

            overlay.classList.add('hidden');
            popup.classList.add('hidden');
            popup.dataset.aim = '';
        },
        dbOperate: function (operation, key, value) {
            var DB = this.db;

            switch (operation) {
                case 'insert':
                case 'update':
                    DB.setItem(key, value);
                    break;
                case 'select':
                    return DB.getItem(key);
                case 'remove':
                    DB.removeItem(key);
                    break;
                case 'clear':
                    DB.clear();
            }
        }
    };

    return {
        init: function () {
            // Get the link to the object property from outer scope to inner local variable to increase performance.
            var doc = app.doc,
                // Settings area in the header ("ul" HTML element/list).
                settingsContainer = doc.getElementById('settings'),
                // Container for todo-items.
                tasksContainer = doc.getElementById('task_section'),
                // Universal popup window for multiple purposes.
                popup = doc.getElementById('popup'),
                // Popup's overlay.
                overlay = doc.getElementById('overlay'),
                // Template for new empty "todo" text fields. It can be joined with one mutable part of an item - its id.
                newItem = ['<label><input maxlength="160" data-id="', '"><button data-state="add">&plus;</button></label>'],
                // Check possible places for preferred language with priority of user selection in app menu.
                lang = (app.dbOperate('select', 'lang') || navigator.language || navigator.browserLanguage).substr(0, 2),
                // List of currently accepted languages (in language codes).
                acceptedLangs = ['be', 'de', 'en', 'es', 'iw', 'ru', 'uk', 'fi', 'fr'],
                // Store link to the localStorage from object in external scope.
                DB = app.db,
                // Get value of localStorage built-in "length" property.
                dbLen = DB.length,
                // Create an array with fixed length to allocate continuous memory area (probably increases performance).
                storedTasks = Array(dbLen),
                // Utility variable to store temporary data (name of key in localStorage).
                key,
                // Cycle counter.
                i;

            // Check that the app is loaded/initialized and its init() method is called.
            // It's needed to prevent unnecessary init() invocations and hence unexpected behaviour.
            // First variant (presumably slower than the next one).
            //if (+app.dbOperate('select', 'executed')) return;
            // Second variant, use functions as objects.
            if (this.init.executed) return;
            // Set lock/unlock state of an app in according to saved user preferences in the previous session.
            app.buildDefense(+app.dbOperate('select', 'lock'), doc, settingsContainer, tasksContainer);
            // Set theme of an app in according to saved user preferences in the previous session or to default theme.
            doc.body.classList.add(app.dbOperate('select', 'theme') || 'light-theme');
            // Set state of the particular menu item (theme selection) in active.
            doc.querySelector('[data-theme="' + doc.body.className + '"]').classList.add('active');
            // If preferred language in any way (see "lang" variable above) exists in the preset of available translations,
            // or english as the default in this case, set its item in language menu to active state.
            doc.querySelector('[data-lang="' + (~acceptedLangs.indexOf(lang) ? lang : 'en') + '"]').classList.add('active');
            // Translate the page in according to selected language.
            app.pageTranslate(doc, lang);

            // If localStorage database is totally empty.
            if (!dbLen) {
                // Just insert one empty text field in the task list.
                tasksContainer.insertAdjacentHTML('beforeEnd', newItem.join('0'));
            } else {
                // Use for-loop for best performance.
                for (i = 0; i < dbLen; i += 1) {
                    // Get a key by escalating integer number.
                    key = DB.key(i);
                    // If key we got on the previous step is a valid number as a string (including 0).
                    if (!isNaN(key)) {
                        // Fill the predefined array with stored tasks.
                        storedTasks[+key] = app.dbOperate('select', key);
                    }
                }
                // And add this joined array to the tasks section as a whole piece of HTML.
                tasksContainer.insertAdjacentHTML('beforeEnd', storedTasks.join(''));
                // And finalize the list with empty text field.
                tasksContainer.insertAdjacentHTML('beforeEnd', newItem.join(dbLen + ''));
            }
            // Set tasks statistics: "total", "done", "planned".
            app.setStats(doc, tasksContainer);

            // Header section of the app.
            doc.getElementById('header').addEventListener('click', function (e) {
                // Stop event bubbling to the parent nodes (increase performance and prevent unnecessary triggering).
                e.stopPropagation();
                app.setPrefs(e, DB, dbLen, doc, settingsContainer, tasksContainer, overlay, popup, newItem);
            }, false);

            // Switcher for sorting.
            doc.getElementById('sort').addEventListener('click', function (e) {
                e.stopPropagation();
                app.listSort(e, doc, tasksContainer);
            }, false);

            // Section of tasks.
            tasksContainer.addEventListener('click', function (e) {
                e.stopPropagation();
                app.todoCreate(e, doc, tasksContainer, newItem);
            }, false);

            // Popup.
            popup.addEventListener('click', function (e) {
                e.stopPropagation();
                app.popupWork(e, doc, overlay, popup);
            }, false);
            // After initialization of an app change its status to prevent multiple invocations.
            this.init.executed = 1;
        }
    };
}());
*/

export default app;
