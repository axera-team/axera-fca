import fs from "node:fs";
import path from "node:path";
import { CookieJar } from "tough-cookie";

import Logger from "../utils/logging"

import { LoginEvent, LoginEvents } from "../core/events";
import Operation from "../core/operation";
import { EventBus, EventDomain } from "../core/bus";

import ApiRegistry from "../api/registry";

import HttpClient from "../http/client";
import LoginHelpers from "./loginHelpers";
import { UserSessionContext, Cookie, FCAOptions, LoginFlow as LoginFlowInterface, TypedPromise } from "../types";

// THIS FILE STRICTLY HAS CORE LOGIC, NO Adapters.

interface LoginResult {
  code: string;
  success: boolean;
  api: LoginFlowInterface['API'] | null;
  error: Error | null;
  cancelled: boolean;
}

interface IBusNotifier<TEvents extends Record<string, any[]>> {
  emit<K extends keyof TEvents & string>(event: K, ...args: TEvents[K]): void
  on<K extends keyof TEvents & string>(event: K, handler: (...args: TEvents[K]) => void): void
  off<K extends keyof TEvents & string>(event: K, handler: (...args: TEvents[K]) => void): void
}

/**
 * Step 1: Get jar
 * Step 2: Set cookie
 */
class LoginFlow<TEvents extends LoginEvents & Record<string, any[]>> {
  #cookie: Cookie;
  #jar: CookieJar;
  
  #operation: Operation;
  #fcaOptions: FCAOptions;
  #userSessionContext: UserSessionContext;
  
  #httpClient: HttpClient;
  #apiRegistry: ApiRegistry;
  
  #bus: IBusNotifier<TEvents> | null = null;

  public api: LoginFlowInterface['API'];
  public cancelled: boolean;
  
  
  /**
   * Error handler for LoginFlow.
   * @param err
   */
  static errorHandler(err: Error & { name: string, critical: boolean }) {
    if (err instanceof Error) {
      err.name = "LoginError";
      err.critical = true;
    }
    throw err;
  }
  
  /**
   * Initialize the LoginFlow instance.
   * @param loginParameters 
   */
  constructor({ operation, cookie, options }: { operation: Operation, cookie: Cookie, options: FCAOptions }) {
    this.#operation = operation instanceof Operation ? operation : new Operation({ timeout: options.timeout || 20000 });
    
    this.#jar = new CookieJar();
    this.#cookie = cookie;
    this.#fcaOptions = options;
    
    this.#httpClient = new HttpClient(options.httpClientSettings);
    this.#apiRegistry = new ApiRegistry();
    
    this.api = this.#apiRegistry.expose();
    this.cancelled = false;

    this.#httpClient.buildClient();
  }
  
  /**
   * Inject cookies to in-memory cookie jar to use API requiring a session.
   * @param cookie 
   * @param jar 
   */
  async #applyInitialCookiesToJar(cookie: Cookie, jar: CookieJar) {
    if (!cookie) throw new Error("No cookie found. Enter cookie (whether JSON/header string)");
    const cookies = Array.isArray(cookie) ? cookie.map(c => [c.name || c.key, c.value].join('=')) : cookie?.split(';');
    
    await Promise.all(cookies?.map(async cookieString => {
      const domain = ".facebook.com";
      const expires = new Date().getTime() + 1000 * 60 * 60 * 24 * 365;
      const str = `${cookieString}; expires=${expires}; domain=${domain}; path=/;`;
      await jar.setCookie(str, `http://${domain}`);
    }));
  }
  
  async #getHTML() {
    const options = this.#fcaOptions;
    const html = await this.#httpClient.get(LoginHelpers.getFbURL(), this.#jar, null, options, { noRef: true });
    await utils.saveCookies(this.#jar);
    return html;
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
  async #createAPIClient(html: string, sessionContext: import('../types').UserSessionContext) {
    return await LoginHelpers.createApiClient({
      httpClient: this.#httpClient,
      html,
      userID: this.#userSessionContext.userID,
      sessionContext
    });
  }
  
  #attachClientToAPIs(apiClient: import('../types').ApiClient) {
    if (!apiClient) {
      throw new Error("API client is missing in this FCA. Possible reasons include incorrect configuration or missing dependencies.");
    }
    
    const LOADED_API_FUNCTIONS = [];
    const apiPath = path.join(__dirname, "..", "api");
    const apiFiles = fs
      .readdirSync(apiPath)
      .filter(name => fs.lstatSync(path.join(apiPath, name)).isDirectory());


    for (const file of apiFiles) {
      const modulePath = path.join(apiPath, file);
      fs.readdirSync(modulePath)
        .filter(file => file.endsWith(".js"))
        .forEach(file => {
          const moduleName = path.basename(file, ".js");
          const fullPath = path.join(modulePath, file);
          
          try {
            const apiModule = require(fullPath)(apiClient, this.api, this.#userSessionContext);
            LOADED_API_FUNCTIONS.push(apiModule);
          } catch (e) {
            Logger.error(`Failed to load module ${moduleName} from ${fullPath}:`, e);
          }
        });
    }
    
    this.#apiRegistry.bulkLoadToRegistry(LOADED_API_FUNCTIONS);
    this.api = this.#apiRegistry.expose(); // refresh surface
  }
  
  /**
   * Set user session context to the flow.
   * @param  sessionContext
   */
  #setSessionContext(sessionContext: import('../types').UserSessionContext) {
    this.#userSessionContext = sessionContext;
  }

  /**
   * Private emit helper for the class to announce any progress of the login progress.
   * @param event 
   * @param args 
   */
  #emit<K extends keyof TEvents & string>(event: K, ...args: TEvents[K]) {
    (this.#bus as EventDomain<TEvents>)?.emit(event, ...args)
  }
  
  addAPI(name, fn) {
    // It is in memory for now but will be persisted to disk later
    // This is made so hooking into the API is easier
    this.#apiRegistry.add(name, fn);
    this.api = this.#apiRegistry.expose(); // refresh surface
  };
  
  removeAPI(name) {
    this.#apiRegistry.delete(name);
    this.api = this.#apiRegistry.expose(); // refresh surface
  };

  getAPI(name) {
    return this.#apiRegistry.get(name);
  }

  setBusNotifier(bus: IBusNotifier<TEvents>) {
    if (!bus || !(bus instanceof EventBus || bus instanceof EventDomain) || bus === null)
      throw new Error("Invalid bus provided to setBusNotifier");
    this.#bus = bus;
  }
  
  createBusNotifier(bus: IBusNotifier<TEvents>) {
    if ((bus instanceof EventBus || bus instanceof EventDomain) && bus !== null) {
      if (!this.#bus) {
        this.setBusNotifier(bus);
      }

      return (step: string) => {
        this.#emit(LoginEvent.PROGRESS, { operation: this.#operation, step });
      }
    } else { 
      throw new Error("Invalid bus provided to createBusNotifier");
    }
  }

  /** @param bus */
  async #startLoginProcess(bus: IBusNotifier<TEvents> | EventDomain<TEvents>) {
    try {
      console.log("Logging in...");

      const op = this.#operation;
      if (op.getStatus().cancelled) throw op.getStatus().reason;
      
      // do cookies, ctx, buildAPI, etc
      const notify = this.createBusNotifier(bus);
      
      if (notify) notify("cookies");
      if (op.getStatus().cancelled) throw op.getStatus().reason;
      
      this.#cookie = await LoginHelpers.getAppState(this.#jar);
      await this.#applyInitialCookiesToJar(this.#cookie, this.#jar);
      
      if (notify) notify("get_html_data");
      if (op.getStatus().cancelled) throw op.getStatus().reason;
      
      const html = await this.#getHTML();
      
      if (notify) notify("build_session_context");
      if (op.getStatus().cancelled) throw op.getStatus().reason;
      
      await this.#buildSessionContext(html, this.#jar);
      
      if (notify) notify("create_api_client");
      if (op.getStatus().cancelled) throw op.getStatus().reason;
      
      const apiClient = await this.#createAPIClient(html, this.#userSessionContext); // i think this will be attached to fca api options onload
      
      if (notify) notify("load_api_functions");
      if (op.getStatus().cancelled) throw op.getStatus().reason;
      
      this.#attachClientToAPIs(apiFunctions);
      
      if (notify) notify("success_login");
      if (op.getStatus().cancelled) throw op.getStatus().reason;
      
      // extras
      this.addAPI("getAppState", LoginHelpers.getAppState);
      
      const ctx = this.#userSessionContext;
      console.log("MQTT Region:", ctx.region);
      console.log("MQTT Endpoint:", ctx.mqttEndpoint);
      console.log("MQTT Session ID:", ctx.sessionID);
      console.log("MQTT Web Client ID:", ctx.clientID);
      console.log("MQTT Web Device ID:", ctx.deviceID);
      
      /** Do not confuse apiClient with api, as they serve different purposes. `apiClient` refers to the API client instance, while `api` refers to the API functions loaded into the flow. You want api. */
      return { api: this.api, session: ctx };
    } catch (error) {
      LoginFlow.errorHandler(error);
    }
  }
  
  /**
   * Runs the login flow.
   * @param bus - The event bus or domain to use for notifications.
   * @returns The result of the login flow.
   */
  async run(bus: IBusNotifier<TEvents> | EventDomain<TEvents>): Promise<LoginResult> {
    try {
      const login = await this.#startLoginProcess(bus) ?? null;
      if (!login) return {
        code: "LOGIN_FAILURE_INTERNAL_ERROR",
        success: false,
        api: null,
        error: new Error("LOGIN_FAILURE_INTERNAL_ERROR"),
        cancelled: this.cancelled,
      };
      return { code: 'LOGIN_SUCCESS', success: true, api: login.api, error: null, cancelled: this.cancelled };
    } catch (err) {
      return { code: 'CATCH_INTERNAL_ERROR', success: false, api: this.api, error: err, cancelled: this.cancelled };
    }
  }
}

export default LoginFlow;