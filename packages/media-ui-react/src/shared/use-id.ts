import { useId as reactUseId } from 'react';

/**
 * Generates a stable unique ID for ARIA attributes.
 *
 * Wraps React's built-in useId() with a prefix for our components.
 * This ensures IDs are unique across the page and stable across re-renders.
 */
export function useStableId(prefix: string): string {
  const id = reactUseId();
  return `hm-${prefix}-${id}`;
}
