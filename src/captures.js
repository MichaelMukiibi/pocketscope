export async function withCaptures(mode, action) {
  const database = await new Promise((resolve, reject) => {
    const request = indexedDB.open('pocketscope', 1)
    request.onupgradeneeded = () =>
      request.result.createObjectStore('captures', { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction('captures', mode)
      const request = action(transaction.objectStore('captures'))
      transaction.oncomplete = () => resolve(request.result)
      transaction.onabort = () => reject(transaction.error)
    })
  } finally {
    database.close()
  }
}
