import { useState, useCallback, useRef, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 13.3: Event processing pipeline
//
// Цель: реализовать FP-пайплайн обработки событий из четырёх
//       этапов, каждый из которых — чистая функция.
// ============================================================

// --- Types ---

type EventType = 'click' | 'purchase' | 'pageview'

interface RawEvent {
  id: string
  type: EventType
  userId: string
  timestamp: number
  data: Record<string, unknown>
}

interface EnrichedEvent extends RawEvent {
  sessionId: string
  region: string
  processed: boolean
}

type Left<E> = { tag: 'Left'; value: E }
type Right<A> = { tag: 'Right'; value: A }
type Either<E, A> = Left<E> | Right<A>

function Left<E>(value: E): Left<E> { return { tag: 'Left', value } }
function Right<A>(value: A): Right<A> { return { tag: 'Right', value } }
function isRight<E, A>(e: Either<E, A>): e is Right<A> { return e.tag === 'Right' }

// ============================================================
// TODO 1: Реализуй функцию enrich
//
// enrich(event: RawEvent): EnrichedEvent
//
// Добавляет к событию:
//   sessionId — `sess_${event.userId}_${Math.floor(event.timestamp / 60000)}`
//   region    — ['RU', 'EU', 'US'][parseInt(event.userId.replace(/\D/g,'') || '0', 10) % 3]
//               (подсказка: userId может быть строкой без цифр — используй || '0')
//   processed — true
//
// Не мутирует event — используй spread.
// ============================================================

function enrich(_event: RawEvent): EnrichedEvent {
  // TODO: вернуть { ...event, sessionId: ..., region: ..., processed: true }
  return { ..._event, sessionId: '', region: '', processed: false } // заглушка
}

// ============================================================
// TODO 2: Реализуй функцию validateEvent
//
// validateEvent(event: EnrichedEvent): Either<string, EnrichedEvent>
//
// Правила валидации:
//   - event.id должен быть непустой строкой → Left('missing id')
//   - event.userId должен быть непустой строкой → Left('missing userId')
//   - event.timestamp должен быть > 0 → Left('missing timestamp')
//   - если event.type === 'purchase':
//       event.data.amount должен быть числом → Left('purchase missing amount')
//
// Если всё корректно — Right(event).
// ============================================================

function validateEvent(_event: EnrichedEvent): Either<string, EnrichedEvent> {
  // TODO
  return Right(_event) // заглушка — принимает всё
}

// ============================================================
// TODO 3: Реализуй функцию routeEvent
//
// routeEvent(event: EnrichedEvent): { channel: string; event: EnrichedEvent }
//
// Маршрутизация по типу события:
//   'click'     → channel: 'analytics'
//   'purchase'  → channel: 'billing'
//   'pageview'  → channel: 'metrics'
// ============================================================

function routeEvent(_event: EnrichedEvent): { channel: string; event: EnrichedEvent } {
  // TODO
  return { channel: 'unknown', event: _event } // заглушка
}

// ============================================================
// Генератор событий — готов, не изменяй
// ============================================================

const USER_IDS = ['user1', 'user2', 'user3', 'user4', 'user5']

function generateEvent(index: number): RawEvent {
  const types: EventType[] = ['click', 'purchase', 'pageview', 'click', 'pageview']
  const type = types[index % types.length]
  const userId = USER_IDS[index % USER_IDS.length]
  const isInvalid = index % 13 === 0

  return {
    id: isInvalid ? '' : `evt_${Date.now()}_${index}`,
    type,
    userId,
    timestamp: Date.now() - Math.random() * 60000,
    data: type === 'purchase'
      ? (isInvalid ? { product: 'item' } : { product: `Product ${index % 5}`, amount: Math.floor(Math.random() * 10000) + 100 })
      : { page: `/page/${index % 10}` },
  }
}

// ============================================================
// Компонент задания — завершите TODO выше, UI готов
// ============================================================

interface StageStats { received: number; passed: number; rejected: number }

interface PipelineStats {
  enrich: StageStats
  validate: StageStats
  route: StageStats
  aggregate: StageStats
}

interface AggregatedData {
  totalEvents: number
  validEvents: number
  clicks: number
  purchases: number
  pageviews: number
  totalRevenue: number
  uniqueUsers: Set<string>
}

export function Task13_3() {
  const { t } = useLanguage()
  const [events, setEvents] = useState<RawEvent[]>([])
  const [stats, setStats] = useState<PipelineStats>({
    enrich: { received: 0, passed: 0, rejected: 0 },
    validate: { received: 0, passed: 0, rejected: 0 },
    route: { received: 0, passed: 0, rejected: 0 },
    aggregate: { received: 0, passed: 0, rejected: 0 },
  })
  const [aggregated, setAggregated] = useState<AggregatedData>({
    totalEvents: 0, validEvents: 0, clicks: 0, purchases: 0,
    pageviews: 0, totalRevenue: 0, uniqueUsers: new Set(),
  })
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const processEvents = useCallback((newEvents: RawEvent[]) => {
    const stages = ['enrich', 'validate', 'route', 'aggregate']
    let si = 0
    const tick = () => {
      if (si >= stages.length) { setActiveStage(null); return }
      setActiveStage(stages[si++])
      animRef.current = setTimeout(tick, 400)
    }
    tick()

    setStats(prev => {
      const next = { ...prev }

      // Enrich stage
      const enriched: EnrichedEvent[] = newEvents.map(ev => {
        next.enrich.received++
        const e = enrich(ev)
        next.enrich.passed++
        return e
      })

      // Validate stage
      const validated: EnrichedEvent[] = []
      for (const ev of enriched) {
        next.validate.received++
        const r = validateEvent(ev)
        if (isRight(r)) {
          validated.push(r.value)
          next.validate.passed++
        } else {
          next.validate.rejected++
        }
      }

      // Route stage
      const routed: Array<{ channel: string; event: EnrichedEvent }> = validated.map(ev => {
        next.route.received++
        const r = routeEvent(ev)
        next.route.passed++
        return r
      })

      // Aggregate stage
      routed.forEach(() => {
        next.aggregate.received++
        next.aggregate.passed++
      })

      setAggregated(prev => {
        const newUsers = new Set(prev.uniqueUsers)
        let revenue = prev.totalRevenue
        let clicks = prev.clicks
        let purchases = prev.purchases
        let pageviews = prev.pageviews

        for (const { event } of routed) {
          newUsers.add(event.userId)
          if (event.type === 'click') clicks++
          if (event.type === 'purchase') { purchases++; revenue += (event.data.amount as number) || 0 }
          if (event.type === 'pageview') pageviews++
        }

        return {
          totalEvents: prev.totalEvents + newEvents.length,
          validEvents: prev.validEvents + validated.length,
          clicks, purchases, pageviews, totalRevenue: revenue, uniqueUsers: newUsers,
        }
      })

      return next
    })
  }, [])

  const generate = useCallback((count: number) => {
    const newEvents = Array.from({ length: count }, (_, i) => generateEvent(events.length + i))
    setEvents(prev => [...prev, ...newEvents])
    processEvents(newEvents)
  }, [events.length, processEvents])

  useEffect(() => () => { if (animRef.current) clearTimeout(animRef.current) }, [])

  const reset = () => {
    setEvents([])
    setStats({
      enrich: { received: 0, passed: 0, rejected: 0 },
      validate: { received: 0, passed: 0, rejected: 0 },
      route: { received: 0, passed: 0, rejected: 0 },
      aggregate: { received: 0, passed: 0, rejected: 0 },
    })
    setAggregated({ totalEvents: 0, validEvents: 0, clicks: 0, purchases: 0, pageviews: 0, totalRevenue: 0, uniqueUsers: new Set() })
    setActiveStage(null)
  }

  const stageConfig = [
    { key: 'enrich', label: 'Enrich', color: '#3b82f6', desc: 'sessionId, region' },
    { key: 'validate', label: 'Validate', color: '#a855f7', desc: 'обяз. поля' },
    { key: 'route', label: 'Route', color: '#f59e0b', desc: 'channel' },
    { key: 'aggregate', label: 'Aggregate', color: '#22c55e', desc: 'count/sum' },
  ]

  const validPct = aggregated.totalEvents > 0
    ? Math.round((aggregated.validEvents / aggregated.totalEvents) * 100)
    : 0

  return (
    <div className="exercise-container">
      <h2>{t('task.13.3')}</h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: '#9ca3af' }}>Генерировать:</span>
        {[10, 50, 100].map(n => (
          <button
            key={n}
            onClick={() => generate(n)}
            style={{
              background: '#1e3a5f', color: '#93c5fd', border: '1px solid #3b82f6',
              borderRadius: '6px', padding: '0.35rem 0.9rem',
              cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'monospace',
            }}
          >
            {n} событий
          </button>
        ))}
        <button
          onClick={reset}
          style={{
            background: '#4c1d1d', color: '#fca5a5', border: '1px solid #ef4444',
            borderRadius: '6px', padding: '0.35rem 0.9rem',
            cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'monospace',
          }}
        >
          Сбросить
        </button>
      </div>

      {/* Pipeline stages */}
      <div style={{ background: '#1f2937', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: '#f9fafb', fontWeight: 700, marginBottom: '0.75rem' }}>Этапы обработки</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {stageConfig.map((stage, i) => {
            const s = stats[stage.key as keyof PipelineStats]
            const isActive = activeStage === stage.key
            return (
              <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: '120px' }}>
                <div style={{
                  flex: 1, padding: '0.6rem 0.75rem', borderRadius: '8px',
                  background: isActive ? `${stage.color}20` : '#0f172a',
                  border: `2px solid ${isActive ? stage.color : '#374151'}`,
                  transition: 'all 0.3s',
                }}>
                  <div style={{ color: stage.color, fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                    {stage.label}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.7rem', marginBottom: '0.3rem' }}>{stage.desc}</div>
                  <div style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: '#93c5fd' }}>+{s.passed} </span>
                    {s.rejected > 0 && <span style={{ color: '#fca5a5' }}>-{s.rejected}</span>}
                  </div>
                </div>
                {i < stageConfig.length - 1 && (
                  <div style={{ color: '#374151', flexShrink: 0 }}>→</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Dashboard */}
      {aggregated.totalEvents > 0 && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ color: '#f9fafb', fontWeight: 700, marginBottom: '0.75rem' }}>Dashboard</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem' }}>
            {[
              { label: 'Всего событий', value: aggregated.totalEvents, color: '#93c5fd' },
              { label: `Валидных (${validPct}%)`, value: aggregated.validEvents, color: '#86efac' },
              { label: 'Clicks', value: aggregated.clicks, color: '#a5f3fc' },
              { label: 'Purchases', value: aggregated.purchases, color: '#fde68a' },
              { label: 'Pageviews', value: aggregated.pageviews, color: '#c4b5fd' },
              { label: 'Уникальных юзеров', value: aggregated.uniqueUsers.size, color: '#f9a8d4' },
            ].map(m => (
              <div key={m.label} style={{ background: '#0f172a', borderRadius: '6px', padding: '0.5rem 0.7rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.7rem', marginBottom: '0.15rem' }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: '1.2rem', fontWeight: 700 }}>{m.value}</div>
              </div>
            ))}
          </div>
          {aggregated.purchases > 0 && (
            <div style={{ marginTop: '0.6rem', background: '#0f172a', borderRadius: '6px', padding: '0.5rem 0.7rem' }}>
              <div style={{ color: '#6b7280', fontSize: '0.7rem', marginBottom: '0.15rem' }}>Total revenue</div>
              <div style={{ color: '#fde68a', fontSize: '1.2rem', fontWeight: 700 }}>
                {aggregated.totalRevenue.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          )}
        </div>
      )}

      <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '1rem' }}>
        Ожидается: enrich добавляет sessionId/region, validate отфильтровывает невалидные события,
        route проставляет channel. Каждая функция — pure.
      </p>
    </div>
  )
}
