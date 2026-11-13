# Architecture

| Directory            | Role                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/`          | React and Vite landing page at `/` and throat capture demo at `/capture`. Tailwind CSS supplies styling, and Cloudflare Workers serves the build.       |
| `backend/`           | Hono and TypeScript API with liveness and training-image upload endpoints. The upload returns a stub result. Report generation and storage are planned. |
| `backend/inference/` | Planned FastAPI service packaged in Docker and deployed independently on Render.                                                                        |

The capture demo previews photos locally and stores saved files with timestamps in IndexedDB. TanStack Query updates the capture list after saves or deletions, including when the open app is offline. After the first online visit, the service worker precaches the versioned app shell so both routes can open offline. Capture data stays in IndexedDB.

The planned API sends a screening image to the inference service. A ResNet with a linear classifier returns scores for supported visible findings. The API passes the findings to Gemma to draft a report, converts the report to PDF, and stores it in a database.
