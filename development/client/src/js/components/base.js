/**
 * @overview Base component implementation.
 * @class
 * @module
 */

import EventEmitter from '../utils/event.emitter.js';
import {$show, $hide, $find} from '../utils/dom.js';

const counters = {};

export default class Base extends EventEmitter {
    constructor ( config = {} ) {
        super(config);

        let classList;
        let modifiers;

        /** @protected */
        this.internals = {
            hidden: false,
            focusable: false,
            focused: false
        };

        // apply custom name
        if ( config.name ) {
            this.name = config.name;
        } else {
            this.name = this.constructor.name;
        }

        // component DOM container (empty div in case nothing is given)
        this.$node = config.$node || document.createElement('div');

        // sanitize
        modifiers = config.modifiers || [];

        classList = [this.name, ...config.classList || []];

        // there are some block modifiers
        if ( modifiers.length ) {
            // build class names
            modifiers.forEach(modifier => classList.push(this.name + '--' + modifier));
        }

        // append all new classes to the existing ones
        this.$node.className = (this.$node.className ? this.$node.className + ' ' : '') + classList.join(' ');

        config.focusable && (this.focusable = true);

        // set focus if can and necessary
        config.focusable && config.focused && (this.focused = true);

        // visibility
        config.hidden && (this.hidden = true);

        config.content && this.add.apply(this, config.content);

        // apply all given events
        config.events && this.addListeners(config.events);

        // component activation by mouse
        this.$node.addEventListener('click', event => {
            if ( event.button === 0 ) {
                /**
                 * Mouse click event.
                 *
                 * @event module:stb/component~Component#click
                 *
                 * @type {Object}
                 * @property {Event} event click event data
                 */
                this.events.click && this.emit('click', event);

                // apply focus if not canceled
                !event.defaultPrevented && this.internals.focusable && this.$node.focus();
            }
        });
    }

    /**
     * Add a new component as a child.
     *
     * @param {...Component} [children] - variable number of elements to append
     *
     * //@files Component#add
     *
     * @example
     * panel.add(
     *     new Button( ... ),
     *     new Button( ... )
     * );
     */
    add ( ...children ) {
        // walk through all the given elements
        children.forEach(child => {
            this.$node.appendChild(child.$node || child);
            child.parent = this;
        });
    }

    /**
     * Delete this component and clear all associated events.
     *
     * //@fires module:stb/component~Component#remove
     */
    remove () {
        const $parent = this.$node.parentNode;

        // clear DOM
        $parent && $parent.removeChild(this.$node);

        // notify listeners
        this.events.remove && this.emit('remove');

        // remove all listeners
        this.events = {};
    }

    get focusable () {
        return this.internals.focusable;
    }

    set focusable ( value ) {
        // sanitize
        value = !!value;

        // nothing has changed
        if ( this.internals.focusable === value ) {
            console.warn('focusable: current and new values are identical', value, this);
        } else {
            const nodeClass = this.name + '--focused';

            // save
            this.internals.focusable = value;

            // apply
            if ( value ) {
                // has focus
                this.$node.setAttribute('tabIndex', '0');

                // prepare focus handlers
                this.internals.onfocus = event => {
                    // apply
                    this.$node.classList.add(nodeClass);
                    // notify listeners
                    this.events.focus && this.emit('focus', event);
                };
                this.internals.onblur = event => {
                    // apply
                    this.$node.classList.remove(nodeClass);
                    // notify listeners
                    this.events.blur && this.emit('blur', event);
                };

                // add handlers
                this.$node.addEventListener('focus', this.internals.onfocus);
                this.$node.addEventListener('blur', this.internals.onblur);
            } else {
                // does not have focus
                this.$node.removeAttribute('tabIndex');

                // remove handlers
                this.$node.removeEventListener('focus', this.internals.onfocus);
                this.$node.removeEventListener('blur', this.internals.onblur);

                // clear
                delete this.internals.onfocus;
                delete this.internals.onblur;

                // blur just in case
                this.focused = false;
            }
        }
    }

    get focused () {
        return this.internals.focused;
    }

    set focused ( value ) {
        // apply
        if ( value ) {
            this.$node.focus();

            if ( document.activeElement !== this.$node ) {
                console.warn('focused: fail to focus or not focusable', value, this);
            }
        } else {
            this.$node.blur();
        }
    }

    get hidden () {
        return this.internals.hidden;
    }

    set hidden ( value ) {
        const nodeClass = this.name + '--hidden';

        // sanitize
        value = !!value;

        // nothing has changed
        if ( this.internals.hidden === value ) {
            console.warn('hidden: current and new values are identical', value, this);
        } else {
            // save
            this.internals.hidden = value;

            // apply
            if ( value ) {
                // hide
                this.$node.classList.add(nodeClass);
                // notify listeners
                this.events.hide && this.emit('hide');
            } else {
                // show
                this.$node.classList.remove(nodeClass);
                // notify listeners
                this.events.show && this.emit('show');
            }
        }
    }
}
