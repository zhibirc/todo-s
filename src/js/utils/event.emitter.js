/**
 * @overview Event emitter.
 * @see http://nodejs.org/api/events.html
 *
 * @module
 */

export default class EventEmitter {
    constructor () {
        /**
         * @private
         * @type {{}}
         */
        this.events = {};
    }

    addListener ( name, callback ) {
        this.events[name] = this.events[name] || [];
        this.events[name].push(callback);
    }

    once ( name, callback ) {
        const self = this;

        this.events[name] = this.events[name] || [];
        this.events[name].push(function onceWrapper () {
            self.removeListener(name, onceWrapper);
            callback.apply(self, arguments);
        });
    }

    addListeners ( callbacks ) {
        let name;

        for ( name in callbacks ) {
            if ( callbacks.hasOwnProperty(name) ) {
                this.addListener(name, callbacks[name]);
            }
        }
    }

    removeListener ( name, callback ) {
        if ( this.events[name] ) {
            this.events[name] = this.events[name].filter(fn => (fn !== callback));

            if ( this.events[name].length === 0 ) {
                this.events[name] = undefined;
            }
        }
    }

    emit ( name ) {
        const event = this.events[name];

        if ( event ) {
            for ( let index = 0; index < event.length; index += 1 ) {
                event[index].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
}
