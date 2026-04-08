import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-0.1.md
//
// Создай интерактивный компонент визуализации декомпозиции монолита.
//
// Требования:
// 1. Монолит — блок с модулями внутри (Users, Orders, Payments, Inventory, Notifications, Reports)
// 2. Клик на модуль переносит его из монолита в секцию микросервисов
// 3. Каждый перенесённый сервис — отдельный блок с уникальным цветом
// 4. Прогресс-бар показывает прогресс декомпозиции
// 5. При полной декомпозиции — congratulation-сообщение
// 6. Кнопка «Сбросить» возвращает всё обратно
// 7. Анимация перехода (CSS transition или animation)

// TODO: определи тип Module
// interface Module {
//   id: string
//   label: string
//   color: string
//   separated: boolean
// }

// TODO: определи начальное состояние модулей
// const INITIAL_MODULES: Module[] = [...]

export function Task0_1() {
  const { t } = useLanguage()

  // TODO: добавь состояние для модулей
  // const [modules, setModules] = useState<Module[]>(INITIAL_MODULES)

  // TODO: реализуй handleModuleClick — при клике модуль становится separated: true
  // const handleModuleClick = (id: string) => { ... }

  // TODO: реализуй handleReset — сбрасывает все модули в separated: false
  // const handleReset = () => { ... }

  // TODO: вычисли monolithModules (separated: false) и microservices (separated: true)
  // TODO: вычисли прогресс в процентах

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>

      {/* TODO: добавь описание задания для пользователя */}
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {/* Подсказка: опиши что нужно сделать пользователю */}
      </p>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* TODO: секция монолита — блок с оставшимися модулями */}
        {/* Подсказка: monolithModules.map(...) с кнопкой для каждого */}

        {/* TODO: стрелка между секциями (показывать только если есть microservices.length > 0) */}

        {/* TODO: секция микросервисов — перенесённые сервисы */}
        {/* Подсказка: microservices.map(...) — отдельные блоки с border */}
      </div>

      {/* TODO: прогресс-бар */}

      {/* TODO: congratulation-сообщение при полной декомпозиции */}

      {/* TODO: кнопка сброса */}

      {/* TODO: CSS-анимация для появления карточек микросервисов */}
    </div>
  )
}
