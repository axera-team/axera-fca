/*
 * [utils/constants.js] - Exports all the values to be used around the project globally.
*/
export const defaultUserAgent = "facebookexternalhit/1.1";
export const windowsUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
export const headers = {
  "content-type": "application/x-www-form-urlencoded",
  "origin": "https://www.facebook.com",
  "referer": "https://www.facebook.com",
  "connection": "keep-alive",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1"
};

export const meta = prop => new RegExp(`<meta property="${prop}" content="([^"]*)"`);

// Export all the constants.

export default {
  meta,
  headers,
  defaultUserAgent
};