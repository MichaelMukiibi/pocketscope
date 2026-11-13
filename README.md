# PocketScope

PocketScope is a throat-image capture prototype for health workers. Use training images for the demo.

## Run locally

With Node.js 24 and pnpm 11 installed:

```sh
pnpm install
pnpm dev
```

Open the URL Vite prints for the landing page. Choose **Try the capture demo** to open the capture workflow. On a phone, use an HTTPS preview to test the rear-camera picker. Choose an image to try the workflow without a camera.

## Checks and deployment

```sh
pnpm format:check
pnpm build
pnpm --filter @pocketscope/frontend exec wrangler deploy --dry-run
```

Run `pnpm format` to apply Prettier. Run `pnpm deploy` with Cloudflare credentials to publish the frontend.

See [architecture](ARCHITECTURE.md), [features](FEATURES.md), and [design](DESIGN.md) for the current scope.

## PWA and Android packaging

Run `pnpm build` and `pnpm --filter @pocketscope/frontend exec vite preview` to test the production PWA on localhost. Visit it online first, wait for the service worker to finish installing, then go offline and reload `/` and `/capture`.

Deploy the build to Cloudflare Workers over HTTPS. Give the deployed URL to [PWABuilder](https://www.pwabuilder.com/) and select Android packaging. For a verified fullscreen Android launch, publish the generated Digital Asset Links file at `/.well-known/assetlinks.json` on the same origin using the Android package name and signing certificate fingerprint.
