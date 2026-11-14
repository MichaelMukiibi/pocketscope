# Backend

PocketScope's API uses Hono and TypeScript on Node.js 24. From the repository root, run:

```sh
pnpm install
pnpm --filter @pocketscope/backend dev
curl http://localhost:3000/health
```

Set `PORT` to override the default of 3000. Use `pnpm --filter @pocketscope/backend start` to run without watch mode.

```sh
pnpm --filter @pocketscope/backend check
pnpm --filter @pocketscope/backend test
```

`GET /health` checks that the HTTP process can respond. The planned screening flow calls the separate FastAPI inference service, passes findings to Gemma, renders a PDF report, and stores it in a database.

## Screening upload

Send a multipart POST to `/screenings` with `exam` set to `nose` or `throat` and an `image` file in JPEG or PNG format up to 5 MiB. Use training images for this prototype.

```sh
curl -F exam=throat -F "image=@training.png;type=image/png" http://localhost:3000/screenings
```

The response includes the exam and `inference: { "status": "stub", "findings": [] }`. The stub does not assess the image or retain it. An empty findings array carries no clinical meaning.

## Cloudflare Worker

The screening API can run separately from the frontend as the `pscope-api` Worker. The same Hono app serves `GET /health` and `POST /screenings` in both runtimes.

From the repository root:

```sh
pnpm --filter @pocketscope/backend dev:worker
pnpm --filter @pocketscope/backend exec wrangler deploy --dry-run
pnpm --filter @pocketscope/backend deploy
```

For a separate Cloudflare Git-connected Worker, keep the build root at the repository root and set the deploy command to `cd backend && pnpm exec wrangler deploy`. Use `cd backend && pnpm exec wrangler preview` for preview builds.

Use only training images with this stub endpoint. The frontend Worker forwards same-origin requests from /api/* to pscope-api via the BACKEND service binding. Deploy pscope-api first in the same Cloudflare account.
