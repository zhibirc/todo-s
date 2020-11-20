/**
 * @overview Static resources loader.
 *
 * @module
 */

export default async function load ( resource ) {
    const response = await fetch(resource);

    if ( response.status === 200 /* response.ok */ ) {
        return response.text();
    }
};
