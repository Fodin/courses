import { useState } from 'react'

// TODO: Define type SpecView = 'full' | 'paths' | 'components'
// TODO: Определить тип SpecView = 'full' | 'paths' | 'components'

// TODO: Create TODO_SPEC string — full OpenAPI YAML for Todo API with comments.
//   Required sections and endpoints:
//   - openapi: "3.0.3"
//   - info: title, version, description
//   - servers: production + localhost
//   - paths:
//       /tasks: GET (params: completed, limit) + POST (requestBody, response 201)
//       /tasks/{id}: shared path parameter + GET + PUT + DELETE (204)
//   - components:
//       schemas: Task (id uuid, title, completed, createdAt), TaskInput, Error
//       responses: NotFound, BadRequest (using $ref to Error schema)
//   Add YAML comments (#) explaining each major section
// TODO: Создать строку TODO_SPEC — полный OpenAPI YAML для Todo API с комментариями.
//   Обязательные секции и эндпоинты:
//   - openapi: "3.0.3"
//   - info: title, version, description
//   - servers: production + localhost
//   - paths:
//       /tasks: GET (params: completed, limit) + POST (requestBody, response 201)
//       /tasks/{id}: shared path parameter + GET + PUT + DELETE (204)
//   - components:
//       schemas: Task (id uuid, title, completed, createdAt), TaskInput, Error
//       responses: NotFound, BadRequest (используя $ref на схему Error)
//   Добавить YAML-комментарии (#), объясняющие каждую основную секцию

// TODO: Create getSpecPart(view) function:
//   'full' → return full TODO_SPEC
//   'paths' → slice from 'paths:' to 'components:'
//   'components' → slice from 'components:'
// TODO: Создать функцию getSpecPart(view):
//   'full' → вернуть полный TODO_SPEC
//   'paths' → вырезать от 'paths:' до 'components:'
//   'components' → вырезать от 'components:'

export function Task7_3() {
  // TODO: view state: SpecView (default 'full') / TODO: Состояние view: SpecView (по умолчанию 'full')
  // TODO: copied state: boolean (default false) / TODO: Состояние copied: boolean (по умолчанию false)

  // TODO: handleCopy — copy TODO_SPEC to clipboard, set copied=true, reset after 2s
  // TODO: handleCopy — скопировать TODO_SPEC в буфер обмена, установить copied=true, сбросить через 2с

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Полная спецификация: Todo API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Эталонная OpenAPI-спецификация для CRUD-API. Комментарии объясняют каждую секцию.
      </p>

      {/* TODO: Render stats row (flex, gap) with 4 cards:
           - Endpoints: "2 пути, 5 операций" (blue)
           - Schemas: "Task, TaskInput, Error" (green)
           - Reusable responses: "NotFound, BadRequest" (yellow)
           - OpenAPI: "3.0.3" (indigo) */}
      {/* TODO: Отрисовать строку статистики (flex, gap) с 4 карточками:
           - Endpoints: "2 пути, 5 операций" (синий)
           - Schemas: "Task, TaskInput, Error" (зелёный)
           - Переиспользуемые ответы: "NotFound, BadRequest" (жёлтый)
           - OpenAPI: "3.0.3" (индиго) */}

      {/* TODO: Render view switcher buttons:
           "Полная спецификация" (indigo), "Только paths" (amber), "Только components" (pink)
           + "📋 Копировать" / "✅ Скопировано" button aligned right */}
      {/* TODO: Отрисовать кнопки переключения вида:
           "Полная спецификация" (индиго), "Только paths" (янтарный), "Только components" (розовый)
           + кнопка "📋 Копировать" / "✅ Скопировано" выровнена вправо */}

      {/* TODO: Render YAML code block:
           dark background (#0f172a), monospace, pre, maxHeight 600px, overflowY auto
           Shows getSpecPart(view) */}
      {/* TODO: Отрисовать блок кода YAML:
           тёмный фон (#0f172a), моноширинный, pre, maxHeight 600px, overflowY auto
           Показывает getSpecPart(view) */}

      {/* TODO: Render tip block (light blue bg):
           Text: "Вставьте эту спецификацию в editor.swagger.io — вы увидите интерактивную документацию"
           Link to https://editor.swagger.io should open in new tab */}
      {/* TODO: Отрисовать блок совета (светло-голубой фон):
           Текст: "Вставьте эту спецификацию в editor.swagger.io — вы увидите интерактивную документацию"
           Ссылка на https://editor.swagger.io должна открываться в новой вкладке */}
    </div>
  )
}
