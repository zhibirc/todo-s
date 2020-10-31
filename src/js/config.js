/**
 * @overview Global application configuration. Can store run-time options, API urls, paths, execution flags and so on.
 *
 * @module
 */

export const config = Object.freeze({
    API_BASE_PATH_URL: `${location.protocol}//${location.host}/api/v1/`,
    THEME: 'dark'
});
