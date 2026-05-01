class MessageQueue {
  #messages = new Map();
  constructor() {
  }

  registerMessage(id, message) {
    this.#messages.set(id, message);
  }

  getMessage(id) {
    return this.#messages.get(id);
  }
}

module.exports = MessageQueue;