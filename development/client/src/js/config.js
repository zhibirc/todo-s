/**
 * @overview Global application configuration. Can store run-time options, API urls, paths, execution flags and so on.
 *
 * @module
 */

const PRODUCT_NAME = 'todo-s';


export default Object.freeze({
    PRODUCT_NAME,
    //API_BASE_PATH_URL: `${location.protocol}/${location.host}/api`,
    API_BASE_PATH_URL: `http://127.0.0.1:4000/api`,
    STORAGE_KEY_USER_INFO: `${PRODUCT_NAME}:user:info`,
    STORAGE_KEY_APP_DATA: `${PRODUCT_NAME}:app:data`,
    // TODO: implement in the future
    UI_THEME: null
});
