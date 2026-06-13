import { extractSubstringBetween } from "../utils/helpers";
import HttpClient from "./client";

import type {
  FBApiParams,
  SessionContext
} from "../types/index";

interface GET_PARAMETERS {
  url?: string;
  query?: object | null;
  context?: object;
}

interface POST_PARAMETERS {
  url?: string;
  form?: object | null;
  context?: object;
}

interface POST_FORM_DATA_PARAMETERS {
  url?: string;
  form?: object | null;
  query?: object | null;
  context?: object;
}

interface APIClientOptions {
  html?: string;
  userID?: string;
  sessionContext?: SessionContext & object;
  httpClient?: null | HttpClient;
}

class ApiClient {
  #requestCounter = 1;
  #fb_dtsg: string;
  #revision: string;
  #userID: string;
  #ctx: SessionContext;
  #ttstamp: string;
  #jazoest: string;

  #httpClient: HttpClient.Client;
  #httpClientInstance: HttpClient;

  /**
   * Initializes the ApiClient with the provided options.
   * @param httpClientOptions
   */
  constructor({
    html = "",
    userID = "",
    sessionContext = {},
    httpClient = null,
  }: APIClientOptions = {}) {
    if (!html || typeof html !== "string") {
      throw new Error(
        "No valid HTML provided. Please pass a valid HTML string before using this class.",
      );
    }

    if (!userID || typeof userID !== "string") {
      throw new Error(
        "No valid userID provided. Please pass a valid userID before using this class.",
      );
    }

    if (!httpClient || !(httpClient instanceof HttpClient)) {
      throw new Error(
        "No valid httpClient provided. Please pass a valid httpClient before using this class.",
      );
    }

    this.#fb_dtsg = extractSubstringBetween(
      html,
      'name="fb_dtsg" value="',
      '"',
    );
    this.#revision = extractSubstringBetween(html, 'revision":', ",");

    this.#ttstamp = "2";
    for (let i = 0; i < this.#fb_dtsg.length; i++) {
      this.#ttstamp += this.#fb_dtsg.charCodeAt(i);
    }

    this.#userID = userID;
    this.#ctx = sessionContext;

    this.#init(httpClient);

    Object.freeze(this);
  }

  #init(http: HttpClient) {
    if (!this.#httpClient || this.#httpClient === null) {
      http.buildClient();
      this.#httpClient = http.getClient();
    }

    this.#httpClientInstance = http;
  }

  getClientConfig() {
    return Object.freeze({
      requestCounter: this.#requestCounter,
      fb_dtsg: this.#fb_dtsg,
      revision: this.#revision,
      userID: this.#userID,
      ttstamp: this.#ttstamp,
      jazoest: this.#jazoest,
      ctx: this.#ctx,
    });
  }

  getApiClient() {
    const client = {
      /**
       * GET method for Facebook API. This is used for making GET requests to Facebook's API endpoints. It takes care of building the necessary parameters and headers required by Facebook, so you can simply provide the URL, query parameters, and any additional context needed for the request.
       * @param args
       * @returns
       */
      get: (args: GET_PARAMETERS) => this.get(args),
      /**
       * POST method for Facebook API. This is used for making POST requests to Facebook's API endpoints. It takes care of building the necessary parameters and headers required by Facebook, so you can simply provide the URL, form data, and any additional context needed for the request.
       * @param args 
       * @returns 
       */
      post: (args: POST_PARAMETERS) => this.post(args),
      /**
       * A shortcut for postFormData, as it's used a lot in the API. This is basically just an alias for postFormData, but it makes the code cleaner when making POST requests with form data.
       * @param args 
       * @returns 
       */
      postFD: (args: POST_FORM_DATA_PARAMETERS) => this.postFormData(args),
      /**
       * Post method specifically for form data. This is used for making POST requests that require form data, such as uploading files or sending messages with attachments. It ensures that the form data is properly formatted and sent to the Facebook API.
       * @param args 
       * @returns 
       */
      postFormData: (args: POST_FORM_DATA_PARAMETERS) => this.postFormData(args),
    };
    return Object.freeze(client);
  }

  /**
   * GET method to FB API
   * @param getOptions
   */
  get({ url, query, context }: GET_PARAMETERS = {}) {
    if (!url || typeof url !== "string") throw new Error("Invalid URL");
    if (query && typeof query !== "object") throw new Error("Query parameters must be an object");
    if (query === null) query = {};
    //goal: make this readable
    const getConfig = {
      url,
      qs: this.buildFBApiParams(query),
      ctx: context || this.#ctx,
    };
    return this.#httpClient.get(getConfig);
  }

  post({
    url,
    form,
    context
  }: POST_PARAMETERS = {}) {
    if (!url || typeof url !== "string") throw new Error("Invalid URL");
    if (form && typeof form !== "object") throw new Error("Form data must be an object");
    if (form === null) form = {};
    //goal: make this readable
    const postConfig = {
      url,
      form: form ? form : null,
      qs: this.buildFBApiParams(form),
      ctx: context || this.#ctx,
    };
    return this.#httpClient.post(postConfig);
  }

  postFormData({ url, form, query, context }: POST_FORM_DATA_PARAMETERS = {}) {
    if (!url || typeof url !== "string") throw new Error("Invalid URL");
    if (form && typeof form !== "object") throw new Error("Form data must be an object");
    if (query && typeof query !== "object") throw new Error("Query parameters must be an object");
    if (form === null) form = {};
    if (query === null) query = {};

    //goal: make this readable
    const postFormDataConfig = {
      url,
      form: this.buildFBApiParams(form),
      qs: this.buildFBApiParams(query),
      ctx: context || this.#ctx,
    };
    return this.#httpClient.postFormData(postFormDataConfig);
  }

  /**
   * So basically, this function saves us all the trouble of manually inserting these headers when requesting to Facebook APIs, this function gives us ready-made query request headers.
   * @summary (Jake) 4-30-25
   *
   * This "params" contains the values Facebook wants when requesting to their APIs.
   * You'll see these values when you inspect your FB in chrome devtools.
   * 
   * @param [context] 
   *
   * @returns - The configured parameters for Facebook API requests.
   */
  buildFBApiParams(overrides = {}, context: SessionContext | any = {}) {
    const params: FBApiParams = {
      av: this.#userID,
      __user: this.#userID,
      __req: (this.#requestCounter++).toString(36),
      __rev: this.#revision,
      __a: 1,
      fb_dtsg: context.fb_dtsg || this.#fb_dtsg,
      jazoest: context.jazoest || this.#jazoest,
    };

    if (context.overrides) {
      if (
        context.overrides.fb_dtsg &&
        typeof context.overrides.fb_dtsg === "string"
      ) {
        this.#fb_dtsg = context.overrides.fb_dtsg;
      }
      if (
        context.overrides.jazoest &&
        typeof context.overrides.jazoest === "string"
      ) {
        this.#jazoest = context.overrides.jazoest;
      }
    }

    if (!overrides) return params;

    for (const key in overrides) {
      if (!(key in params)) {
        params[key] = overrides[key];
      }
    }

    return params;
  }

  getFBApiParams() {
    return this.buildFBApiParams();
  }

  getFBApiParamsWithOverrides(overrides = {}) {
    return this.buildFBApiParams(overrides);
  }

  getFBApiParamsWithOverridesAndContext(overrides = {}, context = {}) {
    return this.buildFBApiParams(overrides, context);
  }

  addCustomHeaders<T = any>(headers: Record<string, T> = {}) {
    return this.#httpClientInstance.addCustomHeaders(headers);
  }
}

namespace ApiClient {
  export type Client = ReturnType<ApiClient['getApiClient']>;
}

Object.freeze(ApiClient.prototype);

export default ApiClient;
