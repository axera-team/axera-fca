/// ApiRegistry stored all the apis
/// ApiManager handles actions

import { BaseAPI as Api, ApiConstructor, ApiConstructorType } from "./api";
import { ApiClient, SessionContext } from "../types";

import APIRegistry from "./api-registry";

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

export class LegacyModule extends Api {
  name = "legacyModule";
  _fn: Function;

  constructor({ apiClient, userContext }, legacyFn: Function) {
    super({ apiClient, userContext });
    this._fn = legacyFn;
  }

  async execute(...args: any[]) {
    const defaultFuncs = this.apiClient.getApiClient();
    const ctx = this.userContext;
    return this._fn(defaultFuncs, null, ctx)(...args);
  }
}

/**
 * You use this once in the main entry point of you bot to load the API modules.
 * Use {@link ApiLoader} to load and access API modules, which ensures that each module is only instantiated once per session context, and provides a centralized way to access all API modules.
 * 
 * Use {@link ApiRegistry} to manage the API registry after loading all modules, and {@link BaseAPI} as a base class for all API modules.
 * 
 * When creating new modules, extend the {@link BaseAPI} class and implement the `execute()` method, then add the module to the registry using `APIRegistry.add()`. The module will then be available for loading/access through the ApiLoader.
 * 
 * Acts as a factory and cache for API modules. Ensures that each module is only instantiated once per session context, and provides a centralized way to access all API modules.
 */
export class ApiManager {
  #apiClient: ApiClient;
  #userSessionContext: SessionContext;

  private static _extendsApi(ModuleClass: Function): boolean {
    return this._isApiInstance(ModuleClass) || ModuleClass === Api;
  }

  private static _isApiInstance(ModuleClass: Function): boolean {
    return ModuleClass instanceof ApiConstructor || (ModuleClass.prototype instanceof Api);
  }

  constructor({ apiClient, sessionContext }: { apiClient: ApiClient, sessionContext: SessionContext }) {
    this.#apiClient = apiClient;
    this.#userSessionContext = sessionContext;
  }

  get(name: string): Api {
    if (!name) throw new ApiLoaderError("API name is required", "MISSING_API_NAME");

    const ModuleClass = APIRegistry.get(name);

    if (!ModuleClass) throw new ApiLoaderError(`API '${name}' not found`, "API_NOT_FOUND", [name]);

    const instance = new ModuleClass({
      apiClient: this.#apiClient,
      userContext: this.#userSessionContext
    });

    if (!instance || !(instance instanceof Api)) {
      throw new ApiLoaderError(`'${name}' did not return an Api instance`, "INVALID_API_INSTANCE", [name]);
    }

    return instance;
  }

  load(ModuleClass: ApiConstructorType): Api {
    if (!ModuleClass) throw new ApiLoaderError("API class is required", "MISSING_API_CLASS");

    if (!ApiManager._extendsApi(ModuleClass)) {
      throw new ApiLoaderError(`'${ModuleClass.name}' does not extend Api`, "INVALID_API_CLASS", [ModuleClass.name]);
    }

    const name = ModuleClass.name;

    if (APIRegistry.has(name)) {
      throw new ApiLoaderError(`API '${name}' already loaded`, "API_ALREADY_LOADED", [name]);
    }

    APIRegistry.add(name, ModuleClass);

    return this.get(name);
  }

  loadFromFile(path: string) {
    const ModuleClass = require(path);
    return this.get(ModuleClass);
  }

  loadAll() {
    return Object.fromEntries(
      APIRegistry.list().map(name => [name, this.get(name)])
    );
  }
}