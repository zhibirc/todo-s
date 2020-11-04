/**
 * @overview Helper for AJAX requests.
 *
 * @module
 */

/**
 * Ajax request
 * @param {string} method "post", "get" or "head"
 * @param {string} url address
 * @param {Function} callback on
 * @param {Object} [headers] list of optional headers like "charset", "Content-Type" and so on
 * @param {string} [type=text] data parsing mode: plain text (default), xml, json
 * @param {boolean} [async=true] send asynchronous request
 * @param {number} [abortTimeout=60000] timeout before request abort (ms)
 *
 * @return {XMLHttpRequest} request object in case response headers are necessary
 *
 * @example
 *   ajax('get', 'https://google.com/', function(data, status){console.info(data, status);}, {charset:'utf-8'})
 */
export default function ( method, url, callback, headers, type, async, abortTimeout ) {
    var jdata   = null,
        timeout = null,
        xhr     = new XMLHttpRequest(),
        title   = 'AJAX ' + method.toUpperCase() + ' ' + url,
        hname, aborted;

    async = async !== false;
    abortTimeout = abortTimeout || 60000;

    xhr.onreadystatechange = function () {
        if ( xhr.readyState === 4 ) {
            if ( aborted ) {
                return;
            }
            clearTimeout(timeout);
            if ( ajax.stop ) {
                echo(xhr.status, title);
                if ( typeof callback === 'function' ) {
                    callback(null, null, null);
                }
            } else {
                echo('status:' + xhr.status + ', length:' + xhr.responseText.length, title);
                if ( type === 'json' && xhr.status === 200 ) {
                    try {
                        jdata = JSON.parse(xhr.responseText);
                    } catch ( e ) {
                        echo(e, 'AJAX JSON.parse');
                        jdata = null;
                    }
                }
                if ( typeof callback === 'function' ) {
                    callback(type === 'xml' ? xhr.responseXML : (type === 'json' ? jdata : xhr.responseText), xhr.status, xhr);
                }
            }
        }
    };
    xhr.open(method, url, async);

    // set headers if present
    if ( headers ) {
        for ( hname in headers ) {
            if ( headers.hasOwnProperty(hname) ) {
                xhr.setRequestHeader(hname, headers[hname]);
            }
        }
    }

    // abort after some time (60s)
    timeout = setTimeout(function () {
        echo('ABORT on timeout', title);
        if ( typeof callback === 'function' ) {
            callback(null, 0);
            // no readystatechange event should be dispatched after xhr.abort() (https://xhr.spec.whatwg.org/#dom-xmlhttprequest-abort)
            // so we need to fix this bug and prevent multiple call of same callback for our stb
            aborted = true;
        }
        xhr.abort();
    }, abortTimeout);

    xhr.send();
    echo('sent', title);


    return xhr;
}
