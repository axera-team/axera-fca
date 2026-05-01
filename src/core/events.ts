
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
  [LoginEvent.CANCELLED]: [{ event: string, signal: AbortSignal, time: number }];
  [LoginEvent.START]: [{ cookie?: Cookie, fcaOptions: FCAOptions }];
  [LoginEvent.PROGRESS]: [{ operation: Operation, step: string }];

  [LoginEvent.SUCCESS]:   [{ cookie: Cookie; fcaOptions: FCAOptions }];
  [LoginEvent.ERROR]:     [{ error: Error }];
  [LoginEvent.LOCKED]:    [{ reason: string }];
  [LoginEvent.SUSPENDED]: [{ reason: string }];
}

export default { LoginEvent };