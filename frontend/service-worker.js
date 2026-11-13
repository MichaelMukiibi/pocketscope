self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) => name.startsWith('pocketscope-') && name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        ),
      ),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  const isAppNavigation =
    request.mode === 'navigate' &&
    ['/', '/capture', '/capture/'].includes(url.pathname)
  const cacheKey = isAppNavigation ? '/index.html' : url.pathname
  if (!isAppNavigation && !APP_FILES.includes(cacheKey)) return

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(cacheKey)
      return cached ?? fetch(request)
    }),
  )
})
