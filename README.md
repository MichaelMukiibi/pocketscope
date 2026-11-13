# PocketScope

PocketScope is a throat-image capture prototype for health workers. Use training images for the demo.

## Run locally

With Node.js 24 and pnpm 11 installed:

```sh
pnpm install
pnpm dev
```

Open the URL Vite prints. On a phone, use an HTTPS preview to test the rear-camera picker. Choose an image to try the workflow without a camera.

## Checks and deployment

```sh
pnpm format:check
pnpm build
pnpm exec wrangler deploy --dry-run
```

Run `pnpm format` to apply Prettier. Run `pnpm deploy` with Cloudflare credentials to publish the frontend.

See [architecture](ARCHITECTURE.md) and [features](FEATURES.md) for the current scope.
