const fs = require('fs/promises');
const crypto = require('crypto');
const { EventEmitter } = require('events');
const { CookieJar } = require("tough-cookie");

/**
 * User Session Manager
 * @classdesc Singleton Class
 */
class UserSessionsManager extends EventEmitter {
  /** @type {UserSessionsManager} */
  static #instance;
  
  /** @type {Map<string, UserSession>} */
  sessions = new Map();
  length = 0;

  static getInstance() {
    if (!UserSessionsManager.#instance) {
      UserSessionsManager.#instance = new UserSessionsManager();
    }
    return UserSessionsManager.#instance;
  }

  static generateID() {
    return crypto.randomUUID();
  }

  constructor() {
    if (!UserSessionsManager.#instance || !(UserSessionsManager.#instance instanceof UserSessionsManager)) {
      return UserSessionsManager.#instance;
    }
    super();
    UserSessionsManager.#instance = this;
  }

  getSessionCount() {
    return this.length;
  }

  /**
   * Adds a session to the manager.
   * @param {UserSession} session - The session to add.
   * @param {string} [sessionId] - The ID of the session. If not provided, a new ID will be generated.
   * @throws {Error} If the session is not provided.
   */
  addSession(session, sessionId) {
    if (!session || !(session instanceof UserSession)) {
      throw new Error('Session is required');
    }

    if (!sessionId && session.uniqueId) {
      sessionId = session.uniqueId;
    } else if (!sessionId) {
      sessionId = UserSessionsManager.generateID();
    }
    
    if (sessionId && this.sessions.has(sessionId)) {
      throw new Error(`Session with ID ${sessionId} already exists`);
    }

    this.sessions.set(sessionId, session);

    this.length = this.sessions.size;
    this.emit('sessionAdded', { sessionId, currentSession: session });
  }

  /**
   * Removes a session by ID
   *
   * @param {string} sessionId - The ID of the session to remove.
   * @throws {Error} If the session ID is not provided.
   * @throws {Error} If the session with the given ID is not found.
   */
  removeSession(sessionId) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }

    this.sessions.delete(sessionId);
    this.length = this.sessions.size;
    this.emit('sessionRemoved', { session, sessionId });
  }
  
  /**
   * Updates a session by ID
   *
   * @param {string} sessionId - The ID of the session to update.
   * @param {UserSession} session - The data to update the session with.
   * @throws {Error} If the session ID is not provided.
   * @throws {Error} If the session is not a valid UserSession instance.
   * @throws {Error} If the session with the given ID is not found.
   */
  updateSession(sessionId, session) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    if (!session || !(session instanceof UserSession)) {
      throw new Error('Valid user session is required');
    }

    /** @type {UserSession | undefined} */
    const existingSession = this.sessions.get(sessionId);
    if (!existingSession) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    
    const newSession = new UserSession({});

    this.sessions.set(sessionId, session);
    this.emit('sessionUpdated', { session, sessionId });
  }

  /**
   * Gets a session by ID
   *
   * @param {string} id - The ID of the session to retrieve.
   * @returns {UserSession | undefined} The session with the given ID, or undefined if not found.
   */
  getSessionById(id) {
    return this.sessions.get(id);
  }

  /**
   * Listens for session added events.
   * @param {Function} callback - The callback function to invoke when a session is added.
   */
  onSessionAdded(callback) {
    this.on('sessionAdded', callback);
  }

  /**
   * Listens for session removed events.
   * @param {Function} callback - The callback function to invoke when a session is removed.
   */
  onSessionRemoved(callback) {
    this.on('sessionRemoved', callback);
  }

  /**
   * Listens for session updated events.
   * @param {Function} callback - The callback function to invoke when a session is updated.
   */
  onSessionUpdated(callback) {
    this.on('sessionUpdated', callback);
  }
}

class UserSession {
  #jar;
  #state = {
    status: 'unauthenticated',
    isLoggedIn: false,
    isCookieLoaded: false // cookie loaded?
  };
  #ready = false; // Pertains to the Cookie[] being injected successfully and not an aempty Cookiejar
  
  /** @type {Map<string, UserSession>} */
  #oldSessions = new Map();
  createdAt = Date.now();
  
  static parseOldAppstate(appstate) {
    
    const jar = new CookieJar();
    const session = new UserSession({
      filePath: data[1],
      cookieJar: jar
    });
    session.isCookieLoaded = true;
    return { jar, session };
  }
  
  /**
   * Creates a new Session instance from a file.
   * @typedef {import('../types').ErrnoException} ErrnoException
   * @param {string} filePath - The path to the file containing the session data.
   * @returns {Promise<UserSession | undefined>} A new Session instance.
   * @throws {ErrnoException} - When the file does not exist, or when the file is not a valid session file.
   */
  static async fromFile(filePath) {
    let jar, session;
    const data = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(data);
    
    if (Array.isArray(parsed) && parsed.length) {
      const { jar, session } = UserSession.parseOldAppstate(parsed);
      session = new UserSession({
        filePath,
        cookieJar: jar
      });
    } else if ('uniqueId' in parsed) {
      jar = CookieJar.fromJSON(parsed.cookie);
      session = new UserSession({
        filePath,
        cookieJar: jar
      });
      session.isCookieLoaded = true;
    }

    return session;
  }

  /**
   * Creates a new UserSession instance.
   * @param {{ endpoint?: string | undefined, filePath?: string | undefined, cookieJar?: import('tough-cookie').CookieJar | undefined }} sessionInitOptions - The options for the session.
   */
  constructor({ endpoint = "https://www.facebook.com", filePath = undefined, cookieJar = undefined } = {}) {
    this.endpoint = endpoint;
    this.uniqueId = UserSessionsManager.generateID();

    this.filePath = filePath;
    this.#jar = cookieJar || new CookieJar();
    
    if (!cookieJar) {
      this.#state.status = "empty";
    } else {
      this.#state.status = "loaded";
    }
    
    UserSessionsManager.getInstance().addSession(this);
  }
  
  async #initialize(cookie) {
    if (this.filePath) {
      const data = await fs.readFile(this.filePath, "utf8");
      this.#data = JSON.parse(data);
    } else {
      this.#data = cookie;
    }

    this.isCookieLoaded = true;
  }
  
  get isAuthenticated() {
    return this.#state.status === "authenticated";
  }

  async saveToFile(filePath = this.filePath) {
    if (!filePath) throw new Error('No file path specified');
    const shape = {
      uniqueId: this.uniqueId,
      filePath: this.filePath,
      cookie: this.#jar.toJSON()
    };
    const data = JSON.stringify(shape, null, 2);
    await fs.writeFile(filePath, data, 'utf8');
  }

  async updateCookie(newCookie) {
    if (!newCookie || !(newCookie instanceof CookieJar)) throw new Error('Invalid cookie');
    
    await this.ready;
    
    this.#oldSessions.set(this.uniqueId, this);
    
    this.uniqueId = crypto.randomUUID();
    this.#jar = newCookie;
    this.createdAt = Date.now();
    
    await this.saveToFile();
  }
  
  hasAuthCookies() {
    const serialized = this.#jar?.serializeSync();
    const keys = serialized?.cookies.map(c => c.key) || [];
  
    return keys.includes("c_user") && keys.includes("xs");
  }
  
  toJSON() {
    return Object.freeze({
      uniqueId: this.uniqueId,
      filePath: this.filePath,
      cookie: this.#jar.toJSON()
    });
  }
}

module.exports = { UserSession, UserSessionsManager };
