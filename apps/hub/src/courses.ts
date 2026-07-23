import type { ComponentType } from 'react'

import type { CourseConfig } from '@courses/platform'

// Лёгкие метаданные: сырой текст courseConfig (без импорта тяжёлых упражнений).
const rawConfigs = import.meta.glob('../../*/src/courseConfig.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Ленивые лоадеры полных конфигов — грузятся только для выбранного курса.
const configLoaders = import.meta.glob('../../*/src/courseConfig.ts') as Record<
  string,
  () => Promise<{ courseConfig: CourseConfig }>
>

// Абсолютный путь к каталогу apps/ (подставляется Vite через define).
declare const __APPS_DIR__: string

export interface CourseMeta {
  dir: string
  courseId: string
  title: string
  levels: number
  tasks: number
  quizzes: number
}

// Лёгкий подсчёт содержимого курсов по наличию файлов (только имена, без импорта).
// Уровни — по README.md уровня, квизы — по quiz.json, задания — по мастер-шаблонам
// starters/**/Task*.tsx. Ключи вида ../../<course>/... → первый сегмент = каталог курса.
const levelFiles = import.meta.glob('../../*/src/exercises/*/README.md')
const quizFiles = import.meta.glob('../../*/src/exercises/*/quiz.json')
// query: '?raw' — заготовки-starters намеренно синтаксически неполные (TODO-плейсхолдеры)
// и ломают dep-scan Vite, если их парсить как TSX. Нам нужны только имена файлов для
// подсчёта заданий (countByCourse читает лишь ключи), поэтому берём их как raw-строки.
const taskFiles = import.meta.glob('../../*/starters/*/Task*.tsx', { query: '?raw', import: 'default' })

function countByCourse(glob: Record<string, unknown>): Record<string, number> {
  const acc: Record<string, number> = {}
  for (const key of Object.keys(glob)) {
    const m = key.match(/\.\.\/\.\.\/([^/]+)\//)
    if (m) acc[m[1]] = (acc[m[1]] || 0) + 1
  }
  return acc
}

const levelsByCourse = countByCourse(levelFiles)
const quizzesByCourse = countByCourse(quizFiles)
const tasksByCourse = countByCourse(taskFiles)

function dirFromKey(key: string): string {
  const m = key.match(/\.\.\/\.\.\/([^/]+)\/src\/courseConfig\.ts$/)
  return m ? m[1] : key
}

function readField(src: string, name: string): string {
  const m = src.match(new RegExp(`${name}\\s*:\\s*['"]([^'"]+)['"]`))
  return m ? m[1] : ''
}

export const courses: CourseMeta[] = Object.entries(rawConfigs)
  .map(([key, src]) => {
    const dir = dirFromKey(key)
    return {
      dir,
      courseId: readField(src, 'courseId') || dir,
      title: readField(src, 'title') || dir,
      levels: levelsByCourse[dir] || 0,
      tasks: tasksByCourse[dir] || 0,
      quizzes: quizzesByCourse[dir] || 0,
    }
  })
  .sort((a, b) => a.title.localeCompare(b.title, 'ru'))

export interface CourseProgress {
  /** Процент выполнения 0–100 (задания + квизы). */
  pct: number
  done: number
  total: number
}

function readStore(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Прогресс заданий хранится как { [levelId]: { [taskId]: boolean } },
// прогресс квизов — как { [levelId]: boolean }. Считаем выполненные пункты.
function countTaskDone(store: unknown): number {
  if (!store || typeof store !== 'object') return 0
  let n = 0
  for (const level of Object.values(store as Record<string, unknown>)) {
    if (level && typeof level === 'object') {
      n += Object.values(level as Record<string, unknown>).filter(Boolean).length
    }
  }
  return n
}

function countQuizDone(store: unknown): number {
  if (!store || typeof store !== 'object') return 0
  return Object.values(store as Record<string, unknown>).filter(Boolean).length
}

/**
 * Прогресс прохождения курса из localStorage (задания + квизы объединены, чтобы
 * показатель был осмысленным и для quiz-only курсов). Ключи совпадают с теми, что
 * пишет ProgressProvider платформы: `${courseId}-progress` и `${courseId}-progress-quiz`.
 */
export function courseProgress(m: CourseMeta): CourseProgress {
  const total = m.tasks + m.quizzes
  if (total === 0) return { pct: 0, done: 0, total: 0 }
  const taskDone = countTaskDone(readStore(`${m.courseId}-progress`))
  const quizDone = countQuizDone(readStore(`${m.courseId}-progress-quiz`))
  const done = Math.min(taskDone + quizDone, total)
  return { pct: Math.round((done / total) * 100), done, total }
}

export async function loadCourseConfig(dir: string): Promise<CourseConfig> {
  const loader = configLoaders[`../../${dir}/src/courseConfig.ts`]
  if (!loader) throw new Error(`Не найден конфиг курса: ${dir}`)
  const mod = await loader()
  return mod.courseConfig
}

/**
 * Загрузчик студенческого компонента для конкретного курса — передаётся в
 * CoursePlatform как loadStudentTask (файлы лежат в apps/<dir>/exercises/...).
 * Импорт через /@fs/ + @vite-ignore: ленивый (только при открытии задания),
 * не участвует в dep-scan, а невалидные заготовки корректно уходят в TaskStub
 * через reject → catch у вызывающего.
 */
export function makeStudentLoader(dir: string) {
  return async (folder: string, fileName: string): Promise<ComponentType | null> => {
    const url = `/@fs/${__APPS_DIR__}/${dir}/exercises/${folder}/${fileName}.tsx`
    const mod = (await import(/* @vite-ignore */ url)) as Record<string, unknown>
    return (mod[fileName] as ComponentType) || (mod.default as ComponentType) || null
  }
}
