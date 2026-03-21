# Courses — монорепозиторий учебных курсов

Монорепозиторий на npm workspaces. Содержит общую платформу и приложения отдельных курсов.

## Структура

```
courses/
├── packages/
│   └── course-platform/     # Общая платформа (UI, роутинг, хуки, стили)
├── apps/
│   └── rhf-course/          # Курс по React Hook Form
│       ├── src/
│       │   ├── main.tsx              # Точка входа
│       │   ├── courseConfig.ts       # Конфигурация курса
│       │   ├── translations.ts      # Переводы (ru/en)
│       │   ├── hooks/index.ts       # Реэкспорт хуков платформы для студентов
│       │   └── exercises/            # Solution-файлы и конфиг упражнений
│       └── exercises/                # Рабочие файлы студентов (Task*.tsx)
└── package.json              # Корневой конфиг workspaces
```

## Требования

- Node.js >= 18
- npm >= 7 (поддержка workspaces)

## Установка

```bash
cd courses
npm install
```

Одна команда устанавливает зависимости всех пакетов и приложений.

## Запуск

### Dev-сервер курса

```bash
cd apps/rhf-course
npm run dev
```

Откроется на http://localhost:5173

### Сборка

```bash
cd apps/rhf-course
npm run build
```

Результат — в `apps/rhf-course/dist/`.

### Линтинг и форматирование

```bash
cd apps/rhf-course
npm run lint
npm run format
```

## Как пользоваться курсом (для студента)

1. Установить зависимости: `npm install` в корне
2. Запустить dev-сервер: `cd apps/rhf-course && npm run dev`
3. Открыть браузер на http://localhost:5173
4. Выбрать уровень и задание в боковой панели
5. Открыть соответствующий Task-файл в `exercises/` (например `exercises/01-basic-form/Task1_1.tsx`)
6. Написать код по инструкции — форма появится в браузере автоматически (Hot Reload)
7. Сравнить с решением через кнопку "Показать решение"

### Структура задания

Каждый уровень содержит:
- **README.md** — теория (отображается в интерфейсе)
- **task-X.Y.md** — описание задания (отображается в интерфейсе)
- **Task*.tsx** — файлы для заполнения студентом
- **Cheat.tsx** — подсказки

Студент редактирует только файлы `Task*.tsx` в папке `exercises/`.

## Как создать новый курс

1. Создать папку `apps/my-course/`

2. Создать `package.json`:
```json
{
  "name": "@courses/my-course",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build"
  },
  "dependencies": {
    "@courses/platform": "*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.13.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "typescript": "~5.6.2",
    "vite": "^8.0.1"
  }
}
```

3. Создать `src/exercises/exercisesConfig.tsx` — конфигурация упражнений:
```tsx
import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-intro'

export const exercises: LevelConfig[] = [
  {
    levelId: '0',
    folder: '00-intro',
    navKey: 'nav.intro',
    descKey: 'level.0.desc',
    tasks: [task('0.1', <Level0.Task0_1_Solution />)],
  },
]
```

4. Создать `src/translations.ts` — переводы для UI и названий заданий

5. Создать `src/courseConfig.ts`:
```ts
import type { CourseConfig } from '@courses/platform'
import { exercises } from './exercises/exercisesConfig'
import { translations } from './translations'

export const courseConfig: CourseConfig = {
  courseId: 'my-course',
  title: 'My Course',
  defaultLanguage: 'ru',
  defaultRoute: '/task/0.1',
  exercises,
  translations,
}
```

6. Создать `src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CoursePlatform } from '@courses/platform'
import { courseConfig } from './courseConfig'
import '@courses/platform/src/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoursePlatform config={courseConfig} />
  </StrictMode>
)
```

7. Создать `index.html`, `vite.config.ts`, `tsconfig.json` — по образцу `apps/rhf-course/`

8. Создать папку `exercises/` с Task-файлами для студентов

9. Запустить `npm install` в корне монорепо

10. `cd apps/my-course && npm run dev`

## Платформа (@courses/platform)

Платформа предоставляет:

- **CoursePlatform** — главный компонент (роутинг, провайдеры, layout)
- **Хуки** — `useTheme`, `useLanguage`, `useProgress`, `useLocalStorage` и др.
- **UI-компоненты** — `FormContainer`, `CodeHighlight`, `CodeExample`, `Requirements`, `Tip`, `TaskBlock`
- **Стили** — CSS переменные, темы (светлая/темная), CSS Modules
- **Типы** — `CourseConfig`, `LevelConfig`, `TaskEntry`, `Language`, `Translations`

Платформа не публикуется в npm — она подключается через npm workspaces как локальный пакет.
