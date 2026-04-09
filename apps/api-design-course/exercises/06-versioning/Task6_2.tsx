import { useState } from 'react'

// TODO: Define interface TimelineEvent:
//   id: string, label: string, description: string,
//   header?: string, headerValue?: string,
//   color: string, icon: string

// TODO: Create TIMELINE_EVENTS array with 5 steps:
//   1. id 'v2-release', label 'Релиз v2', color '#10b981', icon '🚀'
//      header 'X-API-Version', headerValue '2.0'
//      description: "Выпускаем новую версию API. Обе версии работают параллельно."
//   2. id 'deprecation', label 'Deprecation Notice', color '#f59e0b', icon '⚠️'
//      header 'Deprecation', headerValue 'Tue, 01 Jan 2025 00:00:00 GMT'
//      description: объявляем устаревание, добавляем заголовок в ответы v1
//   3. id 'sunset', label 'Sunset Date', color '#f97316', icon '🌅'
//      header 'Sunset', headerValue 'Tue, 01 Jul 2025 00:00:00 GMT'
//      description: устанавливаем дату отключения
//   4. id 'migration-guide', label 'Migration Guide', color '#3b82f6', icon '📖'
//      header 'Link', headerValue '<https://api.example.com/migration>; rel="successor-version"'
//      description: публикуем руководство
//   5. id 'removal', label 'Удаление v1', color '#ef4444', icon '🗑️'
//      headerValue 'HTTP/1.1 410 Gone' (no header name)
//      description: v1 отключён, возвращает 410 Gone

export function Task6_2() {
  // TODO: activeStep state (default 0)
  // TODO: showHeaders state (default true)

  // TODO: Derive current event from TIMELINE_EVENTS[activeStep]

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Timeline миграции API-версии</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Пройдите путь от релиза v2 до удаления v1. Нажимайте на шаги или используйте кнопки.
      </p>

      {/* TODO: Render horizontal timeline:
           - Absolute horizontal line behind the dots (gray base + colored progress)
           - 5 clickable dots (40x40, circular)
             * Completed steps: colored bg + icon emoji
             * Future steps: gray bg + '○'
             * Active step: colored border + glow shadow
           - Label under each dot (small text, bold when active) */}

      {/* TODO: Render info card with border of event.color:
           1. Colored header: icon + "Шаг N: label"
           2. Description paragraph (light gray bg)
           3. If event.headerValue: show HTTP header block
              - Sub-header row with "HTTP-заголовок ответа" + Show/Hide button
              - Dark code block: colored header name + colon + colored value
                If no event.header (step 5): show value in red */}

      {/* TODO: RFC 8594 info block (blue bg #eff6ff):
           Mention Deprecation, Sunset (RFC 8594), and Link headers */}

      {/* TODO: Navigation buttons (centered):
           - "← Назад" disabled at step 0
           - "Вперёд →" colored bg (event.color), disabled at last step */}
    </div>
  )
}
