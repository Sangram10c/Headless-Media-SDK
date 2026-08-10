import { createContext } from 'react';
import { type MediaClient } from '@headless-media/core';

/**
 * React context for the MediaClient instance.
 *
 * Using null as default (not undefined) so that useMedia() can
 * distinguish between "no provider" and "provider exists but client
 * not yet initialized" — though in practice the provider always
 * creates the client synchronously in its render.
 */
export const MediaContext = createContext<MediaClient | null>(null);

MediaContext.displayName = 'MediaContext';
