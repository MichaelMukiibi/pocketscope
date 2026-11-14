import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'

export const app = new Hono<{
  Bindings: { INFERENCE_URL?: string; INFERENCE_TOKEN?: string }
}>()
const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10]
const maxImageBytes = 5 * 1024 * 1024

app.get('/health', (context) => context.json({ status: 'ok' }))

app.post(
  '/screenings',
  bodyLimit({
    maxSize: maxImageBytes + 64 * 1024,
    onError: (context) => context.json({ error: 'Upload too large' }, 413),
  }),
  async (context) => {
    const contentType = context.req.header('Content-Type') ?? ''
    if (!/^multipart\/form-data\s*;/i.test(contentType)) {
      return context.json({ error: 'Use multipart/form-data' }, 415)
    }

    let fields: FormData
    try {
      fields = await context.req.formData()
    } catch {
      return context.json({ error: 'Invalid multipart body' }, 400)
    }

    const images = fields.getAll('image')
    const exams = fields.getAll('exam')
    const [image] = images
    const [exam] = exams
    if (images.length !== 1 || !(image instanceof File) || !image.size) {
      return context.json({ error: 'Provide one nonempty image file' }, 400)
    }
    if (exams.length !== 1 || (exam !== 'nose' && exam !== 'throat')) {
      return context.json({ error: 'Exam must be nose or throat' }, 400)
    }
    if (image.size > maxImageBytes) {
      return context.json({ error: 'Image must be at most 5 MiB' }, 413)
    }

    const header = new Uint8Array(await image.slice(0, 8).arrayBuffer())
    const isJpeg =
      image.type === 'image/jpeg' &&
      header[0] === 255 &&
      header[1] === 216 &&
      header[2] === 255
    const isPng =
      image.type === 'image/png' &&
      header.length === 8 &&
      header.every((byte, index) => byte === pngSignature[index])
    if (!isJpeg && !isPng) {
      return context.json({ error: 'Upload a JPEG or PNG image' }, 415)
    }

    const { INFERENCE_URL, INFERENCE_TOKEN } = context.env ?? {}
    if (exam === 'throat' || !INFERENCE_URL || !INFERENCE_TOKEN) {
      return context.json({ exam, inference: { status: 'stub', findings: [] } })
    }

    try {
      const endpoint = new URL('/v1/screen', INFERENCE_URL)
      if (endpoint.protocol !== 'https:') throw new Error('HTTPS required')
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${INFERENCE_TOKEN}`,
          'Content-Type': image.type,
        },
        body: image,
        redirect: 'error',
        signal: AbortSignal.timeout(30_000),
      })
      if (response.status === 422)
        return context.json({ error: 'Invalid image' }, 422)
      if (response.status === 429)
        return context.json({ error: 'Inference busy' }, 429)
      if (!response.ok) throw new Error('Inference failed')
      const result = (await response.json()) as {
        label?: string
        scores?: Record<string, number>
        modelVersion?: string
      }
      if (
        (result.label !== 'withNP' && result.label !== 'withoutNP') ||
        !result.modelVersion ||
        !['withNP', 'withoutNP'].every((label) => {
          const score = result.scores?.[label]
          return (
            typeof score === 'number' &&
            Number.isFinite(score) &&
            score >= 0 &&
            score <= 1
          )
        })
      )
        throw new Error('Invalid inference result')
      return context.json({
        exam,
        inference: {
          status: 'prototype',
          label: result.label,
          scores: {
            withNP: result.scores?.withNP,
            withoutNP: result.scores?.withoutNP,
          },
          modelVersion: result.modelVersion,
        },
      })
    } catch {
      return context.json({ error: 'Nose inference unavailable' }, 502)
    }
  },
)

export default app
