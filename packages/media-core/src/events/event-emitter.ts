import {
  type EventHandler,
  type MediaEvent,
  type MediaEventType,
  type Unsubscribe,
} from './event-emitter.types';

// Internal type: we store handlers as generic functions keyed by event type.
// Type safety is guaranteed at the public API boundary (subscribe/unsubscribe
// use generics), so the internal store uses a broader function type.
type AnyHandler = (event: MediaEvent) => void;

/**
 * Observer-pattern event emitter for the media SDK.
 *
 * Design decisions:
 * - Uses a Map<string, Set<Function>> for O(1) subscribe/unsubscribe.
 * - Handlers are invoked synchronously to maintain event ordering guarantees.
 * - Errors in handlers are caught and logged to prevent one bad handler
 *   from blocking others.
 * - No wildcard support by design — subscribers must be explicit about
 *   which events they care about (enforced by TypeScript).
 */
export class MediaEventEmitter {
  private readonly listeners = new Map<MediaEventType, Set<AnyHandler>>();
  private destroyed = false;

  /**
   * Subscribe to a specific event type.
   * Returns an unsubscribe function for cleanup.
   */
  subscribe<T extends MediaEventType>(type: T, handler: EventHandler<T>): Unsubscribe {
    this.assertNotDestroyed();

    let handlers = this.listeners.get(type);
    if (!handlers) {
      handlers = new Set();
      this.listeners.set(type, handlers);
    }

    // Safe cast: handlers are partitioned by type key, so at emit time
    // only handlers registered for that type will be called with the correct payload.
    handlers.add(handler as AnyHandler);

    return () => {
      this.unsubscribe(type, handler);
    };
  }

  /**
   * Unsubscribe a specific handler from an event type.
   */
  unsubscribe<T extends MediaEventType>(type: T, handler: EventHandler<T>): void {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.delete(handler as AnyHandler);
      if (handlers.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  /**
   * Emit an event to all subscribers of its type.
   * Handlers are invoked synchronously in insertion order.
   * Errors in handlers are caught and logged.
   */
  emit(event: MediaEvent): void {
    if (this.destroyed) return;

    const handlers = this.listeners.get(event.type);
    if (!handlers || handlers.size === 0) return;

    for (const handler of handlers) {
      try {
        handler(event);
      } catch (error) {
        console.error(
          `[MediaSDK] Error in event handler for "${event.type}":`,
          error,
        );
      }
    }
  }

  /**
   * Returns the count of listeners for a specific event type.
   * Useful for debugging and testing.
   */
  listenerCount(type: MediaEventType): number {
    return this.listeners.get(type)?.size ?? 0;
  }

  /**
   * Removes all listeners and prevents further subscriptions.
   */
  destroy(): void {
    this.listeners.clear();
    this.destroyed = true;
  }

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new Error('[MediaSDK] Cannot subscribe to a destroyed event emitter.');
    }
  }
}
