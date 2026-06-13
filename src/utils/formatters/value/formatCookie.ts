"use strict";

/**
 * Formats a cookie array into a string for use in a cookie jar.
 * @param {Array<string>} arr - An array containing cookie parts.
 * @param {string} url - The base URL for the cookie domain.
 * @returns {string} The formatted cookie string.
 */
export default function formatCookie(arr, url) {
    return (
        arr[0] + "=" + arr[1] + "; Path=" + arr[3] + "; Domain=" + url + ".com"
    );
}