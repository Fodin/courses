import { useState } from 'react'

// TODO: Define type SectionId = 'openapi' | 'info' | 'servers' | 'paths' | 'components'
// TODO: Определить тип SectionId = 'openapi' | 'info' | 'servers' | 'paths' | 'components'

// TODO: Define interface SectionInfo: / TODO: Определить интерфейс SectionInfo:
//   id: SectionId, title: string, required: boolean, color: string,
//   icon: string, description: string, details: string, example: string

// TODO: Create OPENAPI_SECTIONS array with 5 entries: / TODO: Создать массив OPENAPI_SECTIONS с 5 записями:
//   1. openapi — color '#6366f1', icon '🔖', required: true
//      description: 'Версия спецификации OpenAPI'
//      example: 'openapi: "3.0.3"'
//   2. info — color '#0ea5e9', icon '📋', required: true
//      description: 'Метаданные API: название, версия, описание'
//      example: multiline with title, version, description, contact
//   3. servers — color '#10b981', icon '🌐', required: false
//      description: 'Список серверов, на которых доступен API'
//      example: production + staging + local entries
//   4. paths — color '#f59e0b', icon '🛣️', required: true
//      description: 'Все endpoints API и их операции'
//      example: /tasks with get and /tasks/{id} with get + parameters
//   5. components — color '#ec4899', icon '🧩', required: false
//      description: 'Переиспользуемые схемы, параметры, ответы'
//      example: schemas with Task and responses with NotFound using $ref

export function Task7_1() {
  // TODO: activeSection state: SectionId | null (default null)
  // TODO: Состояние activeSection: SectionId | null (по умолчанию null)

  // TODO: Find active section from OPENAPI_SECTIONS
  // TODO: Найти активную секцию из OPENAPI_SECTIONS

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Анатомия OpenAPI-документа</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Кликните на секцию, чтобы узнать подробнее о её роли в спецификации.
      </p>

      {/* TODO: Render document map — bordered container with dark header "openapi-spec.yaml"
           For each section render a row (onClick toggles activeSection):
           - Left border: 4px solid section.color when active, transparent when not
           - Background: section.color + '10' when active, white when not
           - Content (flex row): icon, title (bold, colored when active), description (gray),
             required badge (red "обязательно" / green "опционально"), arrow ▲/▼ */}
      {/* TODO: Отрисовать карту документа — контейнер с рамкой и тёмным заголовком "openapi-spec.yaml"
           Для каждой секции отрисовать строку (onClick переключает activeSection):
           - Левая рамка: 4px solid section.color когда активна, transparent когда нет
           - Фон: section.color + '10' когда активна, белый когда нет
           - Содержимое (flex row): иконка, заголовок (жирный, цветной когда активен), описание (серый),
             бейдж обязательности (красный "обязательно" / зелёный "опционально"), стрелка ▲/▼ */}

      {/* TODO: If active section selected — render detail card:
           - Header with section.color background: icon + title
           - Body: section.details text + dark code block with section.example */}
      {/* TODO: Если активная секция выбрана — отрисовать карточку деталей:
           - Заголовок с фоном section.color: иконка + заголовок
           - Тело: текст section.details + тёмный блок кода с section.example */}

      {/* TODO: If no section selected — render placeholder with dashed border:
           "👆 Нажмите на любую секцию выше, чтобы увидеть детали и пример" */}
      {/* TODO: Если ни одна секция не выбрана — отрисовать заглушку с пунктирной рамкой:
           "👆 Нажмите на любую секцию выше, чтобы увидеть детали и пример" */}
    </div>
  )
}
