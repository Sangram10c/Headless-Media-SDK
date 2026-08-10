/**
 * Merges multiple event handler functions into a single handler.
 * All handlers are called in order. If any is undefined/null, it's skipped.
 *
 * This is the core utility behind the prop-getters pattern — it allows
 * consumers to pass their own handlers that compose with internal ones.
 *
 * @example
 * const onClick = callAll(internalOnClick, userOnClick);
 * // Both handlers fire when onClick is called
 */
export function callAll<E>(
  ...fns: Array<((event: E) => void) | undefined | null>
): (event: E) => void {
  return (event: E) => {
    for (const fn of fns) {
      fn?.(event);
    }
  };
}
