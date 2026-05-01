/**
 * Copyright 2026 Axera Team. All rights reserved.
 * @author Axera Team (https://github.com/JakeAsunto/axera-fca)
 */
"use strict";
import { EventEmitter } from "node:events";
import { EventBusOptions as EventBusSettings } from "../types";

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
 * bus.createDomain('user');
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
type EventMap = Record<string, any>;

class EventBus<TEvents extends EventMap> extends EventEmitter {
  public observability: EventBusSettings['observability'];

  #history = new Map<symbol, any>();
  #eventNames = new Map<symbol, string>();
  
  // internal storage — plain, writable
  
  #domains: Record<keyof TEvents, EventDomain<TEvents[keyof TEvents]>> = Object.create(null) as { [K in keyof TEvents]: EventDomain<TEvents[K]> };
  
  get domains() {
    return this.#domains as { [K in keyof TEvents]: EventDomain<TEvents[K]> };
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
    this.setMaxListeners(50);
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
   * @param {Function} handler - The event handler.
   */
  onAny(handler) {
    super.on("*", handler);
  }
  
  emitAll(eventData: { event: symbol, name: string, args: any } | null = null) {
    if (eventData && Object.keys(eventData).length > 0) {
      super.emit(eventData.event, ...eventData.args);
      super.emit("*", {
        event: eventData.event,
        name: this.getEventName(eventData.event),
        args: eventData.args,
      });
    }
  }

  /**
   * Emit an event with the given name and arguments.
   * @param event - The event name.
   * @param args - The event arguments.
   * @returns Whether the event was handled.
   */
  emit(event: symbol, ...args: any[]) {
    this.#history.set(event, args);

    try {
      const handled = super.emit(event, ...args);

      // this is observability hook
      if (this.observability) {
        this.emitAll({
          event,
          name: this.getEventName(event),
          args,
        });
      }

      return handled as boolean;
    } catch (err) {
      if (this.observability) {
        super.emit("error", err, {
          event,
          name: this.getEventName(event),
        });
      }
      return false;
    }
  }

  /**
   * Listen an onCancellable listener
   */
  onCancellable(event: symbol, signal: AbortSignal, handler: (...args: any[]) => void, domainName: string, eventName: string) {
    if (!(signal instanceof AbortSignal))
      throw new Error("Invalid abort signal passed");
    if (signal.aborted) return;

    const wrapped = (...args) => {
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
  onceCancellable(event: symbol, signal: AbortSignal, handler: (...args: any[]) => void, domainName?: string, eventName?: string) {
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
   * 
   * @param event
   * @param timeout
   * @returns
   */
  async onceWithTimeout(event: symbol, timeout: number = 5000) {
    return new Promise((resolve, reject) => {
      const eventName = this.getEventName(event);

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
   * @param event The event symbol.
   * @param handler The event handler.
   */
  replay(event: symbol, handler: (...args: any[]) => void) {
    if (this.#history.has(event)) {
      handler(...this.#history.get(event));
    }
    this.on(event, handler);
  }

  /**
   * Register an event symbol with a name.
   * @param symbol The event symbol.
   * @param name The event name.
   * @returns The event symbol.
   */
  registerEvent(symbol: symbol, name: string) {
    this.#eventNames.set(symbol, name);
    return symbol;
  }

  /**
   * Get the name of an event symbol.
   * @param event The event symbol.
   * @returns {string} The event name.
   */
  getEventName(event: symbol) {
    return (this.#eventNames.get(event) || event.toString()) as string;
  }

  /**
   * Create a new event domain.
   * @param name The domain name.
   * @returns The new event domain.
   */
  createDomain<K extends keyof TEvents & string>(name: K): EventDomain<TEvents[K]> {
    if (!name || !name.trim() || typeof name !== "string") throw new Error("Domain name is required");

    let domain = this.getDomain(name);
    if (!domain) {
      domain = new EventDomain<TEvents[K]>(this as unknown as EventBus<TEvents[K]>, name);
      this.#domains[name] = domain;
    }

    return domain;
  }

  getDomain<K extends keyof TEvents & string>(name: K): EventDomain<TEvents[K]> | null {
    if (!name || !name.trim() || typeof name !== "string") throw new Error("Domain name is required");
    const domain = this.#domains[name];
    return (domain && domain instanceof EventDomain) ? domain : null;
  }

  removeDomain(name: string) {
    if (!name || !name.trim() || typeof name !== "string") throw new Error("Domain name is required");
    if (this.#domains[name] && this.#domains[name] instanceof EventDomain) {
      delete this.#domains[name];
    }
  }

  // I have new idea: onNewDomain() though idk where this is useful
}

/**
 * A child domain of the Event Bus
 * @author Axera Team (https://github.com/axera-team/axera-fca)
 */
class EventDomain<TEvents extends Record<string, any[]>> {
  #bus: EventBus<TEvents>;
  name: string;
  events: Record<string, symbol> = Object.create(null);

  /**
   * A child domain for event handling.
   * @param bus
   * @param name
   */
  constructor(bus: EventBus<TEvents>, name: string) {
    if (!bus || !(bus instanceof EventBus))
      throw new Error("EventBus is required");
    if (!name || !name.trim() || typeof name !== "string")
      throw new Error("Domain name is required");

    this.#bus = bus;
    this.name = name;
    this.events = Object.create(null); // cache
  }

  /**
   * Register an event handler within this bus domain.
   * @param event
   * @param handler
   */
  on<K extends keyof TEvents & string>(event: K, handler: (...args: TEvents[K]) => void) {
    this.#bus.on(this.key(event), handler);
  }

  /**
   * Emit an event within this bus domain.
   * @param event
   * @param args
   * @returns
   */
  emit<K extends keyof TEvents & string>(event: K, ...args: TEvents[K]) {
    return this.#bus.emit(this.key(event), ...args);
  }

  /**
   * Register an event handler within this bus domain that will be called only once.
   * @param event
   * @param handler
   */
  once<K extends keyof TEvents & string>(event: K, handler: (...args: TEvents[K]) => void) {
    this.#bus.once(this.key(event), handler);
  }

  /**
   * Remove an event handler within this bus domain.
   * @param event
   * @param handler
   */
  off<K extends keyof TEvents & string>(event: K, handler: (...args: TEvents[K]) => void) {
    this.#bus.off(this.key(event), handler);
  }

  /**
   * Replay an event within this bus domain.
   * @param event
   * @param handler
   */
  replay<K extends keyof TEvents & string>(event: K, handler: (...args: TEvents[K]) => void) {
    this.#bus.replay(this.key(event), handler);
  }

  /**
   * Register an event handler within this bus domain that will be called only once. (with timeout)
   * @param event
   * @param timeout
   * @returns
   */
  async onceWithTimeout<K extends keyof TEvents & string>(event: K, timeout: number = 20000) {
    return this.#bus.onceWithTimeout(this.key(event), timeout);
  }

  /**
   * Register a cancellable event listener within this bus domain.
   * @param event The event name.
   * @param signal The abort signal.
   * @param handler The event handler.
   */
  onCancellable<K extends keyof TEvents & string>(event: K, signal: AbortSignal, handler: (...args: TEvents[K]) => void) {
    this.#bus.onCancellable(this.key(event), signal, handler, this.name, event);
  }

  /**
   * Register a cancellable event handler within this bus domain that will be called only once.
   * @param event
   * @param signal
   * @param handler
   * @returns
   */
  onceCancellable<K extends keyof TEvents & string>(event: K, signal: AbortSignal, handler: (...args: TEvents[K]) => void) {
    this.#bus.onceCancellable(this.key(event), signal, handler);
    return Promise.resolve();
  }

  /**
   * Get the symbol from event name.
   * @param event The event name.
   * @returns The event key.
   */
  key(event: string) {
    if (!this.events[event]) {
      const fullName = `${this.name}.${event}`;
      const sym = Symbol(fullName);
      this.events[event] = this.#bus.registerEvent(sym, fullName);
    }
    return this.events[event] as symbol;
  }
}

Object.freeze(EventDomain.prototype);

export { EventBus, EventDomain };
