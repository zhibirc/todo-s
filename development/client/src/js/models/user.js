/**
 * @overview User class implementation.
 *
 * @module
 */

import Model from './model.js';

export default class User extends Model {
    constructor ( config = {} ) {
        super();

        this.name = config.name;

        Object.defineProperty(this, 'sessionId', {
            value: config.sessionId
        });
    }
}
