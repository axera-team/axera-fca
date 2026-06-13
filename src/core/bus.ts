/**
 * Copyright 2026 Axera Team. All rights reserved.
 * @author Axera Team (https://github.com/JakeAsunto/axera-fca)
 */
"use strict";
import { EventEmitter } from "node:events";
import { EventBusOptions as EventBusSettings } from "../types";

type EventMap = Record<string, any>;

export class BusError extends Error {
  public readonly code: string;
  public readonly name: string;
  public readonly message: string;

  constructor(message: string, code?: string) {
    super(message, { cause: { code, message } });
    this.name = "BusError";
    this.message = message;
    this.code = code || "BUS_GENERIC_ERROR";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusError);
    }
  }
}

/** Removed Symbol Event Name Communication due to the insane complexity... */
/**
 * @copyright Axera Team (https://github.com/JakeAsunto/axera-fca)
 */

/**
 * The Event Bus where all events of the application flow.
 * @example
 * ```js
 * const bus = new EventBus({ observability: false });
 * bus.on('login.event', () => {});
 * bus.emit('login.event', { user: 'Axera Dev' });
 *
 * // Create a new domain
 * bus.channel('user');
 * bus.user.on('login', () => {});
 * bus.user.emit('login', { user: 'Axera Dev' });
 *
 * // Turn on observability (for debugging only, can cause performance issues in production)
 * bus.enableObservability();
 *
 * // Listen for all events
 * bus.onAny((eventPayload) => {
 *   console.log(`Event ${eventPayload.name} emitted with data:`, eventPayload);
 * });
 *
 * // Turn off observability
 * bus.disableObservability();
 * ```
 *
 * @author Axera Team (https://github.com/JakeAsunto/axera-fca)
 * @copyright Axera Team
 */
export class EventBus<TEvents extends EventMap> extends EventEmitter {
  public observability: EventBusSettings['observability'];

  #history = new Map<string, any>();
  #eventNames = new Map<string, string>();
  
  // internal storage — plain, writable
  
  #domains: Record<keyof TEvents, Channel<TEvents[keyof TEvents]>> = Object.create(null) as { [K in keyof TEvents]: Channel<TEvents[K]> };
  
  channel(domainName: keyof TEvents & string): Channel<TEvents[keyof TEvents]> {
    if (!this.#domains[domainName]) {
      const channel = new Channel<TEvents[keyof TEvents]>(this as any, domainName);
      this.#domains[domainName] = channel;
    }
    return this.#domains[domainName];
  }

  /**
   * Utility function to convert domain and event names to a full event name.
   * @param domainName - The domain name.
   * @param eventName - The event name.
   * @returns The full event name.
   */
  static toFullEventName(domainName: string, eventName: string) {
    return `${domainName}.${eventName}` as string;
  }

  /**
   * Create a new event bus instance.
   */
  constructor({ observability = false }: EventBusSettings = { observability: false }) {
    super();
    this.setMaxListeners(60);
    this.observability = observability;
  }

  enableObservability() {
    this.observability = true;
  }

  disableObservability() {
    this.observability = false;
  }

  /**
   * Listen for any event emitted by the bus.
   * @param handler - The event handler.
   */
  onAny(handler: (eventPayload: { event: string, name: string, args: any }) => void) {
    super.on("*", handler);
  }
  
  emitGlobal(eventData: { event: string, name: string, args: any } | null = null) {
    if (eventData && Object.keys(eventData).length > 0) {
      super.emit(eventData.event, eventData.args);
      super.emit("*", {
        name: eventData.name,
        args: eventData.args,
      });
    }
  }

  emitGlobalError(error: Error, context: { event?: string, name?: string, args?: any } = {}) {
    const eventData = {
      event: context.event || "error",
      name: context.name || "error",
      args: context.args || error,
    };
    this.emitGlobal(eventData);
    super.emit("error", error, { globalError: true, ...context });
  }

  /**
   * Emit an event with the given name and arguments.
   * @param event - The event name.
   * @param args - The event arguments.
   * @returns Whether the event was handled.
   */
  emit(event: string, ...args: any[]) {
    this.#history.set(event, args);

    try {
      const handled = super.emit(event, ...args);

      // this is observability hook
      if (this.observability) {
        this.emitGlobal({
          event,
          name: this.#eventNames.get(event) || event,
          args,
        });
      }

      return handled as boolean;
    } catch (err) {
      if (this.observability) {
        super.emit("error", err, {
          globalError: true,
          name: this.#eventNames.get(event) || event,
          error: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
        });
      }
      return false;
    }
  }

  /**
   * Listen an onCancellable listener
   */
  onCancellable(event: string, signal: AbortSignal, handler: (...args: any[]) => void, domainName: string, eventName: string) {
    if (!(signal instanceof AbortSignal))
      throw new Error("Invalid abort signal passed");
    if (signal.aborted) return;

    const wrapped = (...args: any[]) => {
      if (!signal.aborted) handler(...args);
    };

    this.on(event, wrapped);

    signal.addEventListener("abort", () => {
      this.removeListener(event, wrapped);
      super.emit(EventBus.toFullEventName(domainName, "cancelled"), {
        event: EventBus.toFullEventName(domainName, eventName),
        signal,
        time: Date.now(),
      });
    });
  }

  /**
   *
   * @param event
   * @param signal
   * @param handler
   * @returns
   */
  onceCancellable(event: string, signal: AbortSignal, handler: (...args: any[]) => void, domainName?: string, eventName?: string) {
    if (signal.aborted) return Promise.reject(new Error("Signal aborted"));

    const wrapped = (...args: any[]) => {
      if (!signal.aborted) handler(...args);
    };

    this.once(event, wrapped);

    signal.addEventListener("abort", () => {
      const cancelledEventName = EventBus.toFullEventName(domainName || "INTERNAL", "cancelled");
      const payloadEventName = EventBus.toFullEventName(domainName || "INTERNAL", eventName || "INTERNAL_EVENT");
      const payload = {
        type: "cancelled",
        event: payloadEventName,
        signal,
        time: Date.now(),
      };

      super.emit(cancelledEventName, payload);
      super.emit("*", payload);

      signal.removeEventListener('abort', wrapped);
      this.removeListener(event, wrapped);
    });
  }

  /**
   * Wait for a single event with a timeout.
   * @param event
   * @param timeout
   * @returns
   */
  async onceWithTimeout(event: string, timeout: number = 5000) {
    return new Promise((resolve, reject) => {
      const eventName = this.#eventNames.get(event) || event;

      const timer = setTimeout(() => {
        this.removeListener(event, handler);
        reject(new Error(`Event "${eventName}" timed out`));
      }, timeout);

      const handler = (...args: any[]) => {
        clearTimeout(timer);
        resolve(args);
      };

      this.once(event, handler);
    });
  }

  /**
   * Replay an event with the given handler.
   * @param event The event string.
   * @param handler The event handler.
   */
  replay(event: string, handler: (...args: any[]) => void) {
    if (this.#history.has(event)) {
      handler(...this.#history.get(event));
    }
    this.on(event, handler);
  }

  /**
   * Create a new event domain.
   * @param name The domain name.
   * @returns The new event domain.
   */
  createDomain<K extends keyof TEvents & string>(name: K): Channel<TEvents[K]> {
    if (!name || !name.trim() || typeof name !== "string") throw new Error("Domain name is required");

    let domain = this.getDomain(name);
    if (!domain) {
      domain = new Channel<TEvents[K]>(this as unknown as EventBus<TEvents[K]>, name);
      this.#domains[name] = domain;
    }

    return domain;
  }

  getDomain<K extends keyof TEvents & string>(name: K): Channel<TEvents[K]> | null {
    if (!name || !name.trim() || typeof name !== "string") throw new Error("Domain name is required");
    const domain = this.#domains[name];
    return (domain && domain instanceof Channel) ? domain : null;
  }

  removeDomain(name: string) {
    if (!name || !name.trim() || typeof name !== "string") throw new Error("Domain name is required");
    if (this.#domains[name] && this.#domains[name] instanceof Channel) {
      delete this.#domains[name];
    }
  }

  // I have new idea: onNewDomain() though idk where this is useful
}

/**
 * A child domain of the Event Bus
 * @author Axera Team (https://github.com/axera-team/axera-fca)
 */
export class Channel<TEvents extends Record<string, any>> {
  #bus: EventBus<TEvents>;
  #registeredEvents: Map<string, Set<Function>>;

  public readonly name: string;
  public readonly events: Record<string, string> = Object.create(null);

  /**
   * A channel for event communication.
   * @param bus
   * @param name
   */
  constructor(bus: EventBus<TEvents>, name: string) {
    if (!bus || !(bus instanceof EventBus))
      throw new BusError("EventBus is required", "INVALID_BUS_INSTANCE");
    if (!name || !name.trim() || typeof name !== "string")
      throw new BusError("Domain name is required", "INVALID_DOMAIN_NAME");

    this.#bus = bus;
    this.name = name;
    this.#registeredEvents = new Map();
    this.events = Object.create(null); // cache
  }

  /**
   * Register an event handler within this bus domain.
   * @param event
   * @param handler
   */
  on<K extends keyof TEvents & string>(event: K, handler: (args: TEvents[K]) => void) {
    this.#bus.on(event, handler);

    if (!this.#registeredEvents.has(event)) {
      this.#registeredEvents.set(event, new Set());
    }
    this.#registeredEvents.get(event)?.add(handler);
  }

  /**
   * Emit an event within this bus domain.
   * @param event
   * @param args
   * @returns
   */
  emit<K extends keyof TEvents & string>(event: K, args: TEvents[K]) {
    return this.#bus.emit(event, args);
  }

  /**
   * Register an event handler within this bus domain that will be called only once.
   * @param event
   * @param handler
   */
  once<K extends keyof TEvents & string>(event: K, handler: (args: TEvents[K]) => void) {
    this.#bus.once(event, handler);

    if (!this.#registeredEvents.has(event)) {
      this.#registeredEvents.set(event, new Set());
    }
    this.#registeredEvents.get(event)?.add(handler);
  }

  /**
   * Remove an event handler within this bus domain.
   * @param event
   * @param handler
   */
  off<K extends keyof TEvents & string>(event: K, handler: (args?: TEvents[K]) => void) {
    this.#bus.off(event, handler);

    this.#registeredEvents.get(event)?.delete(handler);
  
    // optional: clean up the empty set
    if (this.#registeredEvents.get(event)?.size === 0) {
      this.#registeredEvents.delete(event);
    }
  }

  /**
   * Replay an event within this bus domain.
   * @param event
   * @param handler
   */
  replay<K extends keyof TEvents & string>(event: K, handler: (args: TEvents[K]) => void) {
    this.#bus.replay(event, handler);
  }

  /**
   * Returns a Promise that resolves when the event fires.
   * @param event
   * @param timeout
   * @returns
   */
  async onceWithTimeout<K extends keyof TEvents & string>(event: K, timeout: number = 20000) {
    return this.#bus.onceWithTimeout(event, timeout);
  }

  /**
   * Register a cancellable event listener within this bus domain.
   * @param event The event name.
   * @param signal The abort signal.
   * @param handler The event handler.
   */
  onCancellable<K extends keyof TEvents & string>(event: K, signal: AbortSignal, handler: (args: TEvents[K]) => void) {
    this.#bus.onCancellable(event, signal, handler, this.name, event);

    if (!this.#registeredEvents.has(event)) {
      this.#registeredEvents.set(event, new Set());
    }
    this.#registeredEvents.get(event)?.add(handler);

    return Promise.resolve(true);
  }

  /**
   * Register a cancellable event handler within this bus domain that will be called only once.
   * @param event
   * @param signal
   * @param handler
   * @returns
   */
  onceCancellable<K extends keyof TEvents & string>(event: K, signal: AbortSignal, handler: (args: TEvents[K]) => void) {
    this.#bus.onceCancellable(event, signal, handler);

    if (!this.#registeredEvents.has(event)) {
      this.#registeredEvents.set(event, new Set());
    }
    this.#registeredEvents.get(event)?.add(handler);

    return Promise.resolve(true);
  }
  
  /**
   * Remove all listeners
   * 
   * O(1) lookup by event name, and correct deduplication of handlers per event since the function reference is stable.
   */
  removeAllListeners() {
    for (const [event, handlers] of this.#registeredEvents) {
      for (const handler of handlers) {
        this.#bus.off(event, handler as any);
      }
    }
    this.#registeredEvents.clear();
  }
}

Object.freeze(Channel.prototype);