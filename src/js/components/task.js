/**
 * @overview Todo class implementation.
 * @class
 * @module
 */

import Base from './base.js';

const TASK_STATE_NEW       = Symbol('TASK_STATE_NEW');
const TASK_STATE_DONE      = Symbol('TASK_STATE_DONE');
const TASK_STATE_UNDONE    = Symbol('TASK_STATE_UNDONE');
const TASK_PRIORITY_LOW    = Symbol('TASK_PRIORITY_LOW');
const TASK_PRIORITY_NORMAL = Symbol('TASK_PRIORITY_NORMAL');
const TASK_PRIORITY_HIGH   = Symbol('TASK_PRIORITY_HIGH');

export default class Task extends Base {
    constructor ( config = {} ) {
        const links = {
            $node:           null,
            $buttonComplete: null,
            $buttonCancel:   null,
            $buttonSettings: null
        };

        // TODO: rework to JSX later
        links.$node = [
            '<div class="field">',
                '<div class="control is-loading">',
                    '<input class="input is-primary" type="text" placeholder="Add something new to do...">',
                '</div>',
                '<p class="buttons">',
                    links.$buttonComplete = [
                        '<button class="button">',
                            '<span class="icon is-small">',
                                '<i class="fas fa-check" title="Task completed"></i>',
                            '</span>',
                        '</button>'
                    ].join(''),
                    links.$buttonCancel = [
                        '<button class="button">',
                            '<span class="icon is-small">',
                                '<i class="fas fa-ban" title="Cancel task"></i>',
                        '   </span>',
                        '</button>'
                    ].join(''),
                    links.$buttonSettings = [
                        '<button class="button">',
                            '<span class="icon is-small">',
                                '<i class="fas fa-cog" title="Settings"></i>',
                            '</span>',
                        '</button>'
                    ].join(''),
                '</p>',
            '</div>'
        ].join('');

        Object.keys(links).forEach(link => (links[link] = document.createRange().createContextualFragment(links[link])));

        config.$node = links.$node;
        super(config);

        this.internals.links = links;
        this.internals.state = TASK_STATE_NEW;
        this.internals.priority = config.priority || TASK_PRIORITY_NORMAL;
        this.internals.deadline = typeof config.deadline === 'number' ? new Date(config.deadline) : 'n/a';
    }

    get state () {
        return this.internals.state;
    }

    set state ( state ) {
        switch ( state ) {
            case TASK_STATE_NEW:
                // TODO
                break;
            case TASK_STATE_DONE:
                // TODO
                break;
            case TASK_STATE_UNDONE:
                // TODO
            default:
                console.error('Unknown state for task: ', state);
                return;
        }

        this.internals.state = state;
    }

    get priority () {
        return this.internals.priority;
    }

    set priority ( priority ) {
        switch ( priority ) {
            case TASK_PRIORITY_LOW:
                // TODO
                break;
            case TASK_PRIORITY_NORMAL:
                // TODO
                break;
            case TASK_PRIORITY_HIGH:
                // TODO
            default:
                console.error('Unknown priority for task: ', priority);
                return;
        }

        this.internals.priority = priority;
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

    static get TASK_PRIORITY_LOW () {
        return TASK_PRIORITY_LOW;
    }

    static get TASK_PRIORITY_NORMAL () {
        return TASK_PRIORITY_NORMAL;
    }

    static get TASK_PRIORITY_HIGH () {
        return TASK_PRIORITY_HIGH;
    }
}
