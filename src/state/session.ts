/*!
 * @license
 * Copyright (c) 2026 Axera Team
 * All Rights Reserved.
 * Licensed under the GNU Affero General Public License (AGPL-3.0). See LICENSE file in the project root for full license information.
 */

/**
 * @copyright Axera Team (https://github.com/JakeAsunto/axera-fca)
 * @author Axera Team <axera-team@protonmail.com>
 */

// ============ INTERNAL SESSION MANAGER ===============
class SessionManager {
  public sessions: Set<Session>;
  
  constructor() {
    this.sessions = new Set();
  }
  
  createSession() {}
  
  addSession() {}
  
  readSession() {}
  
  closeSession() {}
}

class Session {
  #session: any;
  #deviceData: any;
  
  constructor(session, deviceData) {
    this.#session = session;
  }
}