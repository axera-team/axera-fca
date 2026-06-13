import { randomUUID } from "node:crypto";

export class GlobalStore  {
    readonly name: string;
    readonly storeID: string = randomUUID();

    #store: Map<string, any>;

    constructor(name: string) {
      this.name = name;
      this.#store = new Map();
    }

    set(key: string, value: any) {
      this.#store.set(key, value);
    }

    get(key: string): any {
      return this.#store.get(key);
    }

    has(key: string): boolean {
      return this.#store.has(key);
    }

    delete(key: string): boolean {
      return this.#store.delete(key);
    }

    info() {
      return Object.freeze({
        name: this.name,
        storeID: this.storeID,
        size: this.#store.size
      });
    }
}

export const store = new GlobalStore('FCA_GLOBAL_STORE');