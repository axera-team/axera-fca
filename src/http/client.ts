/*
 * [http/client.js] — HTTP request helper functions..
 */
import type { CookieJar as CookieJarT } from 'tough-cookie';
import type { Response as UndiciResponse } from 'undici';
import { fetch, ProxyAgent, FormData as UndiciFormData } from 'undici';
import { CookieAgent } from 'http-cookie-agent/undici';
import { CookieJar } from 'tough-cookie';

import qsLib from 'qs';

import { getHeaders, getType } from '../utils/helpers';
import { Logger } from '../utils/logging';

// ============== HTTP CLIENT ==============

// Next goal: replace qs with an internal implementation
// Next goal: deprecate that getHeaders() bloat and replace with a more efficient internality

/**
 * We need this temporarily to mimic request-based old bot clients
 * @param res 
 * @param url
 * @param method
 * @returns
 */
export const undiciResponseWrapper = async (res: UndiciResponse, url: string, method: string) => {
  /**
   * Undici response body is a Readable stream, so we need to consume it
   * @link https://undici.nodejs.org/#/?id=undicifetchinput-init-promise
   * @link https://undici.nodejs.org/#/examples/
   */
  const body = await res.text();
  return {
    ...res,
    url,
    statusCode: res.status,
    statusMessage: res.statusText || '',
    headers: Object.fromEntries(res.headers.entries()),
    body,
    method,
  };
};

export type UndiciResponseWrapper = Awaited<ReturnType<typeof undiciResponseWrapper>>;

// Will modernize this next update
const normalizeQs = (qs) => {
  if (getType(qs) !== "Object") return qs;
  return Object.fromEntries(
    Object.entries(qs).map(([key, value]) => [
      key,
      getType(value) === "Object" ? JSON.stringify(value) : value,
    ]),
  );
}

const sharedAgentsCache = Symbol('sharedAgentsCache');

interface ProxyObject {
  protocol: string;
  host: string,
  port: number,
  auth?: { username: string, password: string }
};

// WILL MAKE THIS MORE SPECIFIC AND EXPLICIT TYPES NEXT UPDATE
interface GetOptions {
  url: string;
  qs: object | null; // query string
  ctx: object | null;
}
interface PostOptions {
  url: string;
  form: object | null;
  ctx: object;
}
interface PostFormDataOptions {
  url: string;
  form: object | null;
  qs: object;
  ctx: object;
}
  
class HttpClient {
  static readonly logger = new Logger({ scope: 'HttpClient', debugMode: false });
  static singletonInstance: HttpClient | null = null;
  static singletonEnabled: boolean = false;
  static [sharedAgentsCache]: Map<
    string,
    import('undici').Dispatcher
  >;
  #jar: CookieJarT;
  #agent: import('undici').Dispatcher | null = null;
  #clientCache: ReturnType<HttpClient['getClient']> | null = null;
  #customHeaders: Record<string, any> | null = null;

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
        protocol: url.protocol.replace(":", ""),
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
   * Creates or retrieves a shared CookieAgent
   * With undici, the CookieAgent handles both HTTP and HTTPS
   */
  static getSharedAgent({ jar, keepAlive, maxSockets }: {
    jar: CookieJar | null;
    keepAlive?: boolean;
    maxSockets?: number;
  } = { jar: null, keepAlive: true, maxSockets: 20 }) {
    if (!jar || !(jar instanceof CookieJar)) {
      throw new Error('Invalid cookie jar!');
    }
    if (!this[sharedAgentsCache]) {
      this[sharedAgentsCache] = new Map();
    }

    const key = JSON.stringify({ keepAlive, maxSockets });

    if (!this[sharedAgentsCache].has(key)) {
      this[sharedAgentsCache].set(key, new CookieAgent({
        cookies: { jar },
        pipelining: keepAlive ? 1 : 0,
        connections: maxSockets, // undici uses 'connections' instead of 'maxSockets'
      }));
    }
    return this[sharedAgentsCache].get(key)!;
  }

  constructor({ proxy, jar, keepAlive, timeout, maxSockets, singletonEnabled = true }: { proxy?: string | ProxyObject | null, jar?: CookieJar | null, keepAlive?: boolean, timeout?: number, maxSockets?: number, singletonEnabled?: boolean } = {}) {
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
      this.#buildClient();
    }
  }

  #buildClient() {
    const cookieAgent = HttpClient.getSharedAgent({
      jar: this.#jar,
      keepAlive: this.keepAlive,
      maxSockets: this.maxSockets,
    });
    const proxyConfig = HttpClient.parseProxyString(this.proxy);

    if (proxyConfig) {
      // If a proxy is configured, create a ProxyAgent that uses the CookieAgent
      const proxyUri = `${proxyConfig.protocol}://${
        proxyConfig.auth 
          ? `${proxyConfig.auth.username}:${proxyConfig.auth.password}@` 
          : ''
      }${proxyConfig.host}:${proxyConfig.port}`;

      this.#agent = new ProxyAgent({
        uri: proxyUri,
        connect: {
          keepAlive: this.keepAlive,
        },
        // ProxyAgent doesn't directly chain with CookieAgent,
        // so we use the factory pattern or set cookies manually
      });

      // Note: For full proxy + cookie support, you might need to create
      // a custom dispatcher chain. See notes below.
      HttpClient.logger.warn('Proxy support with CookieAgent requires custom dispatcher composition. See documentation.');
    } else {
      this.#agent = cookieAgent;
    }
  }

  async #cleanGet(url: string) {
    try {
      if (!url || typeof url !== "string") throw new Error("url must be a string.");
      if (!this.#agent) throw new Error('Agent has not been initialized yet. call buildClient() first.')
      
      const res = await fetch(url, {
        dispatcher: this.#agent,
        signal: AbortSignal.timeout(this.timeout)
      });

      return undiciResponseWrapper(res, url, "GET");
    } catch (error) {
      HttpClient.logger.error("[cleanGet]: An error occurred", error);
      throw error;
    }
  }

  async #get(getOptions: GetOptions = { url: '', qs: {}, ctx: {} }) {
    try {
      const { url, qs, ctx } = getOptions;

      if (!url || typeof url !== "string")
        throw new Error(`url must be a string. ${typeof url} was given when using cleanGet().`);
      if (!this.#agent) throw new Error('Agent has not been initialized yet. call buildClient() first.')

      const normalizedQs = normalizeQs(qs);

      const queryString = qsLib.stringify(normalizedQs, { arrayFormat: "repeat" });
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const customHeaders = this.getCustomHeaders();
      const customHeader = customHeaders ? customHeaders : null;

      const headers = customHeader ? getHeaders({ url, ctx, customHeader }) : getHeaders({ url, ctx });

      const res = await fetch(url, {
        dispatcher: this.#agent,
        headers,
        signal: AbortSignal.timeout(this.timeout),
      });

      return await undiciResponseWrapper(res, fullUrl, "GET");
    } catch (error) {
      HttpClient.logger.error("[get]: An error occurred", error);
      throw error;
    }
  }

  async #post(postOptions: PostOptions = { url: '', form: null, ctx: {} }) {
    try {
      const { url, form, ctx } = postOptions;
      if (!url || typeof url !== "string") throw new Error("Please provide a valid URL when using post().");
      if (!this.#agent) throw new Error('Agent has not been initialized yet. call buildClient() first.');

      const customHeaders = this.getCustomHeaders();
      const customHeader = customHeaders ? customHeaders : null;

      const headers = customHeader ? getHeaders({ url, ctx, customHeader }) : getHeaders({ url, ctx });

      // Set content-type for URL-encoded forms!
      if (!headers['content-type'] && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }

      const res = await fetch(url, {
        method: 'POST',
        dispatcher: this.#agent,
        headers,
        body: typeof form === 'string' ? form : qsLib.stringify(form),
        signal: AbortSignal.timeout(this.timeout),
      });

      return await undiciResponseWrapper(res, url, 'POST');
    } catch (error) {
      HttpClient.logger.error("[post]: An error occurred", error);
      throw error;
    }
  }

  async #postFormData(postFormDataOptions: PostFormDataOptions = { url: '', form: null, qs: {}, ctx: {} }) {
    try {
      const { url, form, qs, ctx } = postFormDataOptions;

      if (!url || !form) throw new Error("Please provide a valid URL and FormData object when using postFormData().");
      if (!this.#agent) throw new Error('Agent has not been initialized yet. call buildClient() first.');

      // Build the FormData object if form is not a FormData but a plain object.
      let formData;
      if (form instanceof FormData) {
        // Browser FormData is usable with undici directly.
        formData = form;
      } else if (form instanceof UndiciFormData) {
        formData = form;
      } else {
        formData = new UndiciFormData();
        for (const [key, value] of Object.entries(form)) {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        }
      }

      // Normalize query params (stringify nested objects)
      const normalizedQs = normalizeQs(qs);

      // Serialize
      const queryString = qsLib.stringify(normalizedQs, { arrayFormat: "repeat" });
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      // Prepare headers
      const customHeaders = this.getCustomHeaders();
      const customHeader = customHeaders ? customHeaders : null;
      const headers = getHeaders({ url, ctx, customHeader });

      const res = await fetch(fullUrl, {
        method: 'POST',
        dispatcher: this.#agent,
        headers,
        body: formData,
        signal: AbortSignal.timeout(this.timeout),
      });

      return await undiciResponseWrapper(res, fullUrl, "POST");
    } catch (error) {
      HttpClient.logger.error("[postFormData]: An error occurred", error);
      throw error;
    }
  }

  /**
   * Use sparingly, too much weird headers can make you look suspicious to FB APIs
   * @param headers An object containing custom headers if ever you want to add additional headers during request.
   * @returns true | false
   */
  addCustomHeaders<T = any>(headers: Record<string, T> = {}) {
    if (!this.#agent) throw new Error("HttpClient not initialized. Call buildClient() first.");
    if (typeof headers !== "object" || headers === null) throw new Error("Please provide a valid object when using addCustomHeaders().");
    if (Object.keys(headers).length === 0) return false;
    if (Array.isArray(headers)) throw new Error("Please provide an object when using addCustomHeaders().");
    this.#customHeaders = headers;
    return true;
  }

  getCustomHeaders() {
    return this.#customHeaders;
  }

  /**
   * Builds the HTTP Client
   */
  buildClient() {
    if (!this.#agent) this.#buildClient();
    return this;
  }

  /**
   * Gets the Undici client for the HTTP client.
   * @returns The Undici client.
   */
  get undiciClient() {
    if (!this.#agent) throw new Error("Undici client hasn't been initialized yet. use .buildClient() to build the http client.");
    return Object.freeze(this.#agent);
  }

  /**
   * Sets the proxy for the HTTP client.
   * @param proxyInput - The proxy input to set.
   * @summary Remember to call buildClient() after setting the proxy.
   */
  setProxy(proxyInput: string | ProxyObject | null) {
    if (!proxyInput)
      throw new Error("Please provide a valid proxy when using setProxy(), but this HTTPClient will still work even without a proxy.");
    const proxy = HttpClient.parseProxyString(proxyInput);
    this.proxy = proxy;
    this.#agent = null;
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
    this.#agent = null;
  }

  /**
   * Sets the cookie jar for the HTTP client.
   * @param newJar - The cookie jar to set.
   * @description Useful when doing experiments with the HTTPClient, you need to call this.buildClient() for changes to take effect.
   */
  setJar(newJar: CookieJar) {
    if (!(newJar instanceof CookieJar)) throw new Error("Please pass in a valid tough-cookie CookieJar instance.");
    HttpClient.logger.warn("I hope you know what you're doing before setting a new CookieJar() to the HTTPClient.");
    this.#jar = newJar;
    this.#agent = null; // Force rebuild agent with new jar
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
    if (!this.#agent) {
      throw new Error("HttpClient not initialized. Call buildClient() first.");
    }
    return Object.freeze({
      cleanGet: (url: string) => this.#cleanGet(url),
      get: (args: GetOptions) => this.#get(args),
      post: (args: PostOptions) => this.#post(args),
      postFD: (args: PostFormDataOptions) => this.#postFormData(args),
      postFormData: (args: PostFormDataOptions) => this.#postFormData(args),
    });
  }

  /**
   * Gets the cached client of the HTTP client built with getClient().
   * @description Before you use this, call buildClient().
   * @returns
   */
  getCachedClient() {
    if (!this.#clientCache) {
      this.#clientCache = this.getClient();
    }
    return this.#clientCache;
  }
}

namespace HttpClient {
  export type Client = ReturnType<HttpClient['getClient']>;
}

// ==============
Object.freeze(HttpClient.prototype);


export default HttpClient;