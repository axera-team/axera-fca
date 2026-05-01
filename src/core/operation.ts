"use strict";

class Operation {
  #id: string;
  #cancelled: boolean;
  #finished: boolean;
  #reason: Error | null;
  #timer: NodeJS.Timeout | null;

  /**
   * Create a new Operation instance.
   * @param options - Operation options.
   */
  constructor({ timeout } = { timeout: 20000 }) {
    this.#id = Math.random().toString(36).slice(2);
    this.#cancelled = false;
    this.#finished = false;

    if (timeout) {
      this.#timer = setTimeout(() => {
        this.cancel(new Error("Operation timed out"));
      }, timeout);
    }
  }

  get status() {
     return Object.freeze({
      id: this.#id,
      cancelled: this.#cancelled,
      finished: this.#finished,
      reason: this.#reason || null,
    })
  }
  
  getStatus() {
    return Object.freeze({
      id: this.#id,
      cancelled: this.#cancelled,
      finished: this.#finished,
      reason: this.#reason || null,
    });
  }

  cancel(reason = new Error("Operation cancelled")) {
    if (this.#finished || this.#cancelled) return;
    
    this.#cancelled = true;
    this.#reason = reason;
    
    if (this.#timer) clearTimeout(this.#timer);
  }

  finish() {
    if (this.#finished || this.#cancelled) return;

    this.#finished = true;

    if (this.#timer) clearTimeout(this.#timer);
  }
}
  
export default Operation;