// adapters/callback.js
import { EventBus } from "../core/bus";
import { LoginEvent, LoginEvents, LoginCallback } from "../core/events";
import Operation from "../core/operation";
import LoginFlow from "../flows/login";
import { Cookie, FCAOptions } from "../types";

export function loginCallback(cookie: Cookie, options: FCAOptions, cb: LoginCallback) {
  const op = new Operation({ timeout: options.timeout });
  const bus = new EventBus<{ login: LoginEvents }>({ observability: !!options.eventBusSettings?.observability });
  const login = bus.createDomain("login");
  
  try {
    // p = promise containing data to return
    // Create wrapped handlers
    const success = createHandler(LoginEvent.SUCCESS, (eventName, payload) => cb(eventName, payload));
    const error = createHandler(LoginEvent.ERROR, (eventName, payload) => cb(eventName, payload));
    const cancelled = createHandler(LoginEvent.CANCELLED, (eventName, payload) => cb(eventName, payload));

    function cleanup() {
      login.off(LoginEvent.SUCCESS, success);
      login.off(LoginEvent.ERROR, error);
      login.off(LoginEvent.CANCELLED, cancelled);
    }

    function createHandler<T extends keyof LoginEvents>(
      evt: T, 
      handler: (eventName: T, payload: LoginEvents[T]) => void
    ) {
      return (payload: LoginEvents[T]) => {
        cleanup();
        handler(evt, payload);
      };
    }

    // Set up listeners
    login.once(LoginEvent.SUCCESS, success);
    login.once(LoginEvent.CANCELLED, cancelled);
    login.on(LoginEvent.ERROR, error);
    
    // Emit start event
    login.emit(LoginEvent.START, { userID: null, fcaOptions: options });
  
    const flow = new LoginFlow({ cookie, options, operation: op });
    flow.addChannel(login);
    flow.run(bus);

    return {
      cancel: () => op.cancel()
    };
  } catch (error) {
    login.removeAllListeners();
    login.emit(LoginEvent.ERROR, { error: error as Error });
    cb(LoginEvent.ERROR, { error: error as Error });
  }
};