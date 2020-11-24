/**
 * @overview User class implementation.
 *
 * @module
 */

import Model from './model';

export default class User extends Model {
    private data: {[key: string]: string} = {
        name: null,
        sessionId: null
    };

    constructor ( config: {[key: string]: string} ) {
        super();

        this.name = config.name;
        this.sessionId = config.sessionId;
    }

    get name () {
        return this.data.name;
    }

    set name ( value ) {
        this.data.name = value;
    }

    get sessionId () {
        return this.data.sessionId;
    }

    set sessionId ( value ) {
        this.data.sessionId = value;
    }
}

