# Frequently Asked Questions (FAQ)

Here are answers to common questions regarding the Headless Media SDK ecosystem.

---

### Q1: Where do I get a Pexels API Key?
You can generate a free Pexels API Key in 30 seconds by creating an account on [pexels.com/api](https://www.pexels.com/api/).

---

### Q2: Why does `createApiKey('')` throw an error when passed an empty string?
`@headless-media/core` enforces nominal type safety through branded types (`ApiKey`). Passing an empty string or nullish value causes `createApiKey` to throw a `ValidationError` to prevent sending invalid HTTP requests to Pexels endpoints.

---

### Q3: How does the SDK handle Pexels rate limits (HTTP 429)?
The SDK includes `withRetry` middleware configured with exponential backoff and randomized full jitter. When Pexels responds with `429 Too Many Requests` or `5xx Server Error`, the SDK automatically retries the request up to 3 times with exponentially growing delays.

---

### Q4: Can I use `@headless-media/core` on Node.js / Server-Side (Next.js Server Components)?
Yes! `@headless-media/core` is built with standard Fetch API standards and zero DOM dependencies. You can initialize `MediaClient` in server components, API routes, or CLI scripts.

---

### Q5: How do I clear cached images when a user logs out or rotates API keys?
Call `client.clearCache()`. This wipes the LRU `MemoryCache` and resets the request `Deduplicator`.

---

### Q6: Does `@headless-media/ui-react` impose any CSS styling?
No. `@headless-media/ui-react` and `@headless-media/ui-native` are **100% headless**. They supply accessibility attributes, keyboard handlers, and layout prop getters. You have full freedom to style your UI with CSS Modules, Vanilla CSS, Tailwind, or Styled Components.
