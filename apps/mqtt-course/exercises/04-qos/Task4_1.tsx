import { useState } from 'react'

// ============================================
// Задание 4.1: Уровни QoS (0, 1, 2)
// ============================================

type QosLevel = 0 | 1 | 2

// TODO: Опишите структуру шага handshake для каждого QoS
// Каждый шаг: от кого, кому, название пакета, описание
interface QosStep {
  from: 'publisher' | 'broker' | 'subscriber'
  to: 'publisher' | 'broker' | 'subscriber'
  packet: string
  description: string
}

// TODO: Заполните данные для каждого уровня QoS:
// QoS 0: 1 шаг (PUBLISH)
// QoS 1: 2 шага (PUBLISH → PUBACK)
// QoS 2: 4 шага (PUBLISH → PUBREC → PUBREL → PUBCOMP)
// Также добавьте: name, tagline, pros, cons, useCase
const qosData: Record<QosLevel, {
  name: string
  tagline: string
  steps: QosStep[]
  pros: string[]
  cons: string[]
  useCase: string
}> = {
  0: {
    name: 'At most once',
    tagline: 'Максимум один раз',
    steps: [
      // TODO: PUBLISH от publisher к broker
      // TODO: PUBLISH от broker к subscriber
    ],
    pros: [
      // TODO: добавьте 2-3 преимущества
    ],
    cons: [
      // TODO: добавьте недостатки
    ],
    useCase: 'TODO: когда использовать QoS 0',
  },
  1: {
    name: 'At least once',
    tagline: 'Не менее одного раза',
    steps: [
      // TODO: PUBLISH, PUBACK
    ],
    pros: [],
    cons: [],
    useCase: 'TODO: когда использовать QoS 1',
  },
  2: {
    name: 'Exactly once',
    tagline: 'Ровно один раз',
    steps: [
      // TODO: PUBLISH, PUBREC, PUBREL, PUBCOMP
    ],
    pros: [],
    cons: [],
    useCase: 'TODO: когда использовать QoS 2',
  },
}

// TODO: Создайте данные для сравнительной таблицы QoS
// Строки: Гарантия, Дубликаты, Потери, Пакетов, RAM, Скорость
const comparisonData: Array<{ param: string; qos0: string; qos1: string; qos2: string }> = [
  // TODO: заполните строки таблицы
]

export function Task4_1() {
  const [activeQos, setActiveQos] = useState<QosLevel>(0)
  const [animStep, setAnimStep] = useState<number>(-1)
  const [showComparison, setShowComparison] = useState(false)

  const data = qosData[activeQos]

  // TODO: Реализуйте анимацию — последовательно подсвечивайте шаги
  // каждые 800мс используя setInterval
  const runAnimation = () => {
    setAnimStep(-1)
    // TODO: запустите интервал, который увеличивает animStep каждые 800мс
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Уровни QoS (0, 1, 2)</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Визуализация handshake для каждого уровня QoS.
      </p>

      {/* TODO: Кнопки переключения QoS 0 / 1 / 2 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {([0, 1, 2] as QosLevel[]).map((q) => (
          <button
            key={q}
            onClick={() => { setActiveQos(q); setAnimStep(-1) }}
            style={{
              flex: 1,
              padding: '12px 8px',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              background: activeQos === q ? '#3b82f6' : 'white',
              color: activeQos === q ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            QoS {q}
          </button>
        ))}
      </div>

      {/* TODO: Показать name и tagline активного QoS */}
      <div style={{ marginBottom: 16, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
        <div style={{ fontWeight: 600 }}>{data.name} — {data.tagline}</div>
      </div>

      {/* TODO: Отрендерите схему шагов handshake
           Три колонки: Издатель | Брокер | Подписчик
           Каждый шаг — стрелка с именем пакета
           Шаги до animStep включительно — непрозрачные, остальные — 25% */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span>Схема пакетов</span>
          <button onClick={runAnimation} style={{ padding: '6px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            ▶ Анимировать
          </button>
        </div>
        {/* TODO: отрендерите шаги data.steps */}
        <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#9ca3af' }}>
          {data.steps.length === 0 ? 'Шаги не заполнены — добавьте их в qosData' : null}
          {data.steps.map((step, idx) => (
            <div key={idx} style={{ opacity: animStep >= idx ? 1 : 0.25, marginBottom: 4 }}>
              {step.from} → {step.packet} → {step.to}
            </div>
          ))}
        </div>
      </div>

      {/* TODO: Блоки Преимущества и Недостатки */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Преимущества</div>
          {data.pros.map((p) => <div key={p} style={{ fontSize: 13 }}>✅ {p}</div>)}
          {data.pros.length === 0 && <div style={{ color: '#9ca3af', fontSize: 13 }}>TODO</div>}
        </div>
        <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Недостатки</div>
          {data.cons.map((c) => <div key={c} style={{ fontSize: 13 }}>⚠️ {c}</div>)}
          {data.cons.length === 0 && <div style={{ color: '#9ca3af', fontSize: 13 }}>TODO</div>}
        </div>
      </div>

      {/* TODO: Кнопка-переключатель для сравнительной таблицы */}
      <button
        onClick={() => setShowComparison(!showComparison)}
        style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 13, marginBottom: 8 }}
      >
        {showComparison ? '▼' : '▶'} Сравнительная таблица
      </button>

      {/* TODO: Таблица сравнения QoS (если showComparison = true) */}
      {showComparison && (
        <div style={{ fontSize: 13, color: '#9ca3af' }}>
          TODO: добавьте данные в comparisonData и отрендерите таблицу
          {comparisonData.length === 0 && ' (comparisonData пуст)'}
        </div>
      )}
    </div>
  )
}
