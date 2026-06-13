import fs from "node:fs";
import path from "node:path";
import { CookieJar } from "tough-cookie";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";


import { Logger } from "../utils/logging";

import { LoginEvent, LoginEvents } from "../core/events";
import Operation from "../core/operation";
import { EventBus, Channel } from "../core/bus";

import ApiRegistry from "../core/api-registry";

import HttpClient from "../http/client";
import LoginHelpers from "./loginHelpers";
import { SessionContext as UserSessionContext, Cookie, Appstate, FCAOptions, LoginFlow as LoginFlowInterface, ApiClient, SessionContext } from "../types";
import { ApiConstructorType } from "../core/api";
import LegacyApiRegistry from "../core/legacy-api-registry";
import { LegacyApiManager } from "../core/legacy-api-manager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// THIS FILE STRICTLY HAS CORE LOGIC, NO Adapters.

interface LoginFlowOptions { 
  operation: Operation;
  cookie: Cookie;
  options: FCAOptions;
}

interface LoginResult {
  code: string;
  success: boolean;
  response: { 
    apiClient: ReturnType<ApiClient['getApiClient']>,
    session: UserSessionContext
    userID: string;
    appID: string;
  } | null;
  error: Error | null;
  cancelled: boolean;
}
/**
 * The Old Infamous CJS Factory
 * 
 * ```js
 * function(defaultFuncs, api, ctx) { 
 *  return function() {}
 * }
 * ```
 * 
 * @deprecated This is the old way API modules were defined, and is still supported for backward compatibility. However, it is recommended to use the new class-based approach for better readability, maintainability, and type safety.
 * 
 * @param defaultFuncs - Default functions refer to API HTTP Client (get, post, postFormData) that can be used to make API calls, and are passed as the first argument to the factory function for backward compatibility. However, it is recommended to use the API client provided in the new class-based approach for better consistency and maintainability.
 * @param api - The API object containing all the currently loaded API modules, which can be used to call other API modules within an API module. This is passed as the second argument to the factory function for backward compatibility, but it is recommended to use the new class-based approach for better readability and maintainability.
 * @param ctx - The session context, which contains information about the current session, such as userID, appID, etc.
 * 
 * @returns A function that does a specific task, which can be used to interact with the Facebook Messenger API.
 * 
 * This is the old way API modules were defined, and is still supported for backward compatibility. However, it is recommended to use the new class-based approach for better readability, maintainability, and type safety.
 */
interface ApiModuleV1 {
  default: (defaultFuncs: ApiClient['getApiClient'], api: LoginFlowInterface['API'], ctx: SessionContext) => (...args: any[]) => Promise<any> | any;
}

interface ApiModuleV2 {
  name: string;
  execute(...args: any[]): Promise<any>;
}

const logger = new Logger({ scope: "Login" });

/**
 * Step 1: Get jar
 * Step 2: Set cookie
 */
class LoginFlow {
  #operation: Operation;
  #cookie: Cookie;
  #jar: CookieJar;
  
  #httpClient: HttpClient;
  #userSessionContext: UserSessionContext | null = null;

  #bus: EventBus<LoginEvents> | Channel<LoginEvents> | null = null;

  public httpClient: ReturnType<HttpClient['getClient']>;
  public apiClient: ApiClient;
  public api: LoginFlowInterface['API'];
  public cancelled: boolean;

  public fcaOptions: FCAOptions;
  
  /**
   * Initialize the LoginFlow instance.
   * @param loginParameters 
   */
  constructor({ cookie, operation, options }: LoginFlowOptions) {
    this.#operation = operation instanceof Operation ? operation : new Operation({ timeout: options.timeout || 20000 });

    this.#cookie = cookie;
    this.#jar = new CookieJar();
    
    this.#httpClient = new HttpClient(options.httpClientSettings).buildClient();
    this.httpClient = this.#httpClient.getClient();
    
    this.cancelled = false;
    this.fcaOptions = options;
  }
  
  /**
   * Step 1: Build session from cookie or file.
   * Inject cookies to in-memory cookie jar to use to API requiring a session.
   * @param cookie 
   * @param jar
   * @throws When an invalid cookie is provided. See what {@link Cookie} or {@link Appstate} looks like for more details.
   */
  async #createCookieJar(cookie: Cookie, jar: CookieJar) {
    if (!cookie) throw new Error("No cookie found. Enter cookie (whether JSON/header string)");
    if (!jar || !(jar instanceof CookieJar)) throw new Error("Invalid cookie jar provided");

    if (this.#bus) this.#progress({ phase: "Cookie Jar Injection" });
    if (this.#operation.getStatus().cancelled) throw this.#operation.getStatus().reason;

    let cookies: Cookie | string[] | null = null;
    if (Array.isArray(cookie)) {
      cookies = cookie.map(c => [c.name || c.key, c.value].join('='))
    } else if (typeof cookie === 'string') {
      cookies = (cookie as string)?.split(';');
    } else {
      throw new Error("Invalid cookie format");
    }
    
    await Promise.all(cookies?.map(async cookieString => {
      const domain = ".facebook.com";
      const expires = new Date().getTime() + 1000 * 60 * 60 * 24 * 365;
      const str = `${cookieString}; expires=${expires}; domain=${domain}; path=/;`;
      await jar.setCookie(str, `http://${domain}`);
    }));
  }
  
  //Step 2: Get HTML and build API client from it.
  async #getHomepageHTML() {
    if (this.#bus) this.#progress({ phase: "Get Homepage HTML" });
    if (this.#operation.getStatus().cancelled) {
      throw this.#operation.getStatus().reason;
    }

    const html = await this.httpClient.get({
      url: LoginHelpers.getFbURL(),
      qs: null,
      ctx: null,
    });

    if (html.statusCode !== 200 || typeof html.body !== 'string') {
      throw new Error("Failed to retrieve homepage HTML");
    }

    return html.body;
  }

  async #saveToJar(jar: CookieJar) {
    const serialized = jar.serializeSync();
    if (!serialized) throw new Error('Failed to serialize cookie jar');
    this.#jar = CookieJar.fromJSON(serialized);
  }
  
  /**
   * Build user session context from the flow.
   * @param html 
   * @param jar 
   */
  async #buildSessionContext(html: string, jar: CookieJar) {
    const sessionContext = await LoginHelpers.buildSessionContext(html, jar);
    this.#setSessionContext(sessionContext);
    return sessionContext;
  }
  
  /**
   * Create the API client that will be used by the FCA functions.
   * @param html 
   * @param sessionContext
   */
  async #createAPIClient(html: string, sessionContext: UserSessionContext) {
    if (this.#bus) this.#progress({ phase: "Create FB API HTTP Client" });
    if (this.#operation.getStatus().cancelled) {
      throw this.#operation.getStatus().reason;
    }
    if (!html || !sessionContext) {
      throw new Error("HTML and session context are required to create API client");
    }
    
    if (!sessionContext.userID) {
      throw new Error("User session context must have a userID to create API client");
    }

    if (!this.#userSessionContext) {
      this.#userSessionContext = sessionContext;
    }

    return await LoginHelpers.createApiClient({
      httpClient: this.#httpClient,
      html,
      userID: sessionContext.userID,
      sessionContext
    });
  }
  
  /**
   * Set user session context to the flow.
   * @param sessionContext
   */
  #setSessionContext(sessionContext: UserSessionContext) {
    this.#userSessionContext = sessionContext;
  }

  getSessionContext() {
    return this.#userSessionContext;
  }

  /**
   * Private emit helper for the class to announce any progress of the login progress.
   * @param event 
   * @param args 
   */
  #emit<K extends keyof LoginEvents & string>(event: K, args: LoginEvents[K]) {
    (this.#bus as Channel<LoginEvents>)?.emit(event, args)
  }
  
  #progress({ phase, message = null, level = "info" }: { phase: string, message?: string | null, level?: "info" | "warn" | "error" }) {
    logger[level](message || `Progress update for phase: ${phase}`);
    if (this.#operation.getStatus().cancelled) {
      throw this.#operation.getStatus().reason;
    }

    this.#emit(LoginEvent.PROGRESS, { step: phase, message, level }); 
  }

  /** @param bus */
  async #startLoginProcess<T extends Record<string, any>>(bus: Channel<T> | EventBus<T>) {
    try {
      logger.info("Logging in...");

      this.addChannel(bus as unknown as Channel<LoginEvents>);
      this.#progress({ phase: "start_login" });

      const jar = this.#jar;

      // Check if the dev cancelled login even before the login process started
      const op = this.#operation;
      if (op.getStatus().cancelled) throw op.getStatus().reason;
      
      const cookie = this.#cookie;

      await this.#createCookieJar(cookie, jar);
      
      const html = await this.#getHomepageHTML();
      
      this.#progress({ phase: "build_session_context" });
      
      const sessionContext = await this.#buildSessionContext(html, jar);
      
      this.#progress({ phase: "create_api_client" });
      
      const apiClient = await this.#createAPIClient(html, sessionContext); // i think this will be attached to fca api options onload
      this.apiClient = apiClient;

      this.#progress({ phase: "success_login" });
      
      const ctx = sessionContext;
      this.#userSessionContext = ctx;
      
      /**
       * For debugging purposes, you can log the session context here to see what information is available. This context contains important details that are used for subsequent API calls and MQTT connections. You can log it like this:
       *  logger.debug("MQTT Region:", ctx.region);
          logger.debug("MQTT Endpoint:", ctx.mqttEndpoint);
          logger.debug("MQTT Session ID:", ctx.sessionID);
          logger.debug("MQTT Web Client ID:", ctx.clientID);
          logger.debug("MQTT Web Device ID:", ctx.deviceID);
       *
       */
      
      /** Do not confuse apiClient with api, as they serve different purposes. `apiClient` refers to the API client instance, while `api` refers to the API functions loaded into the flow. You want api. */
      return { apiClient: apiClient.getApiClient(), session: ctx };
    } catch (error) {
      logger.error("Login failed", error);
    }
  }

  addChannel(bus: EventBus<LoginEvents> | Channel<LoginEvents>) {
    if (!bus || !(bus instanceof EventBus || bus instanceof Channel) || bus === null)
      throw new Error("Invalid bus provided to addChannel");
    this.#bus = bus;
  }
  
  /**
   * Runs the login flow.
   * @param bus - The event bus or domain to use for notifications.
   * @returns The result of the login flow.
   */
  async run<T extends Record<string, any>>(bus: Channel<T> | EventBus<T>): Promise<LoginResult> {
    try {
      const login = await this.#startLoginProcess(bus) ?? null;
      if (!login) return {
        code: "LOGIN_FAILURE_INTERNAL_ERROR",
        success: false,
        response: null,
        error: new Error("LOGIN_FAILURE_INTERNAL_ERROR"),
        cancelled: this.cancelled,
      };
      if (!this.#userSessionContext || !this.#userSessionContext.userID || !this.#userSessionContext.appID) {
        logger.error("User session context is missing or invalid");
        console.dir(this.#userSessionContext, { depth: null });
        return {
          code: "LOGIN_FAILURE_NO_SESSION_CONTEXT",
          success: false,
          response: null,
          error: new Error("LOGIN_FAILURE_NO_SESSION_CONTEXT"),
          cancelled: this.cancelled,
        };
      }
      return {
        code: 'LOGIN_SUCCESS',
        success: true,
        response: {
          userID: this.#userSessionContext.userID,
          appID: this.#userSessionContext.appID,
          ...login
        }, 
        error: null,
        cancelled: this.cancelled
      };
    } catch (err) {
      return { code: 'CATCH_INTERNAL_ERROR', success: false, response: null, error: err, cancelled: this.cancelled };
    }
  }

  createConsoleObserver(bus: EventBus<any>) {
    bus.onAny(({ name, args }) => {
      const payload = args?.[0];

      switch (name) {
        case "login:progress":
          logger.info(payload.message ? `Progress: ${payload.message}` : `Progress update for step: ${payload.step}`);
          break;

        case "login:error":
          logger.error(`${payload.error.message}`);
          break;

        case "login:success":
          logger.success(`Login successful`);
          break;
      }
    });
  }
}

class Login extends LoginFlow {
  apiManager: LegacyApiManager | null = null;

  constructor({ operation, cookie, options }: LoginFlowOptions) {
    super({ operation, cookie, options });
  }

  registerAPIs() {
    const logger = new Logger({ scope: "API Loader" });
    const apiClient = this.apiClient;
    if (!apiClient) {
      throw new Error("API client is missing in this FCA. Possible reasons include incorrect configuration or missing dependencies. Or you are trying to load APIs before the login flow is completed. Ensure that you are waiting for the login flow to complete successfully before loading APIs, and double-check your configuration and dependencies.");
    }

    this.apiClient = apiClient;
    this.apiManager = new LegacyApiManager({ apiClient, sessionContext: this.getSessionContext() || {} });
    
    const apiPath = path.join(__dirname, "..", "api");
    const apiFiles = fs
      .readdirSync(apiPath)
      .filter(name => fs.lstatSync(path.join(apiPath, name)).isFile());

    apiFiles.forEach(api => {
      const apiModulePath = path.join(apiPath, api);
      try {
        const require = createRequire(import.meta.url);
        const moduleExports = require(apiModulePath);
        const apiName = path.parse(api).name; // Use file name without extension as API name
        const apiFunction = this.tryLoadAPI(moduleExports, apiName);
        
        if (apiFunction) {
          this.addAPI(apiName, apiFunction);
          logger.success(`Loaded API: ${apiName}`);
        } else {
          logger.warn(`Could not load API: ${apiName} - no usable export found`);
        }
      } catch (err) {
        logger.error(`Failed to load API module at ${apiModulePath}: ${(err as Error).message}`);
      }
    });

    logger.success(`Total APIs loaded: ${Object.keys(LegacyApiRegistry.proxy()).length}`);
    logger.debug(`APIs loaded: ${Object.keys(LegacyApiRegistry.proxy()).join(", ")}`, LegacyApiRegistry.proxy()); // Log the names of the loaded APIs for debugging
  }

  private tryLoadAPI(moduleExports: any, apiName: string): Function | null {
    // Load the legacy default export style
    if (moduleExports && typeof moduleExports.default === "function") {
      return moduleExports.default(this.apiClient.getApiClient(), this.api, this.getSessionContext());
    }

    if (moduleExports && typeof moduleExports === "function") {
      return moduleExports(this.apiClient.getApiClient(), this.api, this.getSessionContext());
    }

    return null; // No usable export found
  }

  addAPI(name: string, fn) {
    // It is in memory for now but will be persisted to disk later
    // This is made so hooking into the API is easier
    LegacyApiRegistry.add(name, fn);
    this.api = LegacyApiRegistry.proxy(); // refresh surface
  };
  
  removeAPI(name: string) {
    LegacyApiRegistry.delete(name);
    this.api = LegacyApiRegistry.proxy(); // refresh surface
  };

  getAPI(name: string) {
    return LegacyApiRegistry.get(name);
  }

  getAllAPIs() {
    return LegacyApiRegistry.proxy();
  }
}

export default Login;