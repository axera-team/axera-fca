import { FCAOptions } from "../types";

/*
 * [utils/constants.js] - Exports all the values to be used around the project globally.
*/
export const defaultReferrer = "https://www.facebook.com";
export const defaultUserAgent = "facebookexternalhit/1.1";
export const windowsUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
export const headers = {
  "content-type": "application/x-www-form-urlencoded",
  "origin": "https://www.facebook.com",
  "connection": "keep-alive",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1"
} as const;

export const meta = prop => new RegExp(`<meta property="${prop}" content="([^"]*)"`);

export const NUM_TO_MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const NUM_TO_DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const defaultFCAOptions: FCAOptions = {
  timeout: 30000,
  autoMarkDelivery: false,
  autoMarkRead: false,
  autoReconnect: true,
  emitReady: false,
  forceLogin: false,
  listenEvents: false,
  listenTyping: false,
  online: true,
  proxy: null,
  randomUserAgent: false,
  selfListen: false,
  selfListenEvent: false,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
  httpClientSettings: {
    timeout: 30000,
    maxSockets: 30,
    keepAlive: true,
  },
  updatePresence: false,
  eventBusSettings: {
    observability: true,
  },
};

// Export all the constants.

export default {
  meta,
  headers,
  defaultUserAgent,
  defaultReferrer,
  windowsUserAgent,
  defaultFCAOptions,
  NUM_TO_MONTH,
  NUM_TO_DAY
};