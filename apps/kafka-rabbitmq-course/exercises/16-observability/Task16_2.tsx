import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 16.2: Distributed Tracing — путь сообщения / Task 16.2: Distributed Tracing — Message Path
// ============================================================
//
// Goal: implement a distributed trace waterfall visualizer.
// Shows how a single request travels through multiple services
// connected via Kafka, with span details on click.

// TODO: Declare the TraceSpan interface. / Объявите интерфейс TraceSpan.
// Fields:
//   id: string
//   parentId: string | null
//   service: string
//   operation: string
//   startMs: number        ← offset from trace start / смещение от начала трейса
//   durationMs: number
//   status: 'ok' | 'error' | 'slow'
//   tags: Record<string, string>
// interface TraceSpan { ... }

// TODO: Declare the TraceScenario interface. / Объявите интерфейс TraceScenario.
// Fields: id: string, name: string, traceId: string, spans: TraceSpan[]
// interface TraceScenario { ... }

// TODO: Declare the SCENARIOS array with three scenarios: / Объявите массив SCENARIOS с тремя сценариями:
//
// 1. id: 'success', name: 'Успешный путь', traceId: 'abc123def456'
//    7 spans — all status 'ok':
//    s1: Service A | POST /order           | start 0,   dur 245 | tags: http.method POST, http.status 200, span.kind server
//    s2: Service A | kafka.produce → orders| start 12,  dur 8   | tags: messaging.system kafka, messaging.destination orders, messaging.operation send
//    s3: Service B | kafka.consume ← orders| start 35,  dur 18  | tags: messaging.system kafka, messaging.destination orders, messaging.operation receive
//    s4: Service B | processOrder          | start 53,  dur 75  | tags: db.system postgres, db.statement "INSERT INTO orders"
//    s5: Service B | kafka.produce → notif.| start 128, dur 6   | tags: messaging.system kafka, messaging.destination notifications, messaging.operation send
//    s6: Service C | kafka.consume ← notif.| start 148, dur 12  | tags: messaging.system kafka, messaging.destination notifications, messaging.operation receive
//    s7: Service C | sendEmail             | start 160, dur 85  | tags: net.peer.name smtp.example.com, net.peer.port 587
//
// 2. id: 'slow', name: 'Медленный consumer', traceId: 'ff9900aa1122'
//    7 spans — s1 and s3 are 'slow':
//    s1: Service A | POST /order           | start 0,    dur 3850 | status slow
//    s2: Service A | kafka.produce → orders| start 12,   dur 9    | status ok
//    s3: Service B | kafka.consume ← orders| start 35,   dur 3600 | status slow | tag consumer.lag: '12500'
//    s4: Service B | processOrder          | start 3635, dur 80   | status ok
//    s5: Service B | kafka.produce → notif.| start 3715, dur 7    | status ok
//    s6: Service C | kafka.consume ← notif.| start 3730, dur 14   | status ok
//    s7: Service C | sendEmail             | start 3744, dur 106  | status ok
//
// 3. id: 'error', name: 'Ошибка в Service B', traceId: '1234error5678'
//    4 spans — s1 and s4 are 'error':
//    s1: Service A | POST /order  | start 0,  dur 180 | status error | tags: http.method POST, http.status 500
//    s2: Service A | kafka.produce → orders | start 12, dur 7  | status ok
//    s3: Service B | kafka.consume ← orders | start 35, dur 16 | status ok
//    s4: Service B | processOrder           | start 51, dur 45 | status error
//         tags: db.system postgres, error 'true', error.message 'duplicate key value violates unique constraint'

// TODO: Declare SERVICE_COLORS: Record<string, string> / Объявите SERVICE_COLORS
// 'Service A' → '#4f86f7', 'Service B' → '#38a169', 'Service C' → '#b34ff7'

// TODO: Declare SPAN_STATUS_COLORS: { ok: string; slow: string; error: string } / Объявите SPAN_STATUS_COLORS
// ok → '#38a169', slow → '#ed8936', error → '#e53e3e'

export function Task16_2() {
  const { t } = useLanguage()

  // TODO: Declare state: / Объявите состояние:
  // selectedScenario: TraceScenario (initial: SCENARIOS[0])
  // selectedSpan: TraceSpan | null (initial: null)
  const [selectedScenario, setSelectedScenario] = useState<any>(null)
  const [selectedSpan, setSelectedSpan] = useState<any>(null)

  // TODO: Compute totalMs = max of (span.startMs + span.durationMs) across all spans / Вычислите totalMs как максимум (span.startMs + span.durationMs)

  return (
    <div className="exercise-container">
      <h2>{t('task.16.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Distributed tracing показывает полный путь запроса через сервисы. / Distributed tracing shows the full request path through services.
        Каждый span — это один шаг обработки с метками времени. / Each span is one processing step with timestamps.
      </p>

      {/* TODO: Scenario selector buttons / Кнопки выбора сценария */}
      {/* Three buttons, one per scenario. Active scenario: border '#4f86f7', bold font, bg '#ebf4ff' / Три кнопки, активный сценарий: border '#4f86f7', bold, bg '#ebf4ff' */}
      {/* On click: setSelectedScenario(s) AND setSelectedSpan(null) / При клике: setSelectedScenario(s) И setSelectedSpan(null) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* TODO: buttons */}
      </div>

      {/* TODO: Trace Info row — flex, gap 1.5rem, fontSize 0.82rem, color #666 / Строка информации о трейсе */}
      {/* Show: Trace ID (code block), Duration: totalMs ms, Spans count, Status of root span / Показать: Trace ID, Duration, количество spans, статус корневого span */}
      {/* Status color via SPAN_STATUS_COLORS / Цвет статуса через SPAN_STATUS_COLORS */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#666' }}>
        {/* TODO: trace info */}
      </div>

      {/* TODO: Waterfall diagram / Каскадная диаграмма (waterfall) */}
      {/* Outer container: border '1px solid #e2e8f0', borderRadius 10px, overflow hidden / Внешний контейнер */}
      {/* Header row (gridTemplateColumns '200px 1fr'): "Операция" / "Время (0 — {totalMs}ms)" / Заголовочная строка */}
      {/* For each span: / Для каждого span:
          - gridTemplateColumns '200px 1fr', borderBottom between rows
          - Left cell: coloured dot (svcColor), service name (svcColor, 0.7rem bold), operation (0.73rem, #555)
          - Right cell: positioned bar / Позиционированная полоса
            - left = (span.startMs / totalMs) * 100 + '%'
            - width = Math.max((span.durationMs / totalMs) * 100, 0.5) + '%'
            - background: kafka operation → `${statusColor}50`, other → `${statusColor}20`
            - border: 1.5px solid statusColor
            - Inside bar: span.durationMs + 'ms' text
          - Selected row: background '#f0f7ff'
          - On click: toggle selection (select if not selected, deselect if already selected) / При клике: переключить выделение
      */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        {/* TODO: header */}
        {/* TODO: span rows */}
      </div>

      {/* TODO: Selected span details panel / Панель деталей выбранного span */}
      {/* Render only when selectedSpan is not null / Рендерить только когда selectedSpan не null */}
      {/* Border color = SERVICE_COLORS[selectedSpan.service] */}
      {/* Show: "service: operation" title / Показать заголовок */}
      {/* Show: Start, Duration, Status in a grid / Показать: Start, Duration, Status в сетке */}
      {/* Show: TAGS section — key=value badges (key in #888, value in #4f86f7) / Показать: секция TAGS — бейджи key=value */}
      {selectedSpan && (
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px' }}>
          {/* TODO: span details */}
        </div>
      )}

      <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#999' }}>
        Кликни на span для просмотра тегов. Видишь как trace ID пробрасывается через Kafka? / Click on a span to view its tags. See how the trace ID propagates through Kafka?
      </p>
    </div>
  )
}
