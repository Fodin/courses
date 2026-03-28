import { useState } from 'react'

// ============================================
// Задание 3.1: WORKDIR, ENV, ARG
// Task 3.1: WORKDIR, ENV, ARG
// ============================================

// TODO: Определите интерфейс InstructionExample с полями:
//   title (string), type ('workdir' | 'env' | 'arg' | 'combined'),
//   dockerfile (string), explanation (string)
// TODO: Define an InstructionExample interface with fields:
//   title (string), type ('workdir' | 'env' | 'arg' | 'combined'),
//   dockerfile (string), explanation (string)

// TODO: Создайте массив instructionExamples с примерами для каждой инструкции.
//   - WORKDIR: пример установки рабочей директории, COPY и RUN
//   - ENV: пример переменных окружения, доступных при сборке и в контейнере
//   - ARG: пример аргументов сборки, доступных только при docker build
//   - ARG + ENV: паттерн передачи ARG в ENV для доступа в контейнере
// TODO: Create an instructionExamples array with examples for each instruction.
//   - WORKDIR: setting working directory, COPY and RUN
//   - ENV: environment variables available at build and runtime
//   - ARG: build arguments available only during docker build
//   - ARG + ENV: pattern of passing ARG to ENV for container access

// TODO: Создайте массив scopeComparison для таблицы сравнения ENV vs ARG.
//   Минимум 5 строк: доступность при сборке, в контейнере, сохранение в образе,
//   переопределение при сборке, переопределение при запуске.
//   Каждая строка: { feature: string, env: boolean, arg: boolean }
// TODO: Create a scopeComparison array for the ENV vs ARG comparison table.
//   At least 5 rows: build availability, container availability, saved in image,
//   build-time override, run-time override.
//   Each row: { feature: string, env: boolean, arg: boolean }

export function Task3_1() {
  // TODO: Создайте состояние для активного таба и видимости таблицы сравнения
  // TODO: Create state for active tab and comparison table visibility
  const [activeTab, setActiveTab] = useState<string>('workdir')
  const [showComparison, setShowComparison] = useState(false)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>WORKDIR, ENV, ARG</h2>

      {/* TODO: Создайте кнопки-табы для переключения между WORKDIR, ENV, ARG, ARG+ENV.
          Активный таб должен быть визуально выделен (другой фон/цвет).
          При клике обновляйте activeTab. */}
      {/* TODO: Create tab buttons to switch between WORKDIR, ENV, ARG, ARG+ENV.
          Active tab should be visually highlighted.
          Update activeTab on click. */}

      {/* TODO: Для активного таба покажите:
          1. Заголовок (title)
          2. Пример Dockerfile в <pre> с тёмным фоном (#1e1e1e)
          3. Пояснение (explanation) в блоке с голубым фоном (#e3f2fd) */}
      {/* TODO: For the active tab show:
          1. Title
          2. Dockerfile example in <pre> with dark background (#1e1e1e)
          3. Explanation in a block with light blue background (#e3f2fd) */}

      {/* TODO: Создайте кнопку "Сравнение ENV vs ARG" для показа/скрытия таблицы.
          Таблица: колонки Характеристика | ENV | ARG.
          Ячейки подсветите: true = зелёный (#e8f5e9), false = красный (#ffebee). */}
      {/* TODO: Create "ENV vs ARG comparison" button to show/hide the table.
          Table columns: Feature | ENV | ARG.
          Highlight cells: true = green (#e8f5e9), false = red (#ffebee). */}
    </div>
  )
}
