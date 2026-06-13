
import Operation from "../core/operation";
import { Cookie, FCAOptions } from "../types";

export const LoginEvent = {
  CANCELLED: "operation:cancelled",
  START: "login:start",
  PROGRESS: "login:progress",
  
  SUCCESS: "login:success",
  ERROR: "login:error",

  LOCKED: "account:locked",
  SUSPENDED: "account:suspended",
} as const;

export type LoginEvents = {
  [LoginEvent.CANCELLED]: { event: string, signal: AbortSignal, time: number };
  [LoginEvent.START]: { userID: string | null, fcaOptions: FCAOptions };
  [LoginEvent.PROGRESS]: { step: string, message: string | null, level: "info" | "warn" | "error" };

  [LoginEvent.SUCCESS]:   { userID: string, appID: string, fcaOptions: FCAOptions };
  [LoginEvent.ERROR]:     { error: Error };
  [LoginEvent.LOCKED]:    { reason: string };
  [LoginEvent.SUSPENDED]: { reason: string };
}

export type LoginCallback = <K extends keyof LoginEvents>(
  event: K,
  payload: LoginEvents[K]
) => void;