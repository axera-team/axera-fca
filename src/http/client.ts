
/*
* [utils/http/index.js] — HTTP request helper functions..
*/
import { getHeaders, getType } from '../utils/helpers';
import logger from '../utils/logging';

import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http';

import { Cookie, CookieJar } from 'tough-cookie';
import qsLib from 'qs';
import axios from "axios"

// ============== HTTP CLIENT ==============

// Next goal: replace qs with an internal implementation

/**
 *
 * @param {import('axios').AxiosResponse} res 
 * @returns {import('../types').HttpClientResponse}
 */
const axiosResponseWrapper = (res) => ({
  url: res.config.url,
  statusCode: res.status,
  statusMessage: res.statusText,
  headers: res.headers,
  body: res.data,
  method: res.config.method
});

const axiosClient = Symbol('axiosClient');
const sharedAgentsCache = Symbol('sharedAgentsCache');

interface ProxyObject {
  protocol: string;
  host: string,
  port: number,
  auth?: { username: string, password: string }
};
  
class HttpClient {
  static singletonInstance: HttpClient | null = null;
  static singletonEnabled: boolean = false;
  static [sharedAgentsCache]: Map<
    string,
    { http: import("http").Agent; https: import("https").Agent }
  >;
  #jar: import("tough-cookie").CookieJar;
  [axiosClient]: import("axios").AxiosInstance | null = null;

  public proxy: string | ProxyObject | null;
  public keepAlive: boolean;
  public timeout: number | 20000;
  public maxSockets: number | 30;
  public singletonEnabled: boolean;

  /**
   * @link https://axios-http.com/docs/req_config
   * 
   * Accepts:
   * - Object: { protocal, host, port, auth? }
   * - String: "http://host:port" or "http://user:pass@host:port"
   * Returns a plain object in Axios shape.
   * @param input - The input to normalize.
   * @returns - The normalized proxy object.
   */
  static parseProxyString(input: string | ProxyObject | null) {
    if (typeof input === "object" && input !== null) {
      // Already an object; shallow-clone to avoid mutation.
      return { ...input };
    }

    if (typeof input === "string") {
      // Ensure it has a protocol; URL parser needs one.
      const raw =
        input.startsWith("http://") || input.startsWith("https://")
          ? input
          : `http://${input}`;

      const url = new URL(raw);
      const proxy: ProxyObject = {
        protocol: url.protocol,
        host: url.hostname,
        port: Number(url.port || 80),
      };

      if (url.username || url.password) {
        proxy.auth = {
          username: decodeURIComponent(url.username),
          password: decodeURIComponent(url.password),
        };
      }
      return proxy;
    }

    return null;
  }

  // this an http.Agent module scoped factory
  /**
   *
   * @param getSharedAgentsOptions
   * @returns
   */
  static getSharedAgents({ jar, keepAlive, maxSockets }: {
    jar: CookieJar | null;
    keepAlive?: boolean | true;
    maxSockets?: number | 20;
  } = { jar: null, keepAlive: true, maxSockets: 20 }) {
    if (!jar || jar === null || !(jar instanceof CookieJar)) {
      throw new Error("Invalid cookie jar!");
    }
    if (!this[sharedAgentsCache]) {
      this[sharedAgentsCache] = new Map();
    }

    const key = JSON.stringify({ keepAlive, maxSockets });

    if (!this[sharedAgentsCache].has(key)) {
      this[sharedAgentsCache].set(key, {
        http: new HttpCookieAgent({
          cookies: { jar },
          keepAlive,
          maxSockets,
        }),
        https: new HttpsCookieAgent({
          cookies: { jar },
          keepAlive,
          maxSockets,
        }),
      });
    }
    return this[sharedAgentsCache].get(key)!;
  }

  constructor({ proxy, jar, keepAlive, timeout, maxSockets, singletonEnabled = false }: { proxy?: string | ProxyObject | null, jar?: CookieJar | null, keepAlive?: boolean, timeout?: number, maxSockets?: number, singletonEnabled?: boolean } = {}) {
    this.#jar = jar || new CookieJar();

    this.keepAlive = !!keepAlive!;
    this.proxy = proxy!;
    this.timeout = timeout! || 20000;
    this.maxSockets = maxSockets! || 30;
    this.singletonEnabled = !!singletonEnabled;
    
    if (this.singletonEnabled) {
      if (!HttpClient.singletonInstance) {
        HttpClient.singletonInstance = this;
      }
      return HttpClient.singletonInstance;
    } else {
      this.buildClient();
    }
  }

  #buildClient() {
    const agents = HttpClient.getSharedAgents({
      jar: this.#jar,
      keepAlive: this.keepAlive,
      maxSockets: this.maxSockets,
    });
    /**
     * Equivalent to { jar: true } in old request...
     * there's no { proxy }, as setProxy() will edit this later, which is the whole point of that setProxy() function.
     * reusability bro.
     */
    const config = {
      jar: this.#jar,
      withCredentials: true,
      httpAgent: agents.http,
      httpsAgent: agents.https,
      timeout: this.timeout,
      proxy: HttpClient.parseProxyString(this.proxy) ?? false,
    };

    this[axiosClient] = axios.create(config);
  }

  async #cleanGet(url: string) {
    try {
      if (!url || typeof url !== "string") throw new Error("url must be a string.");
      if (!this[axiosClient]) throw new Error('axiosClient has not been initialized yet. call buildClient() first.')
      const res = await this[axiosClient].get(url);
      return axiosResponseWrapper(res);
    } catch (error) {
      logger.error("[cleanGet]: An error occurred\n", error);
      throw new Error(error);
    }
  }

  async #get({ url, qs = {}, options = {}, ctx = {}, customHeader = {} } = {}) {
    try {
      if (!url || typeof url !== "string")
        throw new Error(`url must be a string. ${typeof url} was given when using cleanGet().`);
      if (!this[axiosClient]) throw new Error('axiosClient has not been initialized yet. call buildClient() first.')

      const normalizedQs =
        getType(qs) === "Object"
          ? Object.fromEntries(
              Object.entries(qs).map(([key, value]) => [
                key,
                getType(value) === "Object" ? JSON.stringify(value) : value,
              ]),
            )
          : qs;

      const requestOptions = {
        headers: getHeaders(url, options, ctx, customHeader),
        params: normalizedQs,
        paramsSerializer: (params) =>
          qsLib.stringify(params, { arrayFormat: "repeat" }),
      };

      const res = await this[axiosClient].get(url, requestOptions);
      return axiosResponseWrapper(res);
    } catch (error) {
      logger.error("[get]: An error occurred\n", error);
      throw new Error(error);
    }
  }

  async #post({ url, form, options = {}, ctx = {}, customHeader = {} } = {}) {
    try {
      if (!this[axiosClient]) throw new Error('axiosClient has not been initialized yet. call buildClient() first.')
      if (!url || typeof url !== "string") throw new Error("Please provide a valid URL when using post().");

      const data = qsLib.stringify(form);

      const requestOptions = {
        headers: getHeaders(url, options, ctx, customHeader),
      };

      const res = await this[axiosClient].post(url, data, requestOptions);
      return axiosResponseWrapper(res);
    } catch (error) {
      logger.error("[post]: An error occurred\n", error);
      throw new Error(error);
    }
  }

  async #postFormData({ url, form, qs = {}, options = {}, ctx = {} } = {}) {
    try {
      if (!url || !form) throw new Error("Please provide a valid URL and FormData object when using postFormData().");
      if (!this[axiosClient]) throw new Error('axiosClient has not been initialized yet. call buildClient() first.');

      // Build the FormData object if form is not a FormData but a plain object.
      let formData;
      if (form instanceof FormData) {
        formData = form;
      } else {
        formData = new FormData();
        for (const [key, value] of Object.entries(form)) {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        }
      }

      // Normalize query params (stringify nested objects)
      const normalizedQs =
        getType(qs) === "Object"
          ? Object.fromEntries(
              Object.entries(qs).map(([key, value]) => [
                key,
                getType(value) === "Object" ? JSON.stringify(value) : value,
              ]),
            )
          : qs;

      const requestOptions = {
        headers: {
          ...getHeaders(url, options, ctx),
          ...formData.getHeaders(), // sets proper Content-Type with boundary
        },
        params: normalizedQs,
        paramsSerializer: (params) =>
          qsLib.stringify(params, { arrayFormat: "repeat" }),
      };

      const res = await this[axiosClient].post(url, formData, requestOptions);
      return axiosResponseWrapper(res);
    } catch (error) {
      logger.error("[postFormData]: An error occurred\n", error);
      throw new Error(error);
    }
  }

  /**
   * Gets the Axios client for the HTTP client.
   * @returns - The Axios client object.
   */
  get axiosClient() {
    if (!this[axiosClient]) throw new Error("Axios client hasn't been initialized yet. use .buildClient() to build the http client.");
    return Object.freeze(this[axiosClient]);
  }

  /**
   * Builds the HTTP client.
   * @returns
   */
  buildClient() {
    if (!this[axiosClient]) this.#buildClient();
    return this;
  }

  /**
   * Sets the proxy for the HTTP client.
   * @param proxyInput - The proxy input to set.
   */
  setProxy(proxyInput: string | ProxyObject | null) {
    if (!proxyInput)
      throw new Error("Please provide a valid proxy when using setProxy(), but this HTTPClient will still work even without a proxy.");
    const proxy = HttpClient.parseProxyString(proxyInput);
    this.proxy = proxy;
  }

  /**
   * Gets the proxy for the HTTP client.
   * @returns The proxy object or null if no proxy is set.
   */
  getProxy() {
    return this.proxy;
  }

  /**
   * Removes the proxy for the HTTP client.
   */
  removeProxy() {
    this.proxy = null;
  }

  /**
   * Sets the cookie jar for the HTTP client.
   * @param newJar - The cookie jar to set.
   * @description Useful when doing experiments with the HTTPClient, you need to call this.buildClient() for changes to take effect.
   */
  setJar(newJar: CookieJar) {
    if (!(newJar instanceof CookieJar)) throw new Error("Please pass in a valid tough-cookie CookieJar instance.");
    logger.warn("I hope you know what you're doing before setting a new CookieJar() to the HTTPClient.");
    this.#jar = newJar;
  }

  /**
   * Gets the cookie jar for the HTTP client.
   * @returns - The cookie jar object.
   */
  getJar() {
    return this.#jar;
  }

  /**
   * Gets the client for the HTTP client.
   * @description Before you using the HTTPClient, call buildClient(), then call getClient().
   * @returns
   */
  getClient() {
    if (!this[axiosClient]) {
      throw new Error("HttpClient not initialized. Call buildClient() first.");
    }

    return Object.freeze({
      cleanGet: (url: string) => this.#cleanGet(url),
      get: (args) => this.#get(args),
      post: (args) => this.#post(args),
      postFormData: (args) => this.#postFormData(args),
    });
  }
}

// ==============

Object.freeze(HttpClient.prototype);

export default HttpClient;