import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-0.1.md
// Exercise description: task-0.1.md
//
// Создай интерактивный компонент визуализации декомпозиции монолита.
// Create an interactive monolith decomposition visualization component.
//
// Требования:
// Requirements:
// 1. Монолит — блок с модулями внутри (Users, Orders, Payments, Inventory, Notifications, Reports)
// 1. Monolith — a block containing internal modules (Users, Orders, Payments, Inventory, Notifications, Reports)
// 2. Клик на модуль переносит его из монолита в секцию микросервисов
// 2. Clicking a module moves it from the monolith to the microservices section
// 3. Каждый перенесённый сервис — отдельный блок с уникальным цветом
// 3. Each moved service — a separate block with a unique color
// 4. Прогресс-бар показывает прогресс декомпозиции
// 4. A progress bar shows decomposition progress
// 5. При полной декомпозиции — congratulation-сообщение
// 5. Upon full decomposition — show a congratulatory message
// 6. Кнопка «Сбросить» возвращает всё обратно
// 6. A "Reset" button returns everything back
// 7. Анимация перехода (CSS transition или animation)
// 7. Transition animation (CSS transition or animation)

// TODO: определи тип Module / define the Module type
// interface Module {
//   id: string
//   label: string
//   color: string
//   separated: boolean
// }

// TODO: определи начальное состояние модулей / define the initial state of modules
// const INITIAL_MODULES: Module[] = [...]

export function Task0_1() {
  const { t } = useLanguage()

  // TODO: добавь состояние для модулей / add state for modules
  // const [modules, setModules] = useState<Module[]>(INITIAL_MODULES)

  // TODO: реализуй handleModuleClick — при клике модуль становится separated: true
  // TODO: implement handleModuleClick — on click, set module's separated to true
  // const handleModuleClick = (id: string) => { ... }

  // TODO: реализуй handleReset — сбрасывает все модули в separated: false
  // TODO: implement handleReset — reset all modules to separated: false
  // const handleReset = () => { ... }

  // TODO: вычисли monolithModules (separated: false) и microservices (separated: true)
  // TODO: вычисли прогресс в процентах / compute progress percentage

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>

      {/* TODO: добавь описание задания для пользователя / add user instructions */}
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {/* Подсказка: опиши что нужно сделать пользователю */}
        {/* Hint: describe what the user should do */}
      </p>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* TODO: секция монолита — блок с оставшимися модулями / monolith section */}
        {/* Подсказка: monolithModules.map(...) с кнопкой для каждого */}
        {/* Hint: monolithModules.map(...) with a button for each */}

        {/* TODO: стрелка между секциями (показывать только если есть microservices.length > 0) */}
        {/* TODO: arrow between sections (show only if microservices.length > 0) */}

        {/* TODO: секция микросервисов — перенесённые сервисы / microservices section */}
        {/* Подсказка: microservices.map(...) — отдельные блоки с border */}
        {/* Hint: microservices.map(...) — individual blocks with border */}
      </div>

      {/* TODO: прогресс-бар / progress bar */}

      {/* TODO: congratulation-сообщение при полной декомпозиции / congratulatory message */}

      {/* TODO: кнопка сброса / reset button */}

      {/* TODO: CSS-анимация для появления карточек микросервисов */}
      {/* TODO: CSS animation for microservice card appearance */}
    </div>
  )
}
