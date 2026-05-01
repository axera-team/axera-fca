// adapters/callback.js
import { EventBus, EventDomain } from "../core/bus";
import EVENTS from "../core/events";
import Operation from "../core/operation";
import LoginFlow from "../flows/login";
import { Cookie, FCAOptions } from "../types";

export default function loginCallback(cookie: Cookie, options: FCAOptions, cb: (eventName: string, payload: any) => void) {
  const op = new Operation({ timeout: options.timeout });
  const bus = new EventBus<{ login: EventDomain }>({ observability: !!options.eventBusSettings.observability });
  const login = bus.domains.login || bus.createDomain("login");
  
  login.emit("start", { fcaOptions: options });
  
  try {
    function done(evt: string, handler: (eventName: string, payload: any[]) => void) {
      return (payload?: any) => {
        if (payload.op !== op) return;
        cleanup();
        handler(evt, payload);
      };
    }
  
    function cleanup() {
      login.off(EVENTS.SUCCESS, success);
      login.off(EVENTS.ERROR, error);
      login.off(EVENTS.CANCELLED, cancelled);
    }
  
    // p = promise containing data to return
    const success = done(EVENTS.SUCCESS, (eventName, payload) => cb(EVENTS.SUCCESS, payload.api));
    const error = done(EVENTS.ERROR, (eventName, payload) => cb(EVENTS.SUCCESS, payload.error));
    const cancelled = done(EVENTS.CANCELLED, (eventName, payload) => cb(EVENTS.SUCCESS, payload.reason));


    login.once(EVENTS.SUCCESS, success);
    login.once(EVENTS.CANCELLED, cancelled);
    login.on(EVENTS.ERROR, error);
    
    login.emit(EVENTS.START, { cookie, options, op });
  
    const flow = new LoginFlow({ cookie, options, operation: op });
    flow.setBusNotifier(login);
    flow.run(bus);

    return {
      cancel: () => op.cancel()
    };

  } catch (error) {
    login.on(EVENTS.ERROR, () => cb(EVENTS.ERROR, error));
    login.off(EVENTS.ERROR, () => cb(EVENTS.ERROR, error));
    login.off(EVENTS.START, () => cb(EVENTS.START, error));
    
    cb(EVENTS.ERROR, error);
  }
};