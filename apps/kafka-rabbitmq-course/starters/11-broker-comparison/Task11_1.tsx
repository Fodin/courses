import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Task 11.1: Architectural Comparison of Brokers
// Задание 11.1: Архитектурное сравнение брокеров
// ============================================================
//
// Goal: implement an interactive comparison table of 5 brokers
// Цель: реализовать интерактивную таблицу сравнения 5 брокеров
// (Kafka, RabbitMQ, NATS, Redis Streams, Pulsar) across 7 criteria
// (Kafka, RabbitMQ, NATS, Redis Streams, Pulsar) по 7 критериям
// with detailed descriptions on row or cell click.
// с детальными описаниями при клике на строку или ячейку.

// TODO: Define the BrokerRow interface.
// TODO: Определи интерфейс BrokerRow.
// Fields: broker, model, ordering, throughput, latency, persistence,
// Поля: broker, model, ordering, throughput, latency, persistence,
// protocol, clustering (all string), color: string,
// protocol, clustering (всё string), color: string,
// and nested details: object with the same keys from model to clustering.
// и вложенный details: объект с теми же ключами от model до clustering.
// interface BrokerRow { ... }

// TODO: Declare the CRITERIA constant — a tuple of 7 strings:
// TODO: Объяви константу CRITERIA — кортеж из 7 строк:
// 'model' | 'ordering' | 'throughput' | 'latency' | 'persistence' | 'protocol' | 'clustering'
// const CRITERIA = [...] as const
// type Criterion = typeof CRITERIA[number]

// TODO: Declare the CRITERION_LABELS dictionary: Record<Criterion, string>
// TODO: Объяви словарь CRITERION_LABELS: Record<Criterion, string>
// with Russian labels: model → 'Модель', ordering → 'Ordering', etc.
// с русскими названиями: model → 'Модель', ordering → 'Ordering' и т.д.

// TODO: Fill the BROKERS array with 5 elements of type BrokerRow.
// TODO: Заполни массив BROKERS из 5 элементов типа BrokerRow.
// For each broker specify short values (e.g. throughput: '★★★★★')
// Для каждого брокера укажи краткие значения (например throughput: '★★★★★')
// and detailed descriptions in details (2-3 sentences per criterion).
// и развёрнутые описания в details (2-3 предложения для каждого критерия).
// Colors: Kafka #e74c3c, RabbitMQ #e67e22, NATS #27ae60, Redis #8e44ad, Pulsar #2980b9
// const BROKERS: BrokerRow[] = [...]

export function Task11_1() {
  const { t } = useLanguage()

  // TODO: State detailBroker: string | null — name of expanded broker
  // TODO: Состояние detailBroker: string | null — имя раскрытого брокера
  const [detailBroker, setDetailBroker] = useState<string | null>(null)

  // TODO: State detailCriterion: Criterion | null — selected criterion
  // TODO: Состояние detailCriterion: Criterion | null — выбранный критерий
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detailCriterion, setDetailCriterion] = useState<any>(null)

  // TODO: State highlightBroker: string | null — row under hover
  // TODO: Состояние highlightBroker: string | null — строка под hover
  const [highlightBroker, setHighlightBroker] = useState<string | null>(null)

  // TODO: Find selectedBroker from BROKERS by detailBroker
  // TODO: Найди selectedBroker из BROKERS по detailBroker
  // const selectedBroker = BROKERS.find(b => b.broker === detailBroker)

  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>

      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Нажмите на строку брокера или на ячейку критерия для детального объяснения.
      </p>

      {/* TODO: Comparison table.
          /* TODO: Таблица сравнения.
          - overflowX: auto for mobile
          - overflowX: auto для мобильных
          - thead: "Broker" column + CRITERIA (via map with CRITERION_LABELS)
          - thead: колонки "Брокер" + CRITERIA (через map с CRITERION_LABELS)
          - tbody: BROKERS.map(b => row with:
          - tbody: BROKERS.map(b => строка с:
              * onMouseEnter/Leave → highlightBroker
              * background from highlightBroker === b.broker
              * name cell: onClick → toggle detailBroker, arrow ▼/▲
              * ячейка имени: onClick → toggle detailBroker, стрелка ▼/▲
              * CRITERIA.map(c => value cell: onClick → setDetailBroker + setDetailCriterion)
          )
      */}
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444' }}>
              {/* TODO: Headers */}
              {/* TODO: Заголовки */}
            </tr>
          </thead>
          <tbody>
            {/* TODO: Broker rows */}
            {/* TODO: Строки брокеров */}
          </tbody>
        </table>
      </div>

      {/* TODO: Detail block for selectedBroker && (...).
          {/* TODO: Детальный блок selectedBroker && (...).
          Border with selectedBroker.color.
          Рамка цветом selectedBroker.color.
          If detailCriterion is set — show full description selectedBroker.details[detailCriterion].
          Если detailCriterion задан — показать полное описание selectedBroker.details[detailCriterion].
          If not — grid with 7 criterion tiles (preview 80 chars + click to focus).
          Если нет — grid с 7 плашками критериев (превью 80 символов + клик для фокуса).
          "Close" button → setDetailBroker(null), setDetailCriterion(null).
          Кнопка "Закрыть" → setDetailBroker(null), setDetailCriterion(null).
      */}

      {/* TODO: Legend at bottom — flex with broker names in b.color and counter "5 brokers · 7 criteria" */}
      {/* TODO: Легенда внизу — flex с именами брокеров цветом b.color и счётчиком "5 брокеров · 7 критериев" */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        padding: '0.75rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 6,
        fontSize: '0.8rem',
        color: '#aaa',
      }}>
        {/* TODO: Broker names and counter */}
        {/* TODO: Имена брокеров и счётчик */}
      </div>
    </div>
  )
}
