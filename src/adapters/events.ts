import { EventBus, EventDomain } from "../core/bus";
import Operation from "../core/operation";
import LoginFlow from "../flows/login";
import { Cookie, FCAOptions } from "../types";

function loginEvents(cookie: Cookie, options: FCAOptions) {
  // Enable observability if specified
  const bus = new EventBus<{ login: EventDomain }>({ observability: !!options.eventBusSettings.observability });
  const op = new Operation({ timeout: options.timeout });
  const flow = new LoginFlow({ cookie, options, operation: op });
  
  (async () => {
    try {
      // Initialize login domain
      bus.login = bus.createDomain("login");
      bus.login.emit("start", { options });
      
      flow.setBusNotifier(bus.login);
      const result = await flow.run(bus);
      
      if (result.success) {
        console.log(result);
        bus.login.emit("success", { api: result.api, options });
      } else if (result.error) {
        bus.login.emit("error", { error: result.error, options });
      } else if (result.cancelled) {
        bus.login.emit("cancelled", { reason: result.reason, options });
      }
    } catch (error) {
      bus.login.emit("error", { critical: true, error, options });
      throw error;
    }
  })();

  return {
    bus,
    cancel: () => op.cancel()
  };
};

export default function (cookie, options = {}) {
  try {
    const login = loginEvents(cookie, options);
    return { success: true, api: login.api, error: null, cancelled: this.cancelled };
  } catch (err) {
    return { success: false, error: err, cancelled: this.cancelled };
  }
};
