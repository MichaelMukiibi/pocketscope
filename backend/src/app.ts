import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'

export const app = new Hono()
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

    const header = Buffer.from(await image.slice(0, 8).arrayBuffer())
    const isJpeg =
      image.type === 'image/jpeg' &&
      header.subarray(0, 3).toString('hex') === 'ffd8ff'
    const isPng =
      image.type === 'image/png' &&
      header.toString('hex') === '89504e470d0a1a0a'
    if (!isJpeg && !isPng) {
      return context.json({ error: 'Upload a JPEG or PNG image' }, 415)
    }

    return context.json({ exam, inference: { status: 'stub', findings: [] } })
  },
)
