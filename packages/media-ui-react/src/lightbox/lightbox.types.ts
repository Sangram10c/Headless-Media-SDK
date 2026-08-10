import { type ImgHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { type ElementProps } from '../types/prop-getters.types';

/** A lightbox item — consumer provides these, we don't know the shape */
export interface LightboxItem {
  readonly src: string;
  readonly alt?: string;
  readonly width?: number;
  readonly height?: number;
}

export interface UseLightboxOptions {
  /** Array of items to display in the lightbox */
  readonly items: readonly LightboxItem[];
  /** Index to open on initially */
  readonly initialIndex?: number;
  /** Called when lightbox is closed */
  readonly onClose?: () => void;
  /** Called when navigating to a new item */
  readonly onNavigate?: (index: number) => void;
  /** Whether navigation wraps around. Default: true */
  readonly loop?: boolean;
}

export interface UseLightboxReturn {
  /** Whether the lightbox is currently open */
  readonly isOpen: boolean;
  /** Current item index */
  readonly currentIndex: number;
  /** Current item data (null if closed) */
  readonly currentItem: LightboxItem | null;
  /** Open the lightbox at a given index */
  readonly open: (index: number) => void;
  /** Close the lightbox */
  readonly close: () => void;
  /** Navigate to next item */
  readonly next: () => void;
  /** Navigate to previous item */
  readonly prev: () => void;
  /** Props for the backdrop/overlay element */
  readonly getBackdropProps: <E extends HTMLElement = HTMLDivElement>(
    overrides?: ElementProps<E>,
  ) => ElementProps<E>;
  /** Props for the content container */
  readonly getContentProps: <E extends HTMLElement = HTMLDivElement>(
    overrides?: ElementProps<E>,
  ) => ElementProps<E>;
  /** Props for the image element */
  readonly getImageProps: <E extends HTMLImageElement = HTMLImageElement>(
    overrides?: ElementProps<E, ImgHTMLAttributes<E>>,
  ) => ElementProps<E, ImgHTMLAttributes<E>>;
  /** Props for the close button */
  readonly getCloseButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    overrides?: ElementProps<E, ButtonHTMLAttributes<E>>,
  ) => ElementProps<E, ButtonHTMLAttributes<E>>;
  /** Props for the next button */
  readonly getNextButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    overrides?: ElementProps<E, ButtonHTMLAttributes<E>>,
  ) => ElementProps<E, ButtonHTMLAttributes<E>>;
  /** Props for the prev button */
  readonly getPrevButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    overrides?: ElementProps<E, ButtonHTMLAttributes<E>>,
  ) => ElementProps<E, ButtonHTMLAttributes<E>>;
}
