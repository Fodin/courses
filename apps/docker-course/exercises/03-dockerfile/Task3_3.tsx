import { useState } from 'react'

// ============================================
// Задание 3.3: COPY vs ADD, .dockerignore
// Task 3.3: COPY vs ADD, .dockerignore
// ============================================

// TODO: Определите интерфейс CopyVsAddRow с полями:
//   scenario (string), copy (string), add (string),
//   recommended ('copy' | 'add' | 'neither')
// TODO: Define a CopyVsAddRow interface with fields:
//   scenario (string), copy (string), add (string),
//   recommended ('copy' | 'add' | 'neither')

// TODO: Создайте массив copyVsAddData с минимум 4 сценариями:
//   1. Копирование локальных файлов (рекомендация: COPY)
//   2. Копирование с правами --chown (рекомендация: COPY)
//   3. Распаковка tar-архива (рекомендация: ADD)
//   4. Скачивание из URL (рекомендация: RUN curl -- 'neither')
// TODO: Create a copyVsAddData array with at least 4 scenarios:
//   1. Copying local files (recommend: COPY)
//   2. Copying with --chown (recommend: COPY)
//   3. Extracting tar archive (recommend: ADD)
//   4. Downloading from URL (recommend: RUN curl -- 'neither')

// TODO: Создайте строку dockerignoreExample с примером .dockerignore для Node.js-проекта.
//   Включите: node_modules, .git, .env, Dockerfile, coverage, IDE-файлы
// TODO: Create a dockerignoreExample string with a .dockerignore example for a Node.js project.
//   Include: node_modules, .git, .env, Dockerfile, coverage, IDE files

export function Task3_3() {
  // TODO: Создайте состояние для переключения контекста (with/without) и видимости .dockerignore
  // TODO: Create state for context toggle (with/without) and .dockerignore visibility
  const [showDockerignore, setShowDockerignore] = useState(false)
  const [contextSize, setContextSize] = useState<'without' | 'with'>('without')

  return (
    <div style={{ padding: '1rem' }}>
      <h2>COPY vs ADD, .dockerignore</h2>

      {/* TODO: Создайте таблицу COPY vs ADD с колонками:
          Сценарий | COPY | ADD | Рекомендация.
          Подсветите рекомендуемый вариант зелёным (#e8f5e9).
          В колонке "Рекомендация" покажите текст: COPY, ADD или RUN curl. */}
      {/* TODO: Create a COPY vs ADD table with columns:
          Scenario | COPY | ADD | Recommendation.
          Highlight recommended option green (#e8f5e9).
          In "Recommendation" column show text: COPY, ADD or RUN curl. */}

      <h3>.dockerignore</h3>

      {/* TODO: Создайте кнопки переключения "Без .dockerignore" / "С .dockerignore".
          Для каждого варианта покажите:
          1. Общий размер контекста (487 MB vs 12 MB)
          2. Разбивку по категориям с цветными полосками:
             - node_modules (350 MB, красный)
             - .git (85 MB, оранжевый)
             - Source code (12 MB, зелёный)
             - .env (0.1 MB, красный)
          Ширина полоски пропорциональна размеру. */}
      {/* TODO: Create toggle buttons "Without .dockerignore" / "With .dockerignore".
          For each option show:
          1. Total context size (487 MB vs 12 MB)
          2. Breakdown by category with colored bars:
             - node_modules (350 MB, red)
             - .git (85 MB, orange)
             - Source code (12 MB, green)
             - .env (0.1 MB, red)
          Bar width proportional to size. */}

      {/* TODO: Кнопка "Показать пример .dockerignore" -- показать/скрыть содержимое
          dockerignoreExample в <pre> блоке с тёмным фоном. */}
      {/* TODO: "Show .dockerignore example" button -- show/hide dockerignoreExample
          content in a <pre> block with dark background. */}
    </div>
  )
}
