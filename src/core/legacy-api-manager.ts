/// ApiLoader caches the class once
import { createRequire } from "module";

import { ApiClient, SessionContext } from "../types";
import LegacyApiRegistry from "./legacy-api-registry";

class ApiLoaderError extends Error {
  code: string;
  name: string;
  message: string;

  constructor(message: string, code: string = "API_LOADER_ERROR", values?: any[]) {
    super(message, { cause: { code, values } });
    this.message = message;
    this.name = "ApiLoaderError";
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiLoaderError);
    }
  }
}

//LEGACY_API_MODULE_MANAGER!
export class LegacyApiManager {
  #apiClient: ApiClient;
  #api: Record<string, Function>;
  #ctx: SessionContext;

  constructor({ apiClient, sessionContext }: { apiClient: ApiClient, sessionContext: SessionContext }) {
    this.#apiClient = apiClient;
    this.#ctx = sessionContext;
    this.#api = LegacyApiRegistry.proxy();
  }

  get(name: string): Function {
    if (!name) throw new ApiLoaderError("API name is required", "MISSING_API_NAME");

    const moduleFunction = LegacyApiRegistry.get(name);

    if (!moduleFunction) throw new ApiLoaderError(`API '${name}' not found`, "API_NOT_FOUND", [name]);
    
    return moduleFunction;
  }

  load(name: string, moduleFunction: Function): Function {
    if (!name) throw new ApiLoaderError("API name is required", "MISSING_API_NAME");
    if (!moduleFunction || typeof moduleFunction !== "function") {
      throw new ApiLoaderError(`A valid module function must be provided for '${name}'`, "INVALID_MODULE_FUNCTION", [name]);
    }

    if (LegacyApiRegistry.has(name)) {
      throw new ApiLoaderError(`API '${name}' already loaded`, "API_ALREADY_LOADED", [name]);
    }

    const actualFunction = moduleFunction(this.#apiClient, this.#api, this.#ctx);
    if (typeof actualFunction !== "function") {
      throw new ApiLoaderError(`Module function for '${name}' did not return a function`, "INVALID_MODULE_RETURN", [name]);
    }

    LegacyApiRegistry.add(name, actualFunction);

    return this.get(name);
  }

  replayAPI(name: string) {
    const moduleFunction = this.get(name);
    if (typeof moduleFunction !== "function") {
      throw new ApiLoaderError(`Module for '${name}' is not a function and cannot be replayed`, "INVALID_MODULE_FUNCTION", [name]);
    }

    return moduleFunction(this.#apiClient, this.#api, this.#ctx);
  }

  loadFromFile(path: string) {
    const require = createRequire(import.meta.url);
    const moduleFunction = require(path);
    const name = path.split('/').pop()?.split('.').shift() || path;

    return this.load(name, moduleFunction);
  }

  loadAll() {
    return Object.fromEntries(
      LegacyApiRegistry.list().map(name => [name, this.get(name)])
    );
  }
}