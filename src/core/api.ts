"use strict";

import { UndiciResponseWrapper as UndiciResponse } from '../http/client';
import { makeParsable } from "../utils/helpers";

import { ApiClient as ApiClientType, SessionContext } from "../types";
import ApiClient from '../http/apiClient';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface APIOptions { 
  apiClient: ApiClientType;
  userContext: SessionContext;
}

class ApiModuleError extends Error {
  code: string;
  name: string;
  message: string;

  constructor(message: string, code: string = "API_MODULE_ERROR", values?: any[]) {
    super(message, { cause: { code, values } });
    this.message = message;
    this.name = "APIModuleError";
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiModuleError);
    }
  }
}

class NetworkRequestError extends Error {
    code: string;
    name: string;
    message: string;

    constructor(message: string, code: string = "NETWORK_REQUEST_ERROR", values?: any[]) {
        super(message, { cause: { code, values } });
        this.message = message;
        this.name = "NetworkRequestError";
        this.code = code;
        const err = new Error("Request retry failed. Check the `res` and `statusCode` property on this error.");
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NetworkRequestError);
        }
    }
}

/**
 * This is the ultimate blueprint in designing new API modules. 
 * 
 * Every API module should extend the BaseAPI class, which provides common functionality and enforces a consistent interface for executing API calls.
 * 
 * The ApiLoader will use the execute method defined in each API module to manage and invoke API calls in a standardized way.
 */
export interface ApiModule {
  name: string;
  execute(...args: any[]): Promise<any>;
}

/**
 * You were never meant to pass api modules directly. Use the ApiLoader to load and access API modules. This class is meant to be extended by individual API modules, and should not be instantiated directly.
 * 
 * {@link ApiLoader} for loading and accessing API modules.
 * 
 * {@link ApiClient} for making HTTP requests and managing session state.
 * 
 * {@link SessionContext} for accessing session-specific information and state.
 * 
 * {@link BaseAPI} serves as a base class for all API modules, providing common functionality and enforcing a consistent interface for executing API calls. It is designed to be used in conjunction with the
 * 
 * It provides a common structure and shared functionality for all API modules, such as access to the ApiClient and session context. It also enforces a consistent interface for executing API calls, which can be used by the ApiLoader to manage and invoke API modules in a standardized way.
 */

export abstract class BaseAPI implements ApiModule {
  abstract name: string;
  protected apiClient: ApiClientType;
  protected userContext: SessionContext;

  prototype: typeof BaseAPI;

  constructor({ apiClient, userContext }: APIOptions);

  constructor({ apiClient, userContext }: APIOptions) {
    if (!apiClient || !userContext) {
      throw new ApiModuleError("Missing required parameters", "MISSING_REQUIRED_PARAMETERS", [{
        moduleName: this.constructor.name,
        apiClient: !!apiClient,
        userContext: !!userContext,
      }]);
    }

    if (!(apiClient instanceof ApiClient)) {
      throw new ApiModuleError("Invalid parameter types", "INVALID_PARAMETER_TYPES", [{
        apiClient: typeof apiClient,
      }]);
    }

    if (!(userContext instanceof Object) || Array.isArray(userContext) || Object.keys(userContext).length === 0) {
      throw new ApiModuleError("Invalid parameter types", "INVALID_PARAMETER_TYPES", [{
        userContext: typeof userContext,
      }]);
    }

    this.apiClient = apiClient;
    this.userContext = userContext;
  }

  /**
   * Updates the API client and user context for the API module.
   * @param apiClient - The new API client instance.
   * @param userContext - The new user context.
   */
  updateContext({ apiClient, userContext }: { apiClient: ApiClient, userContext: SessionContext }) {
    if (apiClient && apiClient instanceof ApiClient) {
      this.apiClient = apiClient;
    }
    if (userContext && Object.keys(userContext).length > 0) {
      this.userContext = userContext;
    }
  }

  assertCheck() {
    if (Object.keys(this.userContext).length === 0) {
      throw new Error("User context is empty. Make sure you are logged in and the session context is properly set.");
    }

    if (!this.apiClient) {
      throw new Error("API client is not initialized. Make sure you are logged in and the API client is properly set.");
    }
  }

  abstract execute(...args: any[]): Promise<any>;
}

export type ApiConstructorType = new ({ apiClient, userContext }: APIOptions) => BaseAPI;
export const ApiConstructor = BaseAPI;