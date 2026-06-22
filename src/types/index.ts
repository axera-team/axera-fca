import type { AxiosResponse } from 'axios';
import type { CookieJar } from 'tough-cookie';
import type OperationClass from '../core/operation'
import type ApiClientClass from '../http/apiClient';

export type TypedPromise<T> = Promise<T>;

// a custom promise
export type CancellablePromise<T> = Promise<T> & {
  cancel: () => void
};

export namespace BusEventsMap {
  interface LoginEvents {
    start: { cookie: Cookie; options: FCAOptions };
    success: { api: LoginFlow['API'] };
    error: Error;
  };
};

/**
 * The parameters required for Facebook internal API requests.
 * 
 * These values are typically extracted from authenticated sessions.
 */
export type FBApiParams = {
  /** The app version. */
  av: string;
  
  /** The user ID. */
  __user: string;
  
  /** The request ID. */
  __req: string;
  
  /** The revision. */
  __rev: string;
  
  /** The API version. */
  __a: number;
  
  /** The Facebook DTSG token. */
  fb_dtsg: string;
  
  /** The Facebook Jazoest token. */
  jazoest: string;
};

export type FBApiParamsWithDefaults = FBApiParams & {
  av: string;
  __user: string;
  __req: string;
  __rev: string;
  __a: number;
  fb_dtsg: string;
  jazoest: string;
};

/**
 * @description This is the user's session context generated after HTTP login and before MQTT connection.
 */
// Want access to .jar? itll be transferred to SessionManager!
export interface UserSessionContext {
  /** Temporary while we patch things up */
  globalOptions?: FCAOptions;
  mqttEndpoint?: string | null,
  region?: string | null,
  appID?: string | null,
  userID?: string | null,
  deviceID?: string | null,
  clientID?: string | null,
  sessionID?: string | null,
  lastSeqId?: string | null,
  firstListen?: boolean | true,
  loggedIn?: boolean | true,
  access_token?: string | "NONE",
  clientMutationId?: number | 0,
  mqttClient?: undefined | import('mqtt').MqttClient,
  syncToken?: undefined,
  wsReqNumber?: number | 0,
  wsTaskNumber?: number | 0,
  reqCallbacks?: Record<string, any>,
  callback_Task?: Record<string, any>,
  dtsgResult?: FB_ACCOUNT_DTSG,
};

export type FCAOptions = {
  autoMarkDelivery: boolean;
  autoMarkRead: boolean;
  autoReconnect: boolean;
  emitReady: boolean;
  forceLogin: boolean;
  listenEvents: boolean;
  listenTyping: boolean;
  online: boolean;
  proxy: string | null;
  randomUserAgent: boolean;
  selfListen: boolean;
  selfListenEvent: boolean;
  userAgent: string;
  updatePresence: boolean;
  timeout: number;
  httpClientSettings: {
    proxy?: string | null,
    jar?: CookieJar | null,
    keepAlive?: boolean,
    timeout?: number | 60000,
    maxSockets?: number | 30
  };
  eventBusSettings: {
    observability: boolean;
  };
}

export type FB_ACCOUNT_DTSG = { [userID: string]: { fb_dtsg: string, jazoest: string } };

export type FCAEvents = {
  login: (user: string) => void;
  logout: () => void;
  error: (error: Error) => void;
};

export type Operation = typeof OperationClass;

export type Appstate = import('tough-cookie').SerializedCookie[];
export type Cookie = import('tough-cookie').SerializedCookie[];

export type EncryptedCookie = {
  vaulted: true;
  vaultedAt: number;
  signature: string;
  vaultedSignature: string;
};

export type UserSessionType = {
  id: string;
  data: Appstate;
  filePath: string | null;
};

export type HttpClient = Readonly<{
  cleanGet: (url: string) => Promise<string>;
  get: (url: string, qs: Object, options: Object, ctx: Object, customHeader: Object) => Promise<string>;
  post: (url: string, data: Object, options: Object, ctx: Object, customHeader: Object) => Promise<string>;
  postFormData: (url: string, data: Object, options: Object, ctx: Object, customHeader: Object) => Promise<string>;
}>;

export type HttpClientResponse = {
  statusCode: AxiosResponse['status'],
  statusMessage: AxiosResponse['statusText'],
  headers: AxiosResponse['headers'],
  body: AxiosResponse['data'],
  url: AxiosResponse['config']['url'],
  method: AxiosResponse['config']['method'],
}

export type EventBusOptions = {
  observability: boolean;
}

export interface ApiRegistry {
  API: Readonly<{
    [x: string]: () => Promise<any> | (() => {});
  } | {}>;
}

export interface LoginFlow {
  API: ApiRegistry['API'];
}

export type ApiClient = ApiClientClass;

export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
}

/**
 * The Old Infamous CJS Factory
 * 
 * ```js
 * function(defaultFuncs, api, ctx) { 
 *  return function() {}
 * }
 * ```
 * 
 * @deprecated This is the old way API modules were defined, and is still supported for backward compatibility. However, it is recommended to use the new class-based approach for better readability, maintainability, and type safety.
 * 
 * @param defaultFuncs - Default functions refer to API HTTP Client (get, post, postFormData) that can be used to make API calls, and are passed as the first argument to the factory function for backward compatibility. However, it is recommended to use the API client provided in the new class-based approach for better consistency and maintainability.
 * @param api - The API object containing all the currently loaded API modules, which can be used to call other API modules within an API module. This is passed as the second argument to the factory function for backward compatibility, but it is recommended to use the new class-based approach for better readability and maintainability.
 * @param ctx - The session context, which contains information about the current session, such as userID, appID, etc.
 * 
 * @returns A function that does a specific task, which can be used to interact with the Facebook Messenger API.
 * 
 * This is the old way API modules were defined, and is still supported for backward compatibility. However, it is recommended to use the new class-based approach for better readability, maintainability, and type safety.
 */
export interface ApiModuleV1 {
  default: (defaultFuncs: ApiClient['getApiClient'], api: LoginFlow['API'], ctx: UserSessionContext) => (...args: any[]) => Promise<any> | any;
}

export interface ApiModuleV2 {
  name: string;
  execute(...args: any[]): Promise<any>;
}


export interface LoginResult {
  code: string;
  success: boolean;
  response: { 
    apiClient: ReturnType<ApiClient['getApiClient']>,
    userSessionContext: UserSessionContext
  } | null;
  error: Error | null;
  cancelled: boolean;
}

export * from './fb';