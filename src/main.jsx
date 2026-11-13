import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Aperture,
  Camera,
  Check,
  FolderOpen,
  ImagePlus,
  Trash2,
} from 'lucide-react'
import { withCaptures } from './captures'
import './style.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { networkMode: 'always', retry: false },
    mutations: { networkMode: 'always' },
  },
})
const captureKey = ['captures']
const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function ImagePreview({ file, className, alt, onError }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])
  return (
    url && <img src={url} className={className} alt={alt} onError={onError} />
  )
}

function App() {
  const [photo, setPhoto] = useState(null)
  const [message, setMessage] = useState('')
  const [invalidPhoto, setInvalidPhoto] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  const client = useQueryClient()

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  const captures = useQuery({
    queryKey: captureKey,
    queryFn: async () => {
      const items = await withCaptures('readonly', (store) => store.getAll())
      return items.sort((a, b) => b.createdAt - a.createdAt)
    },
  })
  const save = useMutation({
    mutationFn: (file) =>
      withCaptures('readwrite', (store) =>
        store.add({
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          file,
        }),
      ),
    onSuccess: () => {
      setPhoto(null)
      setMessage('Capture saved on this device.')
      return client.invalidateQueries({ queryKey: captureKey })
    },
  })
  const remove = useMutation({
    mutationFn: (id) => withCaptures('readwrite', (store) => store.delete(id)),
    onSuccess: () => client.invalidateQueries({ queryKey: captureKey }),
  })

  function selectPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setMessage('')
    setInvalidPhoto(false)
    save.reset()
    if (file.type.startsWith('image/')) setPhoto(file)
    else setMessage('Choose an image file.')
  }

  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3 font-bold text-xl">
            <span className="grid size-10 place-items-center rounded-xl bg-brand text-white">
              <Aperture size={23} />
            </span>
            PocketScope
          </div>
          <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm font-medium text-muted">
            <span
              className={
                online
                  ? 'size-2 rounded-full bg-brand'
                  : 'size-2 rounded-full bg-amber-500'
              }
            />
            {online ? 'Online' : 'Offline'}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-12">
        <p className="mb-2 text-sm font-semibold text-brand">ENT / Throat</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Throat capture
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Capture a throat image, check the view, and save it on this device.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <section className="panel" aria-labelledby="capture-heading">
            <h2 id="capture-heading">New capture</h2>
            <div className="mt-4 grid min-h-60 place-items-center overflow-hidden rounded-2xl border border-line bg-view">
              {photo ? (
                <ImagePreview
                  key={photo.name + photo.lastModified}
                  file={photo}
                  className="max-h-96 w-full object-contain"
                  alt="Selected throat capture"
                  onError={() => {
                    setInvalidPhoto(true)
                    setMessage(
                      'This image could not be opened. Choose another image.',
                    )
                  }}
                />
              ) : (
                <div className="px-4 py-10 text-center">
                  <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-white text-brand">
                    <Camera size={25} />
                  </span>
                  <p className="font-semibold">No image selected</p>
                  <p className="mt-1 text-sm text-muted">
                    Take a photo or choose one from this device.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <label className="button secondary">
                <Camera size={18} /> {photo ? 'Retake photo' : 'Take photo'}
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={selectPhoto}
                  disabled={save.isPending}
                />
              </label>
              <label className="button secondary">
                <ImagePlus size={18} /> Choose image
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={selectPhoto}
                  disabled={save.isPending}
                />
              </label>
              {photo && (
                <button
                  className="button primary"
                  disabled={save.isPending || invalidPhoto}
                  onClick={() => save.mutate(photo)}
                >
                  <Check size={18} />{' '}
                  {save.isPending ? 'Saving...' : 'Save capture'}
                </button>
              )}
            </div>
            {message && (
              <p role="status" className="mt-3 text-sm text-muted">
                {message}
              </p>
            )}
            {save.isError && (
              <p role="alert" className="mt-3 text-sm text-red-800">
                Could not save the capture. Try again.
              </p>
            )}
          </section>
          <aside className="panel self-start">
            <h2>Check the view</h2>
            <ul className="mt-4 grid gap-4 text-sm text-muted">
              {[
                'Both tonsillar areas are visible.',
                'The uvula and soft palate are in frame.',
                'The image is well lit and in focus.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <Check size={18} className="shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
              Use training images for this prototype. Review the image manually
              before saving.
            </p>
          </aside>
        </div>
        <section className="panel mt-5" aria-labelledby="saved-heading">
          <h2 id="saved-heading">Saved captures</h2>
          {captures.isPending && (
            <p className="mt-3 text-sm text-muted">Loading captures...</p>
          )}
          {captures.isError && (
            <p role="alert" className="mt-3 text-sm text-red-800">
              Could not open local storage.
            </p>
          )}
          {remove.isError && (
            <p role="alert" className="mt-3 text-sm text-red-800">
              Could not delete the capture.
            </p>
          )}
          {captures.data?.length === 0 && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <FolderOpen size={18} /> Saved captures will appear here.
            </p>
          )}
          {captures.data?.length > 0 && (
            <ul className="mt-3 divide-y divide-line">
              {captures.data.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <ImagePreview
                    file={item.file}
                    className="size-12 rounded-lg bg-view object-cover"
                    alt="Saved throat capture"
                  />
                  <time
                    className="flex-1 text-sm"
                    dateTime={new Date(item.createdAt).toISOString()}
                  >
                    {dateFormat.format(item.createdAt)}
                  </time>
                  <button
                    className="button secondary"
                    aria-label={`Delete capture from ${dateFormat.format(item.createdAt)}`}
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(item.id)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
