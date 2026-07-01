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
}

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
    }
  })
  .sort((a, b) => a.title.localeCompare(b.title, 'ru'))

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
