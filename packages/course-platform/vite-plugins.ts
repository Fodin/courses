import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin, ViteDevServer } from 'vite'

// Каталог этого файла → корень apps/ по умолчанию.
const HERE = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_APPS_DIR = path.resolve(HERE, '../../apps')

/** Файл-задание ученика: Task<...>.tsx (совпадает с паттерном в .gitignore). */
const isTaskFile = (file: string) => /^Task.*\.tsx$/.test(path.basename(file))

/** Рекурсивно собрать все файлы каталога (молча пропустить отсутствующий). */
function walk(dir: string, out: string[] = []): string[] {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

/** Один сегмент пути без обхода вверх/абсолютных путей — защита middleware. */
const safeSeg = (s: string) => Boolean(s) && !s.includes('..') && !s.includes('\\') && !path.isAbsolute(s)

/** Список каталогов курсов: либо один (courseDir), либо все apps/* кроме hub. */
function courseDirs(opts: ScaffoldOptions): string[] {
  if (opts.courseDir) return [opts.courseDir]
  const appsDir = opts.appsDir ?? DEFAULT_APPS_DIR
  try {
    return fs
      .readdirSync(appsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && e.name !== 'hub')
      .map((e) => path.join(appsDir, e.name))
  } catch {
    return []
  }
}

/**
 * Скопировать заготовку starters/<...>.tsx → exercises/<...>.tsx.
 * overwrite=false — только недостающие (scaffold, правки ученика сохраняются);
 * overwrite=true — принудительно (reset к шаблону).
 */
function syncCourse(courseDir: string, overwrite: boolean): number {
  const startersDir = path.join(courseDir, 'starters')
  const exercisesDir = path.join(courseDir, 'exercises')
  let count = 0
  for (const src of walk(startersDir)) {
    if (!isTaskFile(src)) continue
    const rel = path.relative(startersDir, src)
    const dest = path.join(exercisesDir, rel)
    if (!overwrite && fs.existsSync(dest)) continue
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    count++
  }
  return count
}

export interface ScaffoldOptions {
  /** Ограничить одним курсом (apps/<course>) — для standalone-запуска курса. */
  courseDir?: string
  /** Переопределить корень apps/ (по умолчанию — относительно этого файла). */
  appsDir?: string
}

/**
 * Авто-scaffold рабочих файлов ученика при запуске dev-сервера.
 *
 * Мастера заданий лежат в `apps/<course>/starters/**` (в git), а рабочие копии
 * `apps/<course>/exercises/**\/Task*.tsx` — в .gitignore и на свежем clone
 * отсутствуют. Плагин СИНХРОННО (fs.copyFileSync) в хуке configureServer, до того
 * как Vite начнёт слушать порт, создаёт недостающие рабочие копии из шаблонов.
 * Существующие файлы (в т.ч. с правками ученика) не трогаются.
 */
export function courseScaffoldPlugin(opts: ScaffoldOptions = {}): Plugin {
  return {
    name: 'course-scaffold',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      let created = 0
      for (const dir of courseDirs(opts)) created += syncCourse(dir, false)
      if (created > 0) {
        server.config.logger.info(`[course-scaffold] создано рабочих файлов ученика: ${created}`)
      }
    },
  }
}

export interface ResetOptions {
  appsDir?: string
}

/**
 * Dev-endpoint сброса рабочих файлов ученика к шаблонам (только для hub).
 *
 *   POST /__course-reset/<dir>                    → сбросить весь курс
 *   POST /__course-reset/<dir>/<folder>/<file>    → сбросить одно упражнение
 *                                                    (<file> вида Task8_1 или Task8_1.tsx)
 *
 * Ответ — JSON `{ reset: <кол-во перезаписанных файлов> }`.
 */
export function courseResetPlugin(opts: ResetOptions = {}): Plugin {
  const appsDir = opts.appsDir ?? DEFAULT_APPS_DIR
  return {
    name: 'course-reset',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/__course-reset', (req, res, next) => {
        if (req.method !== 'POST') return next()

        const rel = decodeURIComponent((req.url || '').split('?')[0]).replace(/^\/+|\/+$/g, '')
        const parts = rel.split('/').filter(Boolean)

        const fail = (code: number, error: string) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error }))
        }

        try {
          let count: number
          if (parts.length === 1) {
            const [dir] = parts
            if (!safeSeg(dir)) return fail(400, 'invalid dir')
            count = syncCourse(path.join(appsDir, dir), true)
          } else if (parts.length === 3) {
            const [dir, folder, rawFile] = parts
            const file = rawFile.replace(/\.tsx$/, '')
            if (![dir, folder, file].every(safeSeg)) return fail(400, 'invalid segment')
            const src = path.join(appsDir, dir, 'starters', folder, `${file}.tsx`)
            const dest = path.join(appsDir, dir, 'exercises', folder, `${file}.tsx`)
            const exDir = path.join(appsDir, dir, 'exercises')
            if (!dest.startsWith(exDir + path.sep)) return fail(400, 'path escape')
            if (!fs.existsSync(src)) return fail(404, `нет шаблона: ${folder}/${file}`)
            fs.mkdirSync(path.dirname(dest), { recursive: true })
            fs.copyFileSync(src, dest)
            count = 1
          } else {
            return fail(400, 'bad path')
          }
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ reset: count }))
        } catch (e) {
          fail(500, e instanceof Error ? e.message : String(e))
        }
      })
    },
  }
}
