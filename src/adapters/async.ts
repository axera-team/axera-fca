import { EventDomain, EventBus } from "../core/bus";
import { LoginEvent, LoginEvents } from "../core/events";
import LoginFlow from "../flows/login";
import Operation from "../core/operation";

import { Cookie, FCAOptions, CancellablePromise } from "../types";

// AppEvents contain the domains that have the specific types for every event and corresponding output of that event.
type AppEvents = {
  login: LoginEvents;
}

export default async function loginAsync(cookie: Cookie, options: FCAOptions) {
  if (Object.keys(options).length < 5) throw new Error(`Invalid/empty configuration provided to the FCA.`);

  const op = new Operation({ timeout: options.timeout });
  const bus = new EventBus<AppEvents>({ observability: !!options.eventBusSettings.observability });

  const login = bus.domains.login || bus.createDomain("login");
  
  // Announce the start of the login process
  login.emit("login:start", { fcaOptions: options });
  
  const promise = new Promise((resolve, reject) => {
    const ok = (data) => {
      cleanup();
      resolve(data.api);
    };

    const bad = (err) => {
      cleanup();
      reject(err);
    };

    function cleanup() {
      login.off(LoginEvent.SUCCESS, ok);
      login.off(LoginEvent.ERROR, bad);
    }

    // These listeners will call after the LoginFlow() completes.
    login.once(LoginEvent.SUCCESS, ok);
    login.once(LoginEvent.ERROR, bad);

    login.emit(LoginEvent.START, { cookie, fcaOptions: options });

    const flow = new LoginFlow<AppEvents>({ cookie, options, operation: op });

    // We pass the bus to the login processor so it gives us a response back.
    flow.setBusNotifier(login);
    flow.run(bus);
  }) as CancellablePromise<LoginFlow<AppEvents>['api']>;

  promise.cancel = () => op.cancel()
  
  return promise;
};
