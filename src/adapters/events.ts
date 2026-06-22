import type { Cookie, FCAOptions } from "../types";
import { defaultFCAOptions, Logger } from "../utils";
import { LoginEvent, LoginEvents } from "../core";
import { EventBus } from "../core/bus";

import Operation from "../core/operation";
import Login from "../flows/login";

const logger = new Logger({ scope: "FCA", color: "instagram", debugMode: true })

function createLoginFlow(cookie: Cookie, options: FCAOptions) {
  const op = new Operation({ timeout: options.timeout });
  const bus = new EventBus<{ login: LoginEvents }>({ 
    observability: !!options.eventBusSettings?.observability 
  });
  const login = bus.channel("login");
  const flow = new Login({ cookie, options, operation: op });
  
  flow.addChannel(login);
  
  return { op, bus, login, flow };
}

function loginEventsInternal(cookie: Cookie, options: FCAOptions) {
  // Enable observability if specified
  const bus = new EventBus<{ login: LoginEvents }>({ observability: !!options.eventBusSettings.observability });
  const operation = new Operation({ timeout: options.timeout });
  const flow = new Login({ cookie, options, operation });
  
  (async () => {
    try {
      // Initialize login domain
      const login = bus.channel("login");
      login.emit(LoginEvent.START, { fcaOptions: options });
      
      flow.addChannel(login);
      const result = await flow.run(bus);
      
      if (result.success) {
        login.emit(LoginEvent.COMPLETE, result);
      } else if (result.error) {
        login.emit(LoginEvent.ERROR, { error: result.error });
      }

      const isMqttListening = result?.response?.userSessionContext?.mqttClient ?? null;
      if (!isMqttListening) {
        logger.info('Login was successful, you may now call api.listenMqtt()!')
      }

      flow.registerAPIs();

      console.dir({ apis: flow.getAllAPIs(), count: flow.getApiCount() }, { depth: null })

      const api = flow.getAPI('listenMqtt');

      if (api) {
        api();
      }
      //@ts-ignore
      login.emit('login:session', flow);

    } catch (error) {
      bus.channel("login")?.emit(LoginEvent.ERROR, { error: error });
      throw error;
    }
  })();

  return {
    loginBus: bus.channel("login"),
    cancel: () => operation.cancel()
  };
};

export function loginEvents(cookie: Cookie, options?: FCAOptions | undefined) {
  try {
    if (!options) options = defaultFCAOptions;
    if (Object.keys(options).length < 5) throw new Error(`Invalid/empty configuration provided to the FCA.`);
    return loginEventsInternal(cookie, options);
  } catch (err) {
    throw err;
  }
};