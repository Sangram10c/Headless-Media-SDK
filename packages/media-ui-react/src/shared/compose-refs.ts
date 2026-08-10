import { type Ref, type MutableRefObject } from 'react';

type PossibleRef<T> = Ref<T> | undefined | null;

/**
 * Composes multiple refs into a single callback ref.
 * Useful when both the library and the consumer need a ref to the same element.
 *
 * Handles both callback refs and object refs (MutableRefObject).
 */
export function composeRefs<T>(...refs: Array<PossibleRef<T>>): (node: T | null) => void {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as MutableRefObject<T | null>).current = node;
      }
    }
  };
}
