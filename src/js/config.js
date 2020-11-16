/**
 * @overview Global application configuration. Can store run-time options, API urls, paths, execution flags and so on.
 *
 * @module
 */

export default Object.freeze({
    //API_BASE_PATH_URL: `${location.protocol}/${location.host}/api`,
    API_BASE_PATH_URL: `http://127.0.0.1:4000/api`,
    STORAGE_KEY_USER_INFO: 'todo-s:user:info',
    STORAGE_KEY_APP_DATA: 'todo-s:app:data',
    // TODO: implement in the future
    UI_THEME: null
});
