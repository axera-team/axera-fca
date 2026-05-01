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
export interface UserSessionContext {
  mqttEndpoint?: string | null,
  region?: string | null,
  appID?: string | null,
  userID?: string | null,
  deviceID?: string | null,
  clientID?: string | null,
  sessionID?: string | null,
  lastSeqId?: string | null,
  jar: import('tough-cookie').CookieJar,
  firstListen?: boolean | true,
  loggedIn?: boolean | true,
  access_token?: string | "NONE",
  clientMutationId?: number | 0,
  mqttClient?: undefined,
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

export type UserSession = {
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

export type * from '../core/bus';