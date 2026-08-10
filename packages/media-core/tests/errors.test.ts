import { describe, it, expect } from 'vitest';
import { calculateDelay, isRetryable, DEFAULT_RETRY_CONFIG } from '../src/retry/retry';
import {
  MediaError,
  APIError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  RateLimitError,
  CacheError,
  isMediaError,
} from '../src/errors';
import {
  createApiKey,
  createPhotoId,
  createVideoId,
  isPhotoId,
  isVideoId,
} from '../src/types/branded.types';

describe('Retry Utilities', () => {
  it('calculates exponential delay with backoff', () => {
    const config = { ...DEFAULT_RETRY_CONFIG, jitter: false };
    expect(calculateDelay(0, config)).toBe(1000);
    expect(calculateDelay(1, config)).toBe(2000);
    expect(calculateDelay(2, config)).toBe(4000);
  });

  it('correctly identifies retryable HTTP status codes', () => {
    expect(isRetryable(null)).toBe(true); // Network failure
    expect(isRetryable(500)).toBe(true);  // Internal server error
    expect(isRetryable(503)).toBe(true);  // Service unavailable
    expect(isRetryable(429)).toBe(true);  // Rate limit
    expect(isRetryable(401)).toBe(false); // Auth failure
    expect(isRetryable(404)).toBe(false); // Not found
  });
});

describe('Error Hierarchy', () => {
  it('serializes errors with code and custom fields via toJSON()', () => {
    const apiError = new APIError('Search failed', 500, '/v1/search');
    expect(apiError.code).toBe('API_ERROR');
    expect(apiError.statusCode).toBe(500);
    expect(apiError.toJSON()).toMatchObject({
      name: 'APIError',
      code: 'API_ERROR',
      message: 'Search failed',
      statusCode: 500,
      endpoint: '/v1/search',
    });

    const rateError = new RateLimitError('Limit hit', 45);
    expect(rateError.code).toBe('RATE_LIMIT_ERROR');
    expect(rateError.retryAfter).toBe(45);
  });

  it('identifies MediaError instances via isMediaError guard', () => {
    const err = new NetworkError('Offline', 'https://api.pexels.com');
    expect(isMediaError(err)).toBe(true);
    expect(isMediaError(new Error('Generic'))).toBe(false);
  });
});

describe('Branded Types & Guard Factories', () => {
  it('validates and creates branded ApiKey', () => {
    const key = createApiKey('valid_key_123');
    expect(key).toBe('valid_key_123');
    expect(() => createApiKey('')).toThrow(/non-empty string/);
  });

  it('validates photo and video IDs', () => {
    expect(isPhotoId(42)).toBe(true);
    expect(isPhotoId(-1)).toBe(false);
    expect(isVideoId(100)).toBe(true);
    expect(isVideoId(0)).toBe(false);

    expect(createPhotoId(50)).toBe(50);
    expect(() => createPhotoId(-5)).toThrow(/Invalid photo ID/);
  });
});
