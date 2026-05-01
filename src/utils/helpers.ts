import Stream from "node:stream";

/*
* [utils/helpers/index.js] - Helper utility functions used around the project.
*/
import { presenceEncode } from './presence';
import { headers, defaultUserAgent } from './constants';

export const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

export function generateAccessiblityCookie() {
  const time = Date.now();
  const cookieData = {
    sr: 0,
    "sr-ts": time,
    jk: 0,
    "jk-ts": time,
    kb: 0,
    "kb-ts": time,
    hcm: 0,
    "hcm-ts": time
  };
  return encodeURIComponent(JSON.stringify(cookieData));
}

export function padZeros(val: number, givenLen: number | undefined = undefined) {
  let stringifiedVal = String(val);
  let len = givenLen || 2;
  while (stringifiedVal.length < len) {
    stringifiedVal = "0" + stringifiedVal;
  }
  return stringifiedVal;
}

export function isReadableStream(obj: Stream.Readable) {
  return (obj instanceof Stream.Readable && typeof obj._read == "function"); // true or false
}

export function getType(obj) {
  // more safe..
  if (obj === null) return "Null";
  if (obj === undefined) return "Undefined";
  return Object.prototype.toString.call(obj).slice(8, -1);
}

export function getSignatureID() {
  return Math.floor(Math.random() * 2147483648).toString(16);
}

export function arrayToObject(arr, getKey, getValue) {
  // only arrToForm() depends on this
  return arr.reduce((acc, val) => {
    acc[getKey(val)] = getValue(val);
    return acc;
  }, {});
}

export function arrToForm(form) {
  return arrayToObject(
    form,
    function(v) {
      return v.name;
    },
    function(v) {
      return v.val;
    }
  );
}

export function decodeClientPayload(payload: Uint8Array) {
  // Special export function which the Client is using to "encode" clients JSON payload
  // payload is binary which we turn into string then parse after.
  return JSON.parse(new TextDecoder().decode(payload));
}

export function generateTimestampRelative() {
  const d = new Date();
  return d.getHours() + ":" + padZeros(d.getMinutes());
}

export function makeParsable(html: string) {
  const withoutForLoop = html.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, "");
  /* 
  (What the fuck FB, why windows style newlines?)
  * So sometimes FB will send us base multiple objects in the same response.
  * They're all valid JSON, one after the other, at the top level. We detect
  * that and make it parse-able by JSON.parse.
            Ben - July 15th 2017
          
  * It turns out that Facebook may insert random number of spaces before next object begins (issue #616)
           rav_kr - 2018-03-19
  */
  const maybeMultipleObjects = withoutForLoop.split(/\}\r\n *\{/);
  if (maybeMultipleObjects.length === 1) return maybeMultipleObjects;

  return "[" + maybeMultipleObjects.join("},{") + "]";
}

/**
 * Extract substring between a string.
 * @param str 
 * @param startToken 
 * @param endToken 
 * @returns 
 */
export function extractSubstringBetween(str: string, startToken: string, endToken: string) {
  const start = str.indexOf(startToken);
  if (start === -1) return "";

  const from = start + startToken.length;
  const end = str.indexOf(endToken, from);
  if (end === -1) {
    throw new Error(`Could not find endToken "${endToken}" in the given string.`);
  }

  return str.slice(from, end);
}

interface CustomHeader {
  customUserAgent?: string;
  noRef?: boolean;
}

interface DeviceOptions {
  userAgent?: string;
}

interface Context {
  region?: string;
}

export function getHeaders(url: string, options: DeviceOptions = {}, ctx: Context = {}, customHeader: CustomHeader = {}) {
  type NewHeaders<K extends keyof typeof headers> = {
    "User-Agent": string;
    host: string;
    [K: string]: typeof headers[K];
  };

  const newHeaders: NewHeaders<keyof typeof headers> = {
    host: new URL(url).hostname,
    ...headers, // from [constants.js]
    "User-Agent": customHeader.customUserAgent ?? options.userAgent ?? defaultUserAgent
  };

  if (ctx.region) {
    newHeaders["X-MSGR-Region"] = ctx.region;
  }
  Object.assign(newHeaders, customHeader);
  
  if (customHeader.noRef) {
    delete newHeaders.referer;
  }
  
  return newHeaders;
}

export function generateThreadingID(clientID) {
  const k = Date.now();
  const l = Math.floor(Math.random() * 4294967295);
  const m = clientID;
  return "<" + k + ":" + l + "-" + m + "@mail.projektitan.com>";
}

export function generateOfflineThreadingID() {
  const ret = Date.now();
  const value = Math.floor(Math.random() * 4294967295);
  const str = ("0000000000000000000000" + value.toString(2)).slice(-22);
  const msgs = ret.toString(2) + str;
  return binaryToDecimal(msgs);
}

export function binaryToDecimal(data) {
  // only generateOfflineThreadingID() depends on this.
  let ret = "";
  while (data !== "0") {
    let end = 0;
    let fullName = "";
    let i = 0;
    for (; i < data.length; i++) {
      end = 2 * end + parseInt(data[i], 10);
      if (end >= 10) {
        fullName += "1";
        end -= 10;
      } else {
        fullName += "0";
      }
    }
    ret = end.toString() + ret;
    data = fullName.slice(fullName.indexOf("1"));
  }
  return ret;
}

export function getGUID() {
  let sectionLength = Date.now();
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    const _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}

export function generatePresence(userID) {
  // the hell is this?
  const time = (Date.now() / 1000).toString();
  const presenceData = {
    v: 3,
    time: parseInt(time, 10),
    user: userID,
    state: {
      ut: 0,
      t2: [],
      lm2: null,
      uct2: time,
      tr: null,
      tw: Math.floor(Math.random() * 4294967295) + 1,
      at: time
    },
    ch: { ["p_" + userID]: 0 }
  }
  return ("E" + presenceEncode(JSON.stringify(presenceData)));
}

export default {
  getRandom,
  generateAccessiblityCookie,
  padZeros,
  getType,
  getSignatureID,
  arrToForm,
  decodeClientPayload,
  generateTimestampRelative,
  extractSubstringBetween,
  getHeaders,
  generateThreadingID,
  generateOfflineThreadingID,
  makeParsable,
  getGUID,
  generatePresence,
  isReadableStream
}