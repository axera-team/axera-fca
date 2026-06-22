import { LoginResult, FCAOptions } from "../types";

export const LoginEvent = {
  CANCELLED: "operation:cancelled",
  START: "login:start",
  PROGRESS: "login:progress",
  
  COMPLETE: "login:complete",
  ERROR: "login:error",
  FAILED: "login:failed",

  LOCKED: "account:locked",
  SUSPENDED: "account:suspended",
} as const;

export type LoginEvents = {
  [LoginEvent.CANCELLED]: { event: string, signal: AbortSignal, time: number };
  [LoginEvent.START]: { fcaOptions: FCAOptions };
  [LoginEvent.PROGRESS]: { step: string, message: string | null, level: "info" | "warn" | "error" };

  [LoginEvent.COMPLETE]:   LoginResult;
  
  [LoginEvent.FAILED]:    {
    code: "LOGIN_FAILURE_NO_SESSION_CONTEXT",
    success: false,
    response: null,
    error: Error,
    cancelled: boolean,
  } | {
    code: "LOGIN_FAILURE_INTERNAL_ERROR",
    success: false,
    response: null,
    error: Error,
    cancelled: boolean,
  } | {
    code: 'LOGIN_FAILURE_CATCH_INTERNAL_ERROR',
    success: false,
    response: null,
    error: Error,
    cancelled: boolean
  }
  [LoginEvent.ERROR]:     { error: Error };
  [LoginEvent.LOCKED]:    { reason: string };
  [LoginEvent.SUSPENDED]: { reason: string };
}

export type LoginCallback = <K extends keyof LoginEvents>(
  event: K,
  payload: LoginEvents[K]
) => void;