/**
 * AbortController management utilities.
 *
 * Provides a registry for tracking multiple AbortControllers
 * so they can all be aborted on SDK destroy().
 */

/**
 * Creates a linked AbortController that aborts when either
 * the parent signal or its own signal fires.
 *
 * This allows per-request controllers to be cancelled both
 * individually and via a global "destroy all" signal.
 */
export function createLinkedController(parentSignal?: AbortSignal): AbortController {
  const controller = new AbortController();

  if (parentSignal) {
    if (parentSignal.aborted) {
      controller.abort(parentSignal.reason);
      return controller;
    }

    const onAbort = () => {
      controller.abort(parentSignal.reason);
    };

    parentSignal.addEventListener('abort', onAbort, { once: true });

    // Clean up parent listener when child aborts independently
    controller.signal.addEventListener(
      'abort',
      () => {
        parentSignal.removeEventListener('abort', onAbort);
      },
      { once: true },
    );
  }

  return controller;
}

/**
 * Serializes request parameters into a stable cache key.
 * Sorts object keys to ensure deterministic output.
 */
export function createCacheKey(endpoint: string, params?: Record<string, unknown>): string {
  if (!params) return endpoint;

  const sortedParams = Object.keys(params)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});

  return `${endpoint}:${JSON.stringify(sortedParams)}`;
}
