/**
 * @overview Project class implementation.
 * @class
 * @module
 */

import Base from './base.js';

const STYLE_ACTIVE_CLASS = 'is-active';
const projects = [];

export default class Project extends Base {
    constructor ( config = {} ) {
        const links = {
            $node: null
        };

        if ( config.name ) {
            for ( const project of projects ) {
                if ( project.name === config.name ) {
                    throw new Error('Project with this name is already exists');
                }
            }
        }

        config.name = 'Unnamed';

        // TODO: rework to JSX later
        links.$node = [
            `<li class="${STYLE_ACTIVE_CLASS}"><a>${config.name}</a></li>`
        ].join('');

        Object.keys(links).forEach(link => (links[links] = new DOMParser().parseFromString(links[link], 'text/html')));

        config.$node = links.$node;

        super(config);

        this.internals.links = links;
        this.internals.name = config.name;
        this.internals.description = config.description || 'No description yet';

        projects.push({
            [this.name]: {
                description: this.description,
                $node: this.$node,
                tasks: []
            }
        });

        links.$node.addEventListener('click', this.activate);
    }

    activate ( event ) {
        projects.forEach(project => project.$node.classList.remove(STYLE_ACTIVE_CLASS));
        event.$target.classList.add(STYLE_ACTIVE_CLASS);
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

    get description () {
        return this.internals.description;
    }

    set description ( value ) {
        this.internals.description = value;
    }
}

