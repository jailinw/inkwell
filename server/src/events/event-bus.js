// server/src/events/event-bus.js
//
// A minimal, in-process Observer/Pub-Sub implementation.
// This is NOT a message broker or distributed event bus.

const listeners = {};

export const EventBus = {
  on(eventName, handler) {
    (listeners[eventName] ??= []).push(handler);
  },

  emit(eventName, payload) {
    (listeners[eventName] ?? []).forEach((handler) =>
      handler(payload)
    );
  }
};