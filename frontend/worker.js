export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request)
    }

    const origin = request.headers.get('Origin')
    if (origin && origin !== url.origin) {
      return Response.json({ error: 'Origin not allowed' }, { status: 403 })
    }

    url.pathname = url.pathname.slice(4)
    const forwarded = new Request(url, request)
    forwarded.headers.delete('Origin')
    try {
      return await env.BACKEND.fetch(forwarded)
    } catch {
      return Response.json(
        { error: 'Screening API unavailable' },
        { status: 503 },
      )
    }
  },
}
