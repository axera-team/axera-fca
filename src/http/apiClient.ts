import { extractSubstringBetween } from "../utils/helpers";
import HttpClient from "./client";

import type {
  FBApiParams,
  UserSessionContext,
  FB_ACCOUNT_DTSG
} from "../types/index";

import {CookieJar} from "tough-cookie";

interface GET_PARAMETERS {
  url?: string;
  jar?: CookieJar;
  query?: object;
  context?: object;
  additionalHeaders?: object;
}

interface POST_PARAMETERS {
  url?: string;
  jar?: CookieJar;
  form?: object;
  context?: object;
  additionalHeaders?: object;
}

class ApiClient {
  #requestCounter = 1;
  #fb_dtsg: FB_ACCOUNT_DTSG;
  #revision;
  #userID;
  #ctx;
  #ttstamp;
  #jazoest;
  #apiRequest;

  /**
   * Initializes the ApiClient with the provided options.
   * @param httpClientOptions
   */
  constructor({
    html = "",
    userID = "",
    sessionContext = {},
    httpClient = null,
  }: {
    html?: string;
    userID?: string;
    sessionContext?: object;
    httpClient?: null | HttpClient;
  } = {}) {
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

    this.#apiRequest = httpClient.buildClient().getClient();

    Object.freeze(this);
  }

  getApiClient() {
    const client = {
      /**
       *
       * @param {} args
       * @returns
       */
      get: (args) => this.get(args),
      post: (args) => this.post(args),
      postFD: (args) => this.postFormData(args),
    };
    return Object.freeze(client);
  }

  /**
   * GET method to FB API
   * @param getOptions
   */
  get({ url, query, context, additionalHeaders }: GET_PARAMETERS = {}) {
    const getConfig = {
      url,
      qs: this.buildFBApiParams(query),
      globalOptions: this.#ctx.globalOptions,
      ctx: context || this.#ctx,
      customHeader: additionalHeaders,
    };
    return this.#apiRequest.get(getConfig);
  }

  post({
    url,
    form,
    context,
    additionalHeaders,
  }: POST_PARAMETERS = {}) {
    //goal: make this readable
    const postConfig = {
      url,
      qs: this.buildFBApiParams(form),
      globalOptions: this.#ctx.globalOptions,
      ctx: context || this.#ctx,
      customHeader: additionalHeaders,
    };
    return this.#apiRequest.post(postConfig);
  }

  postFormData({ url, form, query, context }) {
    const postFormDataConfig = {
      url,
      form: this.buildFBApiParams(form),
      qs: this.buildFBApiParams(query),
      globalOptions: this.#ctx.globalOptions,
      ctx: context || this.#ctx,
    };
    return this.#apiRequest.postFormData(postFormDataConfig);
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
  buildFBApiParams(overrides = {}, context: UserSessionContext = {}) {
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
}

Object.freeze(ApiClient.prototype);

export default ApiClient;
