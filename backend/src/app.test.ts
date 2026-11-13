import assert from 'node:assert/strict'
import { test } from 'node:test'
import { app } from './app.ts'

test('GET /health reports that the API is running', async () => {
  const response = await app.request('/health')
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'ok' })
})
