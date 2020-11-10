/**
 * @overview Todo class implementation.
 * @class
 * @module
 */

import Base from './base.js';

const TASK_STATE_NEW    = Symbol('TASK_STATE_NEW');
const TASK_STATE_DONE   = Symbol('TASK_STATE_DONE');
const TASK_STATE_UNDONE = Symbol('TASK_STATE_UNDONE');

export default class Task extends Base {
    constructor ( config = {} ) {
        super(config);

        // TODO: rework to JSX later
        this.$node = [
            '<div class="field">',
                '<div class="control is-loading">',
                    '<input class="input is-primary" type="text" placeholder="Add something new to do...">',
                '</div>',
            '</div>'
        ].join('');

        this.internals.state = TASK_STATE_NEW;
    }

    markAs ( mark ) {
        this.internals.state = mark;

        switch ( mark ) {
            case TASK_STATE_NEW:
                // TODO
                break;
            case TASK_STATE_DONE:
                // TODO
                break;
            case TASK_STATE_UNDONE:
                // TODO
            default:
                console.error('Unknown state for task: ', mark);
        }
    }

    static get TASK_STATE_NEW () {
        return TASK_STATE_NEW;
    }

    static get TASK_STATE_DONE () {
        return TASK_STATE_DONE;
    }

    static get TASK_STATE_UNDONE () {
        return TASK_STATE_UNDONE;
    }
}
