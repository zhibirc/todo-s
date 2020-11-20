/**
 * @overview Basic validations.
 *
 * @module
 */

/** @see {@link http://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690} */
const EMAIL_MAX_LENGTH = 254;
/** @see {@link https://emailregex.com/} */
/* eslint-disable-next-line max-len */
const PATTERN_EMAIL        = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
const PATTERN_LOGIN        = /^[a-z\d]{5,12}$/i;
const PATTERN_PASSWORD     = /^\S{8,50}$/;
const PATTERN_PROJECT_NAME = /^\S(?:.{0,48}\S)?$/;
const PATTERN_PHONE        = /^\+?(?:\(\d{2,5}\))?(?:\d{2,4}-?){1,2}\d{2,4}$/;


export default {
    email:    value => value.length <= EMAIL_MAX_LENGTH && PATTERN_EMAIL.test(value),
    login:    RegExp.prototype.test.bind(PATTERN_LOGIN),
    password: RegExp.prototype.test.bind(PATTERN_PASSWORD),
    project:  RegExp.prototype.test.bind(PATTERN_PROJECT_NAME),
    phone:    RegExp.prototype.test.bind(PATTERN_PHONE)
};
