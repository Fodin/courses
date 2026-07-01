import fs from 'fs'
import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

import { courseScaffoldPlugin, courseResetPlugin } from '../../packages/course-platform/vite-plugins'

const appsDir = path.resolve(__dirname, '..') // apps/
const repoRoot = path.resolve(__dirname, '../..') // корень монорепо

const CONTENT_TYPES: Record<string, string> = {
  '.md': 'text/markdown; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
}

/**
 * Dev-middleware: отдаёт статичные файлы упражнений (README/task-*.md, quiz.json)
 * из каталога любого курса по префиксу /course-files/<dir>/...
 * Нужен, потому что в едином хабе путь `/src/exercises/...` указывал бы на сам хаб,
 * а не на каталог курса. Отдаёт RAW-содержимое (без Vite-трансформации JSON).
 */
function courseFilesPlugin(): Plugin {
  return {
    name: 'course-files',
    configureServer(server) {
      server.middlewares.use('/course-files', (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()

        const rel = decodeURIComponent((req.url || '').split('?')[0]).replace(/^\/+/, '')
        const filePath = path.join(appsDir, rel)

        // Защита от path traversal — только внутри apps/
        if (filePath !== appsDir && !filePath.startsWith(appsDir + path.sep)) {
          res.statusCode = 403
          return res.end()
        }

        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.statusCode = 404
            return res.end()
          }
          res.setHeader('Content-Type', CONTENT_TYPES[path.extname(filePath)] || 'application/octet-stream')
          res.statusCode = 200
          if (req.method === 'HEAD') return res.end()
          res.end(data)
        })
      })
    },
  }
}

/**
 * Резолвер алиасов `src/...` и `exercises/...` по каталогу курса-импортёра.
 * В отдельном курсе эти алиасы задаёт его vite.config; в едином хабе они не
 * определены, поэтому файлы курса (особенно студенческие Task*.tsx, отдаваемые
 * через /@fs/) не могли бы их резолвить. Плагин определяет курс по пути импортёра
 * (apps/<dir>/...) и мапит алиас в apps/<dir>/src|exercises/...
 */
function courseAliasPlugin(): Plugin {
  const marker = appsDir + path.sep
  return {
    name: 'course-alias-resolver',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!importer || !/^(src|exercises)\//.test(source)) return null

      let imp = importer.split('?')[0]
      if (imp.startsWith('/@fs/')) imp = imp.slice('/@fs'.length)

      const at = imp.indexOf(marker)
      if (at === -1) return null

      const courseDir = imp.slice(at + marker.length).split(path.sep)[0]
      if (!courseDir || courseDir === 'hub') return null

      const target = path.join(appsDir, courseDir, source)
      return this.resolve(target, importer, { skipSelf: true })
    },
  }
}

export default defineConfig({
  plugins: [react(), courseAliasPlugin(), courseFilesPlugin(), courseScaffoldPlugin(), courseResetPlugin()],
  // Абсолютный путь к apps/ — нужен для рантайм-импорта студенческих файлов
  // через /@fs/ (их нельзя брать через import.meta.glob: заготовки могут быть
  // синтаксически неполными и ломают dep-scan).
  define: {
    __APPS_DIR__: JSON.stringify(appsDir),
  },
  resolve: {
    // Единый инстанс React для всех курсов (их файлы отдаются через /@fs/ вне root),
    // иначе — "Cannot access 'React' before initialization" из-за дублей.
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  optimizeDeps: {
    // Тяжёлые библиотеки курсов импортируются из Task*.tsx, которые отдаются
    // через /@fs/ вне root хаба и потому не попадают в стартовый dep-scan Vite.
    // Без пре-бандла Vite обнаруживает их на лету при первом открытии курса,
    // запускает переоптимизацию и полную перезагрузку — из-за чего in-flight
    // динамический импорт конфига падает с "Failed to fetch dynamically imported
    // module" (курсы rhf/mobx/yup/functional-js не открывались). Явно включаем их
    // в пре-бандл, чтобы они были готовы к моменту открытия курса.
    include: [
      'react-hook-form',
      '@hookform/resolvers/zod',
      '@hookform/resolvers/yup',
      'zod',
      'yup',
      'mobx',
      'mobx-react-lite',
      'immer',
      'effect',
      'fp-ts/function',
      'fp-ts/Option',
      'fp-ts/Either',
      'fp-ts/Array',
      'fp-ts/TaskEither',
      'fp-ts/string',
      'fp-ts/number',
    ],
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      // Разрешаем импортировать sibling-приложения (apps/*) из единого root
      allow: [repoRoot],
    },
  },
})
