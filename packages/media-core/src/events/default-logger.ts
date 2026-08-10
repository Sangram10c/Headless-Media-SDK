import { type EventSubscriber, type MediaEvent } from './event-emitter.types';

/**
 * Default event logger that logs SDK events to the console.
 *
 * Provided as a convenience for development/debugging.
 * Consumers can replace this with their own EventSubscriber
 * (e.g., analytics, telemetry) via the config.
 */
export const defaultLogger: EventSubscriber = {
  onEvent(event: MediaEvent): void {
    const timestamp = new Date(event.timestamp).toISOString();
    const prefix = `[MediaSDK ${timestamp}]`;

    switch (event.type) {
      case 'search':
        console.warn(`${prefix} 🔍 Search: "${event.query}" (${event.mediaType})`);
        break;
      case 'view':
        console.warn(`${prefix} 👁 View: ${event.mediaType} #${String(event.id)}`);
        break;
      case 'download':
        console.warn(`${prefix} ⬇ Download: ${event.url}`);
        break;
      case 'error':
        console.error(`${prefix} ❌ Error:`, event.error.toJSON());
        break;
      case 'cache-hit':
        console.warn(`${prefix} ✅ Cache hit: ${event.key}`);
        break;
      case 'cache-miss':
        console.warn(`${prefix} ❎ Cache miss: ${event.key}`);
        break;
    }
  },
};
