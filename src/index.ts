import callback from "./adapters/callback";
import async from "./adapters/async";
import events from "./adapters/events";

export {
  callback,
  async,
  events,
};

export default {
  callback,
  async,
  events,
  
  /** For convenience */
  login: {
    callback,
    async,
    events,
  },
};