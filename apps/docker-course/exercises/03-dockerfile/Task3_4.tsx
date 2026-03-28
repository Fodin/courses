import { useState } from 'react'

// ============================================
// Задание 3.4: Multi-stage builds
// Task 3.4: Multi-stage builds
// ============================================

// TODO: Определите интерфейсы BuildStage и MultiStageExample:
//   BuildStage: name, baseImage, purpose, contents (string[]), size, color
//   MultiStageExample: title, language, stages (BuildStage[]),
//     dockerfile, singleStageSize, multiStageSize
// TODO: Define BuildStage and MultiStageExample interfaces:
//   BuildStage: name, baseImage, purpose, contents (string[]), size, color
//   MultiStageExample: title, language, stages (BuildStage[]),
//     dockerfile, singleStageSize, multiStageSize

// TODO: Создайте массив examples с минимум 3 примерами:
//   1. Node.js API: builder (node:20, 1.1 GB) -> production (node:20-alpine, 150 MB)
//   2. React + Nginx: build (node:20-alpine, 500 MB) -> production (nginx:alpine, 25 MB)
//   3. Go API: builder (golang:1.22, 1.2 GB) -> production (scratch, 10 MB)
//   Каждый пример должен содержать реалистичный Dockerfile с best practices.
// TODO: Create an examples array with at least 3 examples:
//   1. Node.js API: builder (node:20, 1.1 GB) -> production (node:20-alpine, 150 MB)
//   2. React + Nginx: build (node:20-alpine, 500 MB) -> production (nginx:alpine, 25 MB)
//   3. Go API: builder (golang:1.22, 1.2 GB) -> production (scratch, 10 MB)
//   Each example should contain a realistic Dockerfile with best practices.

export function Task3_4() {
  // TODO: Создайте состояние для активного примера и видимости Dockerfile
  // TODO: Create state for active example and Dockerfile visibility
  const [activeExample, setActiveExample] = useState(0)
  const [showDockerfile, setShowDockerfile] = useState(false)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Multi-stage builds</h2>

      {/* TODO: Создайте кнопки для переключения между примерами (Node.js, React, Go).
          Активный пример должен быть визуально выделен. */}
      {/* TODO: Create buttons to switch between examples (Node.js, React, Go).
          Active example should be visually highlighted. */}

      {/* TODO: Для активного примера покажите этапы сборки в виде карточек (flex):
          Каждая карточка содержит:
          1. Заголовок с именем этапа (цветной фон)
          2. Базовый образ (мелким шрифтом)
          3. Назначение этапа
          4. Список содержимого (<ul>)
          5. Размер этапа (в подсвеченном блоке) */}
      {/* TODO: For active example show build stages as cards (flex):
          Each card contains:
          1. Header with stage name (colored background)
          2. Base image (small font)
          3. Stage purpose
          4. Content list (<ul>)
          5. Stage size (in highlighted block) */}

      {/* TODO: Визуальное сравнение размеров:
          1. Полоска single-stage (красная, 100% ширины) с размером
          2. Полоска multi-stage (зелёная, пропорциональная ширина) с размером
          3. Бейдж с процентом уменьшения */}
      {/* TODO: Visual size comparison:
          1. Single-stage bar (red, 100% width) with size
          2. Multi-stage bar (green, proportional width) with size
          3. Badge with reduction percentage */}

      {/* TODO: Кнопка "Показать Dockerfile" -- показать/скрыть полный Dockerfile
          в <pre> блоке с тёмным фоном. */}
      {/* TODO: "Show Dockerfile" button -- show/hide full Dockerfile
          in a <pre> block with dark background. */}

      {/* TODO: Блок с ключевыми принципами multi-stage builds (голубой фон #e3f2fd):
          - Каждый FROM начинает новый этап
          - COPY --from=stage_name копирует между этапами
          - В финальный образ попадает только последний этап
          - Используйте alpine или scratch для production */}
      {/* TODO: Key principles block (light blue #e3f2fd):
          - Each FROM starts a new stage
          - COPY --from=stage_name copies between stages
          - Only the last stage goes into the final image
          - Use alpine or scratch for production */}
    </div>
  )
}
