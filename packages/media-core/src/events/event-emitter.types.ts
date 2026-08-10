import { type MediaError } from '../errors/base-error';
import { type PhotoId, type VideoId } from '../types/branded.types';

/**
 * Discriminated union of all SDK events.
 *
 * Each event has a unique `type` discriminant, enabling exhaustive
 * pattern matching in event handlers. Events are readonly to prevent
 * mutation by subscribers.
 */
export type MediaEvent =
  | SearchEvent
  | ViewEvent
  | DownloadEvent
  | ErrorEvent
  | CacheHitEvent
  | CacheMissEvent;

export interface SearchEvent {
  readonly type: 'search';
  readonly query: string;
  readonly mediaType: 'photo' | 'video';
  readonly timestamp: number;
}

export interface ViewEvent {
  readonly type: 'view';
  readonly id: PhotoId | VideoId;
  readonly mediaType: 'photo' | 'video';
  readonly timestamp: number;
}

export interface DownloadEvent {
  readonly type: 'download';
  readonly url: string;
  readonly timestamp: number;
}

export interface ErrorEvent {
  readonly type: 'error';
  readonly error: MediaError;
  readonly timestamp: number;
}

export interface CacheHitEvent {
  readonly type: 'cache-hit';
  readonly key: string;
  readonly timestamp: number;
}

export interface CacheMissEvent {
  readonly type: 'cache-miss';
  readonly key: string;
  readonly timestamp: number;
}

/** Union of all event type strings */
export type MediaEventType = MediaEvent['type'];

/**
 * Extracts the event shape for a given event type string.
 * Enables type-safe handler signatures.
 *
 * @example
 * type SearchHandler = EventHandler<'search'>; // (event: SearchEvent) => void
 */
export type MediaEventPayload<T extends MediaEventType> = Extract<MediaEvent, { readonly type: T }>;

/** Type-safe event handler for a specific event type */
export type EventHandler<T extends MediaEventType> = (event: MediaEventPayload<T>) => void;

/** Unsubscribe function returned by subscribe() */
export type Unsubscribe = () => void;

/** Subscriber interface for custom event consumers */
export interface EventSubscriber {
  readonly onEvent: (event: MediaEvent) => void;
}
