import { serve } from '@hono/node-server'
import { app } from './app.ts'

const port = Number(process.env.PORT ?? 3000)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

serve({ fetch: app.fetch, port }, ({ port }) => {
  console.log(`PocketScope API listening on port ${port}`)
})
