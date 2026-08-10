import {
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ButtonHTMLAttributes,
  type Ref,
} from 'react';

/** HTML attributes including optional ref prop and data attributes */
export type ElementProps<
  E extends HTMLElement = HTMLDivElement,
  P extends HTMLAttributes<E> = HTMLAttributes<E>,
> = P & { readonly ref?: Ref<E> } & Record<string, unknown>;

/**
 * Generic prop getter type.
 */
export type PropGetter<
  E extends HTMLElement = HTMLDivElement,
  P extends HTMLAttributes<E> = HTMLAttributes<E>,
> = <TargetE extends E = E>(overrides?: ElementProps<TargetE, P>) => ElementProps<TargetE, P>;

/** Prop getter for img elements */
export type ImgPropGetter = <TargetE extends HTMLImageElement = HTMLImageElement>(
  overrides?: ElementProps<TargetE, ImgHTMLAttributes<TargetE>>,
) => ElementProps<TargetE, ImgHTMLAttributes<TargetE>>;

/** Prop getter for button elements */
export type ButtonPropGetter = <TargetE extends HTMLButtonElement = HTMLButtonElement>(
  overrides?: ElementProps<TargetE, ButtonHTMLAttributes<TargetE>>,
) => ElementProps<TargetE, ButtonHTMLAttributes<TargetE>>;
