import { describe, it, expect, vi } from 'vitest';
import { MediaEventEmitter } from '../src/events/event-emitter';
import { type SearchEvent } from '../src/events/event-emitter.types';

describe('MediaEventEmitter', () => {
  it('subscribes and receives typed events', () => {
    const emitter = new MediaEventEmitter();
    const handler = vi.fn();

    const unsubscribe = emitter.subscribe('search', handler);
    expect(emitter.listenerCount('search')).toBe(1);

    const event: SearchEvent = {
      type: 'search',
      query: 'nature',
      mediaType: 'photo',
      timestamp: Date.now(),
    };

    emitter.emit(event);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);

    unsubscribe();
    expect(emitter.listenerCount('search')).toBe(0);
  });

  it('isolates errors in handlers so other subscribers still receive events', () => {
    const emitter = new MediaEventEmitter();
    const badHandler = vi.fn().mockImplementation(() => {
      throw new Error('Handler crash');
    });
    const goodHandler = vi.fn();

    emitter.subscribe('search', badHandler);
    emitter.subscribe('search', goodHandler);

    const event: SearchEvent = {
      type: 'search',
      query: 'mountains',
      mediaType: 'photo',
      timestamp: Date.now(),
    };

    expect(() => emitter.emit(event)).not.toThrow();
    expect(goodHandler).toHaveBeenCalledTimes(1);
  });

  it('prevents subscription after destroy()', () => {
    const emitter = new MediaEventEmitter();
    emitter.destroy();

    expect(() => emitter.subscribe('search', () => {})).toThrow(
      /Cannot subscribe to a destroyed event emitter/,
    );
  });
});
