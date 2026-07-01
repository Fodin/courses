import { createContext, useContext, type ComponentType, type ReactNode } from 'react'

/**
 * Опции интеграции платформы, задаваемые хостом (например, хабом выбора курсов).
 * Все поля опциональны — при standalone-запуске курса контекст не предоставляется
 * и потребители используют поведение по умолчанию.
 */
export interface PlatformOptions {
  /**
   * Кастомный загрузчик студенческого компонента. Если задан, используется вместо
   * дефолтного `import('/exercises/...')`. Нужен, когда курс запускается не из
   * своего Vite-root (единый хаб), где абсолютный путь `/exercises/...` не резолвится.
   */
  loadStudentTask?: (folder: string, fileName: string) => Promise<ComponentType | null>
  /**
   * Колбэк выхода из курса (возврат к списку курсов). Если задан — в шапке сайдбара
   * появляется кнопка возврата.
   */
  onExit?: () => void
  /**
   * Базовый URL для статичных файлов упражнений (README, task-*.md, quiz.json).
   * По умолчанию '' → пути вида `/src/exercises/...` (standalone-курс отдаёт их
   * своим Vite-сервером). Хаб задаёт базу, указывающую на каталог конкретного
   * курса (напр. `/course-files/rhf-course`), т.к. `/src/...` в едином root указывал
   * бы на сам хаб.
   */
  exercisesBaseUrl?: string
}

const PlatformOptionsContext = createContext<PlatformOptions>({})

export function PlatformOptionsProvider({
  options,
  children,
}: {
  options: PlatformOptions
  children: ReactNode
}) {
  return <PlatformOptionsContext.Provider value={options}>{children}</PlatformOptionsContext.Provider>
}

export function usePlatformOptions(): PlatformOptions {
  return useContext(PlatformOptionsContext)
}
