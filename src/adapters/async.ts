import { EventBus } from "../core/bus";
import { LoginEvent, LoginEvents } from "../core/events";

import LoginFlow from "../flows/login";
import Operation from "../core/operation";

import type { Cookie, FCAOptions, CancellablePromise, LoginResult } from "../types";

import { defaultFCAOptions } from "../utils/constants";

// AppEvents contain the domains that have the specific types for every event and corresponding output of that event.
type AppEvents = {
  login: LoginEvents;
};

export async function loginAsync(cookie: Cookie, options?: FCAOptions | undefined) {
  if (!options) options = defaultFCAOptions;
  if (Object.keys(options).length < 5) throw new Error(`Invalid/empty configuration provided to the FCA.`);

  const op = new Operation({ timeout: options.timeout });
  const bus = new EventBus<AppEvents>({ observability: !!options.eventBusSettings.observability });

  const login = bus.createDomain("login");
  
  // Announce the start of the login process
  login.emit(LoginEvent.START, { fcaOptions: options });
  
  const promise = new Promise((resolve, reject) => {
    const ok = (loginResult: LoginResult) => {
      cleanup();
      resolve(loginResult);
    };

    const bad = ({ error }: { error: Error }) => {
      cleanup();
      reject(error);
    };

    function cleanup() {
      login.off(LoginEvent.COMPLETE, ok);
      login.off(LoginEvent.ERROR, bad);
    }

    // These listeners will call after the LoginFlow() completes.
    login.once(LoginEvent.COMPLETE, ok);
    login.once(LoginEvent.ERROR, bad);

    login.emit(LoginEvent.START, { fcaOptions: options });

    const flow = new LoginFlow({ cookie, options, operation: op });

    // We pass the bus to the login processor so it gives us a response back.
    flow.addChannel(login);
    flow.run(bus);
  }) as CancellablePromise<any>;

  promise.cancel = () => op.cancel()
  
  return promise;
};