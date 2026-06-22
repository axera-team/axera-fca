/// ApiLoader caches the class once
import { createRequire } from "module";

import { ApiClient, UserSessionContext } from "../types";
import LegacyApiRegistry from "./legacy-api-registry";

class LegacyApiManagerError extends Error {
  code: string;
  name: string;
  message: string;

  constructor(message: string, code: string = "API_LOADER_ERROR", values?: any[]) {
    super(message, { cause: { code, values } });
    this.message = message;
    this.name = "LegacyApiManagerError";
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LegacyApiManagerError);
    }
  }
}

interface LegacyApiManagerOptions {
  apiClient: ApiClient;
  userSessionContext: UserSessionContext;
}

/**
 * This class operates as the singleton manager of the API Registry with the intent in saving resources upon usage.
 * 
 * Reusing the same API methods and just rapidly switching context is the fundamental concept of Node.js
 * 
 * {@link LegacyApiManager}
 * 
 * {@link LegacyApiManagerError}
 * 
 * @throws {LegacyApiManagerError} - When specific requirements of its methods aren't met
 */
export class LegacyApiManager {
  #apiClient: ApiClient;
  #api: Record<string, Function>;
  #ctx: UserSessionContext;

  constructor({ apiClient, userSessionContext }: LegacyApiManagerOptions) {
    this.#apiClient = apiClient;
    this.#ctx = userSessionContext;
    this.#api = LegacyApiRegistry.proxy();
  }

  get(name: string): Function {
    if (!name) throw new LegacyApiManagerError("API name is required", "MISSING_API_NAME");

    const moduleFunction = LegacyApiRegistry.get(name);

    if (!moduleFunction) throw new LegacyApiManagerError(`API '${name}' not found`, "API_NOT_FOUND", [name]);
    
    return moduleFunction;
  }

  load(name: string, moduleFunction: Function): Function {
    if (!name) throw new LegacyApiManagerError("API name is required", "MISSING_API_NAME");
    if (!moduleFunction || typeof moduleFunction !== "function") {
      throw new LegacyApiManagerError(`A valid module function must be provided for '${name}'`, "INVALID_MODULE_FUNCTION", [name]);
    }

    if (LegacyApiRegistry.has(name)) {
      throw new LegacyApiManagerError(`API '${name}' already loaded`, "API_ALREADY_LOADED", [name]);
    }

    const actualFunction = moduleFunction(this.#apiClient, this.#api, this.#ctx);
    if (typeof actualFunction !== "function") {
      throw new LegacyApiManagerError(`Module function for '${name}' did not return a function`, "INVALID_MODULE_RETURN", [name]);
    }

    LegacyApiRegistry.add(name, actualFunction);

    return this.get(name);
  }

  replayAPI(name: string) {
    const moduleFunction = this.get(name);
    if (typeof moduleFunction !== "function") {
      throw new LegacyApiManagerError(`Module for '${name}' is not a function and cannot be replayed`, "INVALID_MODULE_FUNCTION", [name]);
    }

    return moduleFunction(this.#apiClient, this.#api, this.#ctx);
  }

  loadFromFile(path: string) {
    const require = createRequire(import.meta.url);
    const moduleFunction = require(path);
    const name = path.split('/').pop()?.split('.').shift() || path;

    return this.load(name, moduleFunction);
  }

  getAll() {
    return Object.fromEntries(
      LegacyApiRegistry.list().map(name => [name, this.get(name)])
    );
  }

  proxy() {
    return LegacyApiRegistry.proxy();
  }
}