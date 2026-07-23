/**
 * Типы движка многофайловых FSD-заданий.
 *
 * Автор задания описывает его одним объектом `LabSpec`: виртуальное дерево
 * файлов + список проверок. Проверки — чистые функции над снимком файлов
 * (`VirtualFs`), код студента НЕ исполняется: анализ статический (структура
 * путей + граф импортов), что для FSD методологически верно.
 */

/** Слои FSD сверху вниз. Индекс массива = ранг слоя (меньше = выше). */
export const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] as const
export type FsdLayer = (typeof FSD_LAYERS)[number]

/** Язык файла — для подсветки в редакторе. */
export type FileLanguage = 'ts' | 'tsx' | 'css' | 'json' | 'md'

/**
 * Роль файла в песочнице:
 * - editable  — студент правит (по умолчанию);
 * - readonly  — виден, но не редактируется (контекст/каркас);
 * - hidden    — участвует в проверках, но в дереве не показывается.
 */
export type FileRole = 'editable' | 'readonly' | 'hidden'

export interface VirtualFile {
  /** Путь от корня песочницы, напр. 'src/entities/user/model/types.ts'. */
  path: string
  /** Начальное содержимое файла. */
  content: string
  role?: FileRole
  language?: FileLanguage
}

/** Результат одной проверки. */
export interface CheckResult {
  passed: boolean
  /** Человекочитаемое описание проверки (RU). */
  message: string
  /** Подсказка, показывается при провале. */
  hint?: string
}

/** Проверка — чистая функция над снимком песочницы. */
export type Check = (fs: VirtualFs) => CheckResult

/** Один распарсенный импорт файла. */
export interface ImportEdge {
  /** Сырой specifier из `import ... from '...'`. */
  source: string
  /** Разрешённый путь внутри песочницы (если относительный/алиасный), иначе null. */
  resolved: string | null
  /** Именованные импорты `{ A, B as C }` — исходные имена (A, B). */
  named: string[]
  /** Импорт только типов (`import type` или `import { type X }`). */
  isTypeOnly: boolean
}

/** Снимок песочницы, передаётся в каждую проверку. */
export interface VirtualFs {
  /** path -> текущее содержимое (только видимые + hidden файлы). */
  files: Record<string, string>
  read(path: string): string | undefined
  exists(path: string): boolean
  /** Пути, начинающиеся с префикса (или все, если prefix не задан). */
  list(prefix?: string): string[]
  /** Распарсенные импорты файла (с кэшем). */
  imports(path: string): ImportEdge[]
  /** Разрешить specifier относительно fromPath в путь песочницы (или null). */
  resolve(fromPath: string, specifier: string): string | null
  /** Слой файла по его пути, либо null (файл вне src/<layer>). */
  layerOf(path: string): FsdLayer | null
  /** Слайс файла по пути (`src/<layer>/<slice>/...`), либо null. */
  sliceOf(path: string): string | null
}

/** Полное описание одного задания. */
export interface LabSpec {
  /** Идентификатор задачи платформы, напр. '9.1'. */
  id: string
  title: string
  /** Стартовое дерево файлов. */
  files: VirtualFile[]
  /** Эталонное дерево — для кнопки «Показать эталон». */
  solution: VirtualFile[]
  /** Проверки — автор их только композирует из библиотеки. */
  checks: Check[]
  /** Карта алиасов резолвинга, напр. { '@': 'src' } для '@/entities/...'. */
  aliases?: Record<string, string>
}
