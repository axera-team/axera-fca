import { Cookie, CookieJar, SerializedCookie } from "tough-cookie";
import { randomUUID } from "node:crypto";

import HttpClient from "../http/client";
import { Logger } from "../utils/logging";

import type { ConfigTypeMap as FB, SessionContext } from "../types";

const ERROR_RETRIEVING = "Failed to retrieve userID. This can be caused by many factors, an expired appstate or being blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.";

interface ScriptData {
  require?: any[];
  [key: string]: any;
}

interface Account {
    uid: string;
    password: string;
}

interface AuthenticatedResult {
    cookie: string;
    token: string;
}

type ConfigReturnType<K extends keyof FB> = FB[K];

export class LoginUtilities {
  static readonly logger = new Logger({ scope: "LoginUtilities", color: 'candy' });

  static getFbURL(endpoint = '') {
    return `https://www.facebook.com${endpoint ? '/' + endpoint : ''}`;
  }
  
  /**
   * Concatenate cookies from jar
   * @param jar 
   */
  static async concatJarCookies(jar: CookieJar) {
    const fbCookies = (await jar.getCookies("https://www.facebook.com")).map(c => c.toJSON()) as SerializedCookie[];
    const msCookies = (await jar.getCookies("https://www.messenger.com")).map(c => c.toJSON()) as SerializedCookie[];

    const concatenatedCookies = await Promise.all([fbCookies, msCookies]);
    return concatenatedCookies.flat();
  }
  /**
   * Get app state from jar
   * @param jar 
   */
  static async getAppState(jar: CookieJar) {
    const appstate = await LoginUtilities.concatJarCookies(jar);
    const seen = new Set();
    
    const uniqueAppstate: SerializedCookie[] = [];

    // Keep it unique
    for (const c of appstate) {
      const key = `${c.key}|${c.domain || ""}|${c.path || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      uniqueAppstate.push(c);
    }
  
    return uniqueAppstate.length ? uniqueAppstate : appstate;
  }
  
  static getMQTTEndpoint(html: string, { bypassRegion = false }) {
    this.logger.info("Getting MQTT endpoint...");
    const MQTT_MATCHES = {
      oldFBMQTTMatch: html.match(/irisSeqID:"(.+?)",appID:219994525426954,endpoint:"(.+?)"/),
      newFBMQTTMatch: html.match(/{"app_id":"219994525426954","endpoint":"(.+?)","iris_seq_id":"(.+?)"}/),
      legacyFBMQTTMatch: html.match(/\["MqttWebConfig",\[\],{"fbid":"(.*?)","appID":219994525426954,"endpoint":"(.*?)","pollingEndpoint":"(.*?)"/),
    };
    
    let mqttEndpoint: string | null = null,
    irisSeqID: string | null = null,
    region: string | null = null,
    mode: "oldFBMQTTMatch" | "newFBMQTTMatch" | "legacyFBMQTTMatch" | null = null;
    
    for (const [key, match] of Object.entries(MQTT_MATCHES)) {
      if (!match || bypassRegion) continue;
      
      switch (key) {
        case "oldFBMQTTMatch":
          mqttEndpoint = match[2].replace(/\\\//g, "/");
          irisSeqID = match[1];
          region = this.getAccountRegion(mqttEndpoint);
          mode = "oldFBMQTTMatch";
          break;
        case "newFBMQTTMatch":
          mqttEndpoint = match[1].replace(/\\\//g, "/");
          irisSeqID = match[2];
          region = this.getAccountRegion(mqttEndpoint);
          mode = "newFBMQTTMatch";
          break;
        case "legacyFBMQTTMatch":
          mqttEndpoint = match[2].replace(/\\\//g, "/");
          region = this.getAccountRegion(mqttEndpoint);
          mode = "legacyFBMQTTMatch";
          break;
        default:
          throw new Error(`Unexpected MQTT_MATCH key: ${key}, No FB MQTT match found, FB might added breaking changes recently, please report this issue to the developer.`);
      }
    }
    
    this.logger.info("Retrieved MQTT server endpoint.");
    
    return {
      mode,
      mqttEndpoint,
      irisSeqID,
      region,
    };
  }
  
  static getAccountRegion(mqttEndpoint: string) {
    if (!mqttEndpoint || typeof mqttEndpoint !== "string")
      throw new Error("MQTT endpoint is not provided");
    console.info({ mqttEndpoint });
    const region = new URL(mqttEndpoint).searchParams.get("region");
    return region?.toUpperCase() || null;
  }

  static getAppID(html: string) {
    const findConfig = this.setupConfigFinder<FB>(html);
    const currentUserData = findConfig('CurrentUserInitialData');
    return currentUserData && currentUserData.APP_ID ? currentUserData.APP_ID : null;
  }
  
  static getClientID(html: string) {
    const clientID = html.match(/\["MqttWebDeviceID",\[\],{"clientID":"(.*?)"/);
    return clientID ? clientID[1] : null;
  }
  static getDeviceID(html: string) {
    const deviceID = html.match(/\["AnalyticsCoreData",\[\],{"device_id":"(.*?)"/);
    return deviceID ? deviceID[1] : null;
  }
  
  /**
   * Get user ID from cookies
   * @param cookies 
   * @returns
   */
  static getUserID(cookies: Cookie[]): string | null {
    console.info("Retrieving user ID from cookies...");
    console.info({ raw: cookies, cookies: cookies.map(c => c.toJSON()) });

    const parsedCookies = cookies.map(c => c.toJSON());
    const primaryProfile = parsedCookies.find(cookie => cookie.key === "c_user");
    const secondaryProfile = parsedCookies.find(cookie => cookie.key === "i_user");
    console.dir({ primaryProfile, secondaryProfile }, { depth: null });

    const primaryProfileUserID = primaryProfile ? primaryProfile.value : null;
    const secondaryProfileUserID = secondaryProfile ? secondaryProfile.value : null;

    console.dir({ primaryProfileUserID, secondaryProfileUserID }, { depth: null });

    return (primaryProfileUserID ? primaryProfileUserID : secondaryProfileUserID) || null;
  }
  
  /**
   * Get irisSeqID from HTML
   * @param html 
   * @returns
   */
  static getIrisSeqID(html: string) {
    const irisSeqIDMatch = html.match(/irisSeqID:"(.+?)"/);
    return irisSeqIDMatch ? irisSeqIDMatch[1] : null;
  }
  
  /**
   * Check if the current state of the web page has been blocked by Facebook
   * @param html 
   * @returns
   */
  static isCheckpoint(html: string) {
    return html.includes("/checkpoint/block/?next");
  }
  
  static getScriptTagsFromHTML(html: string) {
    const allScriptsData: ScriptData[] = [];
    const scriptRegex = /<script type="application\/json"[^>]*>(.*?)<\/script>/g;
    let match: RegExpExecArray | null;
    while ((match = scriptRegex.exec(html)) !== null) {
      try {
        allScriptsData.push(JSON.parse(match[1]));
      } catch (e) {
        this.logger.error("Failed to parse a JSON blob from HTML", e.message);
      }
    }
    return allScriptsData;
  };

  /**
   * Creates a config finder function that extracts typed configuration from Facebook HTML
   * 
   * Better caching for config values from HTML, as some values are deeply nested and hard to retrieve.
   * 
   * This function will return a finder function that can be used to find config values by key. It will search through the script tags in the HTML and return the value if found.
   * 
   * This is more efficient than searching through the HTML multiple times for different keys.
   * 
   * @param html - Raw HTML response from Facebook
   * @returns A finder function that returns typed config data based on the key
   * 
   * @example
   * const find = setupConfigFinder(html);
   * const user = find('CurrentUserInitialData'); // Hover shows the JSDoc from ConfigTypeMap
   * // sometimes user is null...
   * if (!user) {
   *  throw new Error('user not found');
   * }
   */
  static setupConfigFinder<T extends FB>(html: string) {
    const netData = this.getScriptTagsFromHTML(html);

    function findConfig<K extends keyof T & string>(key: K): T[K] | null {
      for (const scriptData of netData) {
        if (scriptData.require && Array.isArray(scriptData.require)) {
          for (const req of scriptData.require) {
            if (Array.isArray(req) && req[0] === key && req[2]) {
              return req[2];
            }
            if (Array.isArray(req) && req[3] && req[3][0] && req[3][0].__bbox && req[3][0].__bbox.define) {
              for (const def of req[3][0].__bbox.define) {
                if (Array.isArray(def) && def[0].endsWith(key) && def[2]) {
                  return def[2];
                }
              }
            }
          }
        }
      }
      return null;
    };

    return findConfig;
  };

  static computeJazoest(dtsgToken: string): string {
    let sum = 0;

    for (const char of dtsgToken) {
      sum += char.charCodeAt(0);
    }

    return "2" + sum;
  }

  static async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static getUserIDFromHTML(html: string) {
    const findConfig = this.setupConfigFinder<FB>(html);
    const currentUserData = findConfig('CurrentUserInitialData');
    return currentUserData && currentUserData.USER_ID ? currentUserData.USER_ID : null;
  }
}


class LoginHelpers extends LoginUtilities {
  static readonly logger = new Logger({ scope: "LoginHelpers" });
  
  /**
   * Parse login response and check for successful login
   * @param html 
   * @param jar
   */
  static parseLoginResponse(html: string) {
    if (this.isCheckpoint(html)) {
      this.logger.warn("Checkpoint detected. Please log in with a browser to verify.");
      throw new Error("FB Checkpoint detected");
    }
    const userID = this.getUserIDFromHTML(html);
    if (!userID) {
      throw new Error(ERROR_RETRIEVING);
    }

    return userID;
  }

  /**
   * Build session context from cookies
   * @param html 
   * @param jar 
   * @returns 
   */
  static async buildSessionContext(html: string, jar: CookieJar): Promise<SessionContext> {
    const cookies = await jar.getCookies(LoginHelpers.getFbURL());
    const userID = this.getUserID(cookies);
    
    if (!userID) {
      throw new Error(ERROR_RETRIEVING);
    }
    
    if (this.isCheckpoint(html)) {
      this.logger.warn("Checkpoint detected. Please log in with a browser to verify.");
      throw new Error("FB Checkpoint detected");
    }
    
    const appID = this.getAppID(html);
    const deviceID = this.getDeviceID(html);
    const clientID = this.getClientID(html);
    const irisSeqID = this.getIrisSeqID(html);

    const sessionID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
    
    const mqttEndpoint = this.getMQTTEndpoint(html, { bypassRegion: false }).mqttEndpoint;
    this.logger.debug('MQTT Endpoint:', { mqttEndpoint });
    if (!mqttEndpoint) {
      throw new Error("Failed to retrieve MQTT endpoint from HTML. FB might have changed their HTML structure recently, please report this issue to the developer.");
    }

    let region = this.getAccountRegion(mqttEndpoint);
    
    if (!region) {
      const regions = ["prn", "pnb", "vll", "hkg", "sin", "ftw", "ash"];
      region = regions[Math.floor(Math.random() * regions.length)].toUpperCase();
      this.logger.warn("No MQTT region is found from this account, now using random region. This might raise API suspicions.");
    }
    
    return {
      mqttEndpoint,
      region,
      
      appID,
      userID,
      deviceID,
      clientID,
      sessionID: sessionID.toString(),
      lastSeqId: irisSeqID,
      
      firstListen: true,
      loggedIn: true,
      
      access_token: "NONE",
      clientMutationId: 0,
      mqttClient: undefined,
      syncToken: undefined,
      
      wsReqNumber: 0,
      wsTaskNumber: 0,
      reqCallbacks: {}
    } satisfies SessionContext;
  }
  
  /**
   * Creates an instance of ApiClient.
   * @param httpClient - The HTTP client instance.
   * @param html - The HTML content.
   * @param userID - The user ID.
   * @param sessionContext - The user session context.
   * @returns - The created ApiClient instance.
   */
  static async createApiClient({ httpClient, html, userID, sessionContext }: {
    httpClient: HttpClient;
    html: string;
    userID: string;
    sessionContext: SessionContext;
  }) {
    if (!httpClient || !html || !userID || !sessionContext) {
      throw new Error("httpClient, html, userID, and sessionContext are required");
    }
    if (!(httpClient instanceof HttpClient)) {
      throw new Error("httpClient must be an instance of HttpClient");
    }
    const ApiClient = (await import("../http/apiClient")).default;
    if (!ApiClient) {
      throw new Error("Failed to import ApiClient");
    }
    const apiClient = new ApiClient({
      httpClient,
      html,
      userID,
      sessionContext,
    });
    return apiClient;
  }
}

export class PasswordLoginHelpers extends LoginHelpers {
    private static readonly API_ENDPOINT = "https://b-graph.facebook.com/graphql";
    private static readonly USER_AGENT =
        "[FBAN/FB4A;FBAV/498.1.0.64.74;FBBV/692621185;FBDM/{density=1.5,width=540,height=960};FBLC/vi_VN;FBRV/0;FBCR/MobiFone;FBMF/Xiaomi;FBBD/Xiaomi;FBPN/com.facebook.katana;FBDV/2211133C;FBSV/9;FBOP/1;FBCA/x86_64:arm64-v8a;]";
    private static readonly AUTH_TOKEN = "OAuth 350685531728|62f8ce9f74b12f84c123cc23437a4a32";
    private static readonly CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static randomString(len: number): string {
        let result = "";
        for (let i = 0; i < len; i++) {
            result += this.CHARS[Math.floor(Math.random() * this.CHARS.length)];
        }
        return result;
    }

    private static generateNonce(size: number): string {
        const bytes = new Uint8Array(size);
        for (let i = 0; i < size; i++) bytes[i] = Math.floor(Math.random() * 256);
        return Buffer.from(bytes).toString("base64");
    }

    private static toBase64(text: string): string {
        return Buffer.from(text).toString("base64");
    }

    private static formatPassword(pwd: string): string {
        return `#PWD_FB4A:0:${Math.floor(Date.now() / 1000)}:${pwd}`;
    }

    private static hashData(uid: string): string {
        return this.toBase64(JSON.stringify({ challenge_nonce: this.generateNonce(32), username: uid }));
    }

    private static generateVariable(account: Account): string {
        const deviceId = randomUUID();
        // random sth
        const variable = {
            params: {
                params: JSON.stringify({
                    client_input_params: {
                        sim_phones: [],
                        secure_family_device_id: randomUUID(),
                        /*
                        attestation_result: {
                            data: this.hashData(account.uid),
                            signature:
                                "MEYCIQDtz5TqO0pwysy82Ko92FErORasLag9o/pQYlZl8+zaMgIhAKon529upFiPfGgoS6OkPKg0/VahBuSDxwiTgtzpYQA3",
                            keyHash: "92398b3e4d9ee926bae93a61fd75e18d750100c1e73fd44d4faa7b9ba9353eee",
                        },
                        */
                        has_granted_read_contacts_permissions: 0,
                        auth_secure_device_id: "",
                        has_whatsapp_installed: 0,
                        password: this.formatPassword(account.password),
                        sso_token_map_json_string: "",
                        event_flow: "login_manual",
                        password_contains_non_ascii: "false",
                        sim_serials: [],
                        client_known_key_hash: "",
                        encrypted_msisdn: "",
                        has_granted_read_phone_permissions: 0,
                        app_manager_id: "null",
                        should_show_nested_nta_from_aymh: 0,
                        device_id: deviceId,
                        login_attempt_count: 1,
                        machine_id: this.randomString(22),
                        flash_call_permission_status: {
                            READ_PHONE_STATE: "DENIED",
                            READ_CALL_LOG: "DENIED",
                            ANSWER_PHONE_CALLS: "DENIED",
                        },
                        accounts_list: [],
                        family_device_id: deviceId,
                        fb_ig_device_id: [],
                        device_emails: [],
                        try_num: 2,
                        lois_settings: { lois_token: "" },
                        event_step: "home_page",
                        headers_infra_flow_id: "",
                        openid_tokens: {},
                        contact_point: account.uid,
                    },
                    server_params: {
                        should_trigger_override_login_2fa_action: 0,
                        is_from_logged_out: 0,
                        should_trigger_override_login_success_action: 0,
                        login_credential_type: "none",
                        server_login_source: "login",
                        waterfall_id: randomUUID(),
                        login_source: "Login",
                        is_platform_login: 0,
                        pw_encryption_try_count: 1,
                        INTERNAL__latency_qpl_marker_id: 36707139,
                        offline_experiment_group: "caa_iteration_v6_perf_fb_2",
                        is_from_landing_page: 0,
                        password_text_input_id: "jirv90:99",
                        is_from_empty_password: 0,
                        is_from_msplit_fallback: 0,
                        ar_event_source: "login_home_page",
                        username_text_input_id: "jirv90:98",
                        layered_homepage_experiment_group: null,
                        device_id: deviceId,
                        INTERNAL__latency_qpl_instance_id: 1.18039064400779e14,
                        reg_flow_source: "login_home_native_integration_point",
                        is_caa_perf_enabled: 1,
                        credential_type: "password",
                        is_from_password_entry_page: 0,
                        caller: "gslr",
                        family_device_id: deviceId,
                        is_from_assistive_id: 0,
                        access_flow_version: "F2_FLOW",
                        is_from_logged_in_switcher: 0,
                    },
                }),
                // const
                bloks_versioning_id: "cb6ac324faea83da28649a4d5046c3a4f0486cb987f8ab769765e316b075a76c",
                app_id: "com.bloks.www.bloks.caa.login.async.send_login_request",
            },
            scale: "1.5",
            nt_context: {
                using_white_navbar: true,
                // const
                styles_id: "55d2af294359fa6bbdb8e045ff01fc5e",
                pixel_ratio: 1.5,
                is_push_on: true,
                debug_tooling_metadata_token: null,
                is_flipper_enabled: false,
                theme_params: [],
                // can be dynamic
                bloks_version: "cb6ac324faea83da28649a4d5046c3a4f0486cb987f8ab769765e316b075a76c",
            },
        };
        return JSON.stringify(variable);
    }

    private static extractCookieToken(data: string): AuthenticatedResult {
        const tokenMatch = data.match(/"access_token":"([^"]+)"/);
        const cookiesMatch = data.match(/"session_cookies":\s*\[([^\]]+)\]/);

        const cookies: string[] = [];
        if (cookiesMatch) {
            const pattern = /"name":"([^"]+)","value":"([^"]+)"/g;
            let m: RegExpExecArray | null;
            while ((m = pattern.exec(cookiesMatch[1]))) cookies.push(`${m[1]}=${m[2]}`);
        }

        return {
            token: tokenMatch?.[1] ?? "Access token not found",
            cookie: cookies.join("; "),
        };
    }

    /**
     * Performs Facebook login via Katana API
     * @param account - Account with UID and password
     * @returns Cookie and token upon successful authentication
     * @warn Accounts with 2FA are not supported, and the function will return an error
     * @deprecated This login method is unstable and may be blocked by Facebook at any time.
     */
    static async login(account: Account): Promise<AuthenticatedResult> {
        const headers: Record<string, string> = {
            "User-Agent": this.USER_AGENT,
            Authorization: this.AUTH_TOKEN,
            "Content-Type": "application/x-www-form-urlencoded",
            "x-fb-sim-hni": "45201",
            "x-fb-net-hni": "45201",
            "x-fb-device-group": "2789",
            "x-fb-connection-type": "WIFI",
            "x-fb-http-engine": "Tigon/Liger",
            "x-fb-client-ip": "True",
            "x-fb-server-cluster": "True",
            "x-graphql-client-library": "graphservice",
            "x-graphql-request-purpose": "fetch",
            "x-fb-friendly-name": "FbBloksActionRootQuery-com.bloks.www.bloks.caa.login.async.send_login_request",
            "x-tigon-is-retry": "False",
            "x-zero-eh": "error",
            "Accept-Encoding": "identity",
        };

        const body = new URLSearchParams({
            method: "post",
            pretty: "false",
            format: "json",
            server_timestamps: "true",
            locale: "vi_VN",
            purpose: "fetch",
            fb_api_req_friendly_name: "FbBloksActionRootQuery-com.bloks.www.bloks.caa.login.async.send_login_request",
            fb_api_caller_class: "graphservice",
            client_doc_id: "11994080423986492941384902285",
            variables: this.generateVariable(account),
            fb_api_analytics_tags: '["GraphServices"]',
            client_trace_id: randomUUID(),
        });

        const res = await fetch(this.API_ENDPOINT, { method: "POST", headers, body: body.toString() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = this.extractCookieToken((await res.text()).replace(/\\/g, ""));
        return result;
    }
}

export default LoginHelpers;