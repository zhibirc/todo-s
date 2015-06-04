(function () {
    'use strict';

    /**
     * Complex event installer on DOM elements.
     *
     * @author zhibirc
     */
    function addHandler(elems, actions) {
        var errors = ['Wrong invocation! Properly syntax: addHandler([element_0, ..., element_N], { event_0: callback_0, ..., event_N: callback_N})'],
            elem,
            i;

        /** The aim of this approach is unobtrusively display an error (and return particular marker) without panic, because wrong call may be no matter for other functionality. */
        if (arguments.length !== 2 || !Array.isArray(elems) || !(actions instanceof Object)) {
            if (typeof console !== 'undefined' && typeof console.warn !== 'undefined') {
                console.warn(errors[0]);
            }
            return 0;
        }

        for (i = elems.length; i--;) {
            elem = elems[i];
            for (var event in actions) {
                if (Object.prototype.hasOwnProperty.call(actions, event)) {
                    if (elem.addEventListener) {
                        elem.addEventListener(event, actions[event], false);
                    } else if (elem.attachEvent) {
                        elem.attachEvent('on' + event, function() { actions[event].call(elem); });
                    } else {
                        elem['on' + event] = actions[event];
                    }
                }
            }
        }
    }

    addHandler([window], { 'load': function () { APP.init(addHandler) } });
}());