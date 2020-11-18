/**
 * @overview Project class implementation.
 * @class
 * @module
 */

import Base from './base.js';
import validate from '../utils/validate.js';
import {$getNodeFromString} from '../utils/dom.js';

const STYLE_ACTIVE_CLASS = 'is-active';
const projects = [];

export default class Project extends Base {
    constructor ( config = {} ) {
        const links = {
            $node: null
        };

        if ( !validate.project(config.name) ) {
            throw new Error('Project must have a name');
        }

        for ( const project of projects ) {
            if ( project.name === config.name ) {
                throw new Error('Project with this name is already exists');
            }
        }

        links.$node = `
            <li data-content="${projects.length}">
                <a>
                    <span class="icon is-small"><i class="far fa-file-alt" aria-hidden="true"></i></span>
                    <span>${config.name}</span>
                </a>
            </li>
        `;

        Object.keys(links).forEach(link => (links[link] = $getNodeFromString(links[link])));
        config.$node = links.$node;

        super(config);

        this.internals.links = links;
        this.internals.tasks = config.tasks || [];
        this.internals.name = config.name;
        this.internals.description = config.description || 'No description yet';

        projects.push({
            name:        this.internals.name,
            description: this.internals.description,
            $node:       this.$node,
            tasks:       this.internals.tasks
        });
    }

    static activate ( $item ) {
        projects.forEach(project => project.$node.classList.remove(STYLE_ACTIVE_CLASS));
        $item.classList.add(STYLE_ACTIVE_CLASS);
    }

    addTask ( task ) {
        for ( const project of projects ) {
            if ( project.name === config.name ) {
                throw new Error('Project with this name is already exists');
            }
        }
    }

    get name () {
        return this.internals.name;
    }

    set name ( value ) {
        this.internals.name = value;
    }

    get tasks () {
        return this.internals.tasks;
    }

    get description () {
        return this.internals.description;
    }

    set description ( value ) {
        this.internals.description = value;
    }
}

