class APIRegistryError extends Error {  
  code: string;
  name: string;
  message: string;

  constructor(message: string, code: string = "REGISTRY_ERROR", values?: any[]) {
    super(message, { cause: { code, values } });
    this.message = message;
    this.name = "APIRegistryError";
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIRegistryError);
    }
  }
}

/**
 * Zero dependency API registry for managing and exposing APIs in a controlled manner. Provides methods to add, get, delete, list, and extend APIs with error handling and immutability features.
 * 
 * This registry is designed to be used in the context of the Facebook Chat API, but can be adapted for other use cases as needed. It allows for dynamic loading of APIs, as well as sealing the registry to prevent further modifications at runtime.
 */
export class LegacyApiRegistry {
  static #sealed = false;
  static #forbidden = new Set(["__proto__", "prototype", "constructor"]);

  static #apis: Record<string, Function> = Object.create(null);

  static get isApisLoaded(): boolean {
    return Object.keys(this.#apis).length > 0;
  }

  static get isApisSealed(): boolean {
    return this.#sealed;
  }

  /**
   * Get frozen status of the registry.
   * @returns
   */
  static get isApisFrozen(): boolean {
    return Object.isFrozen(this.#apis);
  }

  /**
   * Load a collection of functions into the registry.
   * @param functionCollection - An array of objects containing function names as keys and functions as values.
   */
  static bulkLoadToRegistry(functionCollection: Record<string, Function>): { loaded: number, failed: number } {
    let loadedCount = 0;
    for (const [name, fn] of Object.entries(functionCollection)) {
      if (typeof fn === 'function') {
        this.add(name, fn);
        loadedCount++;
      }
    }
    return { loaded: loadedCount, failed: Object.keys(functionCollection).length - loadedCount };
  }
  
  
  /**
   * Add a single API to the registry
   */
  static add(name: string, handler: Function): void;

  /**
   * Add multiple APIs to the registry via an object map
   */
  static add(name: Record<string, Function>): void;

  /**
   * Add an API to the registry.
   * @param name - The name of the API.
   * @param handler - The API handler function.
   * @returns
   */
  static add(name: string | Record<string, Function>, handler?: Function): void {
    if (this.#sealed) {
      throw new APIRegistryError("Cannot add API after seal", "REGISTRY_SEALED", [name]);
    }
    if (!name || name === null) throw new APIRegistryError("API name is required", "API_NAME_REQUIRED", [name]);
    if (!handler) throw new APIRegistryError("API handler is required", "API_HANDLER_REQUIRED", [name]);
    if (Array.isArray(name)) throw new APIRegistryError("API name cannot be an array", "INVALID_API_FORMAT", [name]);

    switch (typeof name) {
      case "string": {
        if (this.#forbidden.has(name)) {
          throw new APIRegistryError(`API name '${name}' is not allowed`, "API_NAME_FORBIDDEN", [name]);
        }

        if (name in this.#apis) {
          throw new APIRegistryError(`API '${name}' already exists`, "API_ALREADY_EXISTS", [name]);
        }

        if (typeof handler !== "function") {
          throw new APIRegistryError(`API '${name}' must be a function`, "INVALID_API_FORMAT", [name]);
        }

        this.#apis[name] = handler;
        break;
      }

      case "object": {
        Object.entries(name).forEach(([name, handler]) => {
          this.add(name, handler);
        });
        break;
      }

      default: {
        throw new APIRegistryError("API name must be a string or an object", "INVALID_API_FORMAT", [name]);
      }
    }
  }

  /**
   * Get an API from the registry.
   * @param name 
   * @returns
   */
  static get(name: string): Function | null {
    if (!name) throw new APIRegistryError("API name is required", "API_NAME_REQUIRED", [name]);
    if (!this.has(name)) return null;
    return this.#apis[name];
  }

  /**
   * Check if the registry has the api.
   * @param name 
   * @returns 
   */
  static has(name: string) {
    return this.#apis[name] !== undefined;
  }
  
  /**
   * Delete an API from the registry.
   * @param name The name of the API to delete.
   * @throws {Error} If the API name is not allowed or does not exist.
   * @returns
   */
  static delete(name: string) {
    if (!name) throw new APIRegistryError("API name is required");

    if (this.#forbidden.has(name)) {
      throw new APIRegistryError(`API name '${name}' is not allowed`);
    }

    if (this.#sealed) {
      throw new APIRegistryError("Cannot delete API after seal", "REGISTRY_SEALED", [name]);
    }

    if (!this.has(name)) {
      throw new APIRegistryError(`API '${name}' does not exist`);
    }

    delete this.#apis[name];
  }

  /**
   * List all APIs in the registry.
   * @returns An array of API names currently registered.
   */
  static list(): string[] {
    return Object.keys(this.#apis);
  }

  /**
   * Expose the API registry as a frozen object. Contains all APIs added before runtime.
   * @returns A frozen object containing the API registry.
   */
  static expose(): Readonly<{ [name: string]: Function }> {
    return Object.freeze({ ...this.#apis });
  }
  
  /**
   * Seal the API registry at runtime to harden it and prevent misuse.
   */
  static seal() {
    this.#sealed = true;
    Object.freeze(this.#apis);
  }

  /** Unseal the API registry, use only when needed, use seal() after modification. */
  static unseal() {
    this.#sealed = false;
    const original = Object.getPrototypeOf(this.#apis) as Record<string, Function>;
    this.#apis = Object.create(null);
    Object.setPrototypeOf(this.#apis, original);
  }
  
  /**
   * Extend the registry with custom APIs.
   * 
   * Note: This method allows extending the registry with custom APIs at runtime. But does not add the api to the registry. You need to use `add()` or `bulkLoadToRegistry()` to add the api to the registry.
   * @example
   * const registry = new ApiRegistry();
   * // core APIs
   * registry.extend(api => {
   *    api.add("setOptions", setOptions);
   *    api.add("getAppState", getAppState);
   * });
   * 
   * // extend with custom APIs
   * registry.extend(api => {
   *    api.add("customApi", customApi);
   * });
   * 
   * @param fn - A function that takes the exposed API registry and the registry itself as arguments.
   */
  static extend(fn: Function | Record<string, Function>) {
    if (this.#sealed) {
      throw new APIRegistryError("Cannot extend after seal", "REGISTRY_SEALED");
    }

    if (typeof fn === "function") {
      /** Expose the apis, and the registry itself */
      fn(this.expose(), this);
    } else if (typeof fn === "object") {
      Object.values(fn).forEach(fn => {
        fn(this.expose(), this);
      });
    } else {
      throw new APIRegistryError("extend() expects a function or an object of functions", "INVALID_EXTEND_FORMAT", [fn]);
    }
  }

  static proxy(): Record<string, Function> {
    return new Proxy({} as Record<string, Function>, {
      get(_, name: string) {
        return LegacyApiRegistry.get(name);
      },
      has(_, name: string) {
        return LegacyApiRegistry.has(name);
      },
      ownKeys() {
        return LegacyApiRegistry.list();
      },
      getOwnPropertyDescriptor(_, name: string) {
        if (LegacyApiRegistry.has(name)) {
          return { configurable: true, enumerable: true, writable: false };
        }
      },
    });
  }
}

Object.freeze(LegacyApiRegistry.prototype);
export default LegacyApiRegistry;