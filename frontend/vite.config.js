import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'pocketscope-offline-shell',
      apply: 'build',
      async writeBundle({ dir }) {
        const source = await readFile(
          new URL('./service-worker.js', import.meta.url),
          'utf8',
        )
        const files = (
          await readdir(dir, { recursive: true, withFileTypes: true })
        )
          .filter((entry) => entry.isFile())
          .map((entry) =>
            join(entry.parentPath, entry.name)
              .slice(dir.length)
              .replaceAll('\\', '/'),
          )
          .filter((path) => path !== '/sw.js')
          .sort()
        const hash = createHash('sha256').update(source)
        for (const file of files) {
          hash.update(file).update(await readFile(join(dir, file)))
        }
        await writeFile(
          join(dir, 'sw.js'),
          `const CACHE_NAME = 'pocketscope-${hash.digest('hex').slice(0, 16)}'\nconst APP_FILES = ${JSON.stringify(files)}\n${source}`,
        )
      },
    },
  ],
})
