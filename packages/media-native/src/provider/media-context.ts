import { createContext } from 'react';
import { type MediaClient } from '@headless-media/core';

export const MediaContext = createContext<MediaClient | null>(null);
MediaContext.displayName = 'MediaContext';
