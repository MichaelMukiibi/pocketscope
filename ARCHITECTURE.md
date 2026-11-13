# Architecture

Vite builds a React single-page app. Tailwind CSS defines the layout and color tokens. Cloudflare Workers serves the built assets from `dist/` using `wrangler.jsonc`.

The browser receives an image from the device's camera picker or file picker. The preview uses a temporary object URL. Saving writes the file and its capture timestamp to IndexedDB. TanStack Query reads the local capture list and invalidates it after a save or deletion. These operations run regardless of the browser's network status.

The open app can save and retrieve captures offline. Reloading the app offline is outside the current scope because the app has no service worker. There is no backend for case sync or specialist review.
