import assert from 'node:assert/strict'
import { test } from 'node:test'
import { app } from './app.ts'

test('GET /health reports that the API is running', async () => {
  const response = await app.request('/health')
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'ok' })
})

function upload(exam: string, bytes: Uint8Array<ArrayBuffer>) {
  const body = new FormData()
  body.append('exam', exam)
  body.append('image', new Blob([bytes], { type: 'image/png' }), 'training.png')
  return app.request('/screenings', { method: 'POST', body })
}

const pngHeader = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])

test('POST /screenings returns an explicitly stubbed result', async () => {
  const response = await upload('throat', pngHeader)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    exam: 'throat',
    inference: { status: 'stub', findings: [] },
  })
})

test('POST /screenings rejects unsupported exams, spoofed images and oversized files', async () => {
  assert.equal((await upload('ear', pngHeader)).status, 400)
  assert.equal((await upload('nose', Uint8Array.of(1, 2, 3))).status, 415)
  assert.equal(
    (await upload('nose', new Uint8Array(5 * 1024 * 1024 + 1))).status,
    413,
  )
})
