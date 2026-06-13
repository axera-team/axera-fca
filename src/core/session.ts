import { Cookie, CookieJar, SerializedCookie } from "tough-cookie";

import fs from 'fs/promises';
import crypto from 'crypto';

export interface UserSessionOptions {
  appstate?: SerializedCookie[];
}

export class UserSession {
  readonly createdAt: number = Date.now();
  readonly #FCA_SESSION_ID: string = crypto.randomUUID();

  #jar: CookieJar;
  #state: {
    status: 'unauthenticated' | 'authenticated' | 'empty_jar';
    isLoggedIn: boolean;
    isCookieLoaded: boolean;
    isValidCookie: boolean;
    cookieJSON: any;
  } = {
    status: 'unauthenticated',
    isLoggedIn: false,
    isCookieLoaded: false,
    isValidCookie: false,
    cookieJSON: null
  };

  #ready = false; // Pertains to the Cookie[] being injected successfully and not an empty Cookiejar
  #oldSessions: Map<string, UserSession> = new Map();
  
  /**
   * Creates a new Session instance from a file.
   * @param filePath The path to the file containing the session data.
   * @returns A new Session instance.
   * @throws {ErrnoException} When the file does not exist, or when the file is not a valid session file.
   */
  static async fromFile(filePath: string) {
    const fileExists = await fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK)
    .then(() => true).catch(() => false);

    if (!fileExists) {
      throw new Error(`Session file not found at path: ${filePath}`);
    }

    const data = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(data);
    
    if (Array.isArray(parsed) && parsed.length) {
      const { jar, userSession } = UserSession.useOldSession(parsed);
      userSession.#init(jar);
      return userSession;
    } else if (parsed && parsed.cookie) {
      const jar = CookieJar.fromJSON(parsed.cookie);
      const userSession = new UserSession({ appstate: [] });
      userSession.#init(jar);
      return userSession;
    } else {
      throw new Error('Invalid session file format');
    }
  }

  static useOldSession(appstate: SerializedCookie[]) {
    if (!appstate || !Array.isArray(appstate)) {
      throw new Error('Invalid session data: expected an array of cookies');
    }

    const jar = new CookieJar();
    UserSession.setCookiesFromSerialized(jar, appstate);

    const cookie = jar.getCookiesSync(`https://www.facebook.com`);
    if (!cookie) {
      throw new Error('Invalid session data: missing required cookies');
    }

    const serializedJar = jar.serializeSync();
    if (!serializedJar) {
      throw new Error('Failed to serialize cookie jar');
    }

    return {
      jar: CookieJar.fromJSON(serializedJar),
      userSession: new UserSession({ appstate })
    }
  }

  static setCookiesFromSerialized(jar: CookieJar, cookies: SerializedCookie[]) {
    cookies.forEach(cookieData => {
      const cookie = Cookie.fromJSON(cookieData);
      if (cookie) {
        jar.setCookieSync(cookie, `https${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`);
      }
    });
  }

  /**
   * Creates a new UserSession instance.
   * @param sessionInitOptions - The options for the session.
   */
  constructor({ appstate }: UserSessionOptions) {
    this.#jar = new CookieJar();

    if (!appstate) {
      this.#state.status = "empty_jar";
      throw new Error('No appstate provided. Session initialized with empty cookie jar.');
    }

    UserSession.setCookiesFromSerialized(this.#jar, appstate);
    this.#init(this.#jar);
  }
  
  #init(cookieJar: CookieJar) {
    const serialized = cookieJar.serializeSync();
    if (!serialized) throw new Error('Failed to serialize cookie jar');

    this.#state.cookieJSON = serialized;
    this.#state.isCookieLoaded = true;

    if (serialized.cookies.length === 0) {
      this.#state.status = "empty_jar";
      return;
    }

    const keys = serialized.cookies.map(c => c.key);
    if (keys.includes("c_user") && keys.includes("xs")) {
      this.#state.status = "authenticated";
      this.#state.isLoggedIn = true;
      this.#state.isValidCookie = true;
      this.#ready = true;
    } else {
      this.#state.status = "unauthenticated";
    }
  }

  get status() {
    return this.#state.status;
  }

  get isAuthenticated() {
    return this.#state.status === "authenticated";
  }

  get isLoggedIn() {
    return this.#state.isLoggedIn;
  }

  async updateCookie(newCookie: CookieJar) {
    if (!newCookie || !(newCookie instanceof CookieJar)) throw new Error('Invalid cookie');
    
    if (!this.#ready) {
      throw new Error('Session not ready');
    }

    this.#oldSessions.set(this.#FCA_SESSION_ID, this);
    this.#jar = newCookie;

    this.#init(this.#jar);
  }
  
  hasAuthCookies() {
    const serialized = this.#jar?.serializeSync();
    if (!serialized) {
      return false;
    }
    const keys = serialized?.cookies.map(c => c.key) || [];
    if (keys.length === 0) {
      return false;
    }
  
    return keys.includes("c_user") && keys.includes("xs");
  }
  
  toJSON() {
    return Object.freeze({
      uniqueID: this.#FCA_SESSION_ID,
      cookie: this.#jar.toJSON()
    });
  }
}