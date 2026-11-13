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

`GET /health` checks that the HTTP process can respond. The API does not yet accept exam images. The planned screening flow calls the separate FastAPI inference service, passes findings to Gemma, renders a PDF report, and stores it in a database.
