import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 11.1: Архитектурное сравнение брокеров
// ============================================================
//
// Цель: реализовать интерактивную таблицу сравнения 5 брокеров
// (Kafka, RabbitMQ, NATS, Redis Streams, Pulsar) по 7 критериям
// с детальными описаниями при клике на строку или ячейку.

// TODO: Определи интерфейс BrokerRow.
// Поля: broker, model, ordering, throughput, latency, persistence,
// protocol, clustering (всё string), color: string,
// и вложенный details: объект с теми же ключами от model до clustering.
// interface BrokerRow { ... }

// TODO: Объяви константу CRITERIA — кортеж из 7 строк:
// 'model' | 'ordering' | 'throughput' | 'latency' | 'persistence' | 'protocol' | 'clustering'
// const CRITERIA = [...] as const
// type Criterion = typeof CRITERIA[number]

// TODO: Объяви словарь CRITERION_LABELS: Record<Criterion, string>
// с русскими названиями: model → 'Модель', ordering → 'Ordering' и т.д.

// TODO: Заполни массив BROKERS из 5 элементов типа BrokerRow.
// Для каждого брокера укажи краткие значения (например throughput: '★★★★★')
// и развёрнутые описания в details (2-3 предложения для каждого критерия).
// Цвета: Kafka #e74c3c, RabbitMQ #e67e22, NATS #27ae60, Redis #8e44ad, Pulsar #2980b9
// const BROKERS: BrokerRow[] = [...]

export function Task11_1() {
  const { t } = useLanguage()

  // TODO: Состояние detailBroker: string | null — имя раскрытого брокера
  const [detailBroker, setDetailBroker] = useState<string | null>(null)

  // TODO: Состояние detailCriterion: Criterion | null — выбранный критерий
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detailCriterion, setDetailCriterion] = useState<any>(null)

  // TODO: Состояние highlightBroker: string | null — строка под hover
  const [highlightBroker, setHighlightBroker] = useState<string | null>(null)

  // TODO: Найди selectedBroker из BROKERS по detailBroker
  // const selectedBroker = BROKERS.find(b => b.broker === detailBroker)

  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>

      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Нажмите на строку брокера или на ячейку критерия для детального объяснения.
      </p>

      {/* TODO: Таблица сравнения.
          - overflowX: auto для мобильных
          - thead: колонки "Брокер" + CRITERIA (через map с CRITERION_LABELS)
          - tbody: BROKERS.map(b => строка с:
              * onMouseEnter/Leave → highlightBroker
              * background из highlightBroker === b.broker
              * ячейка имени: onClick → toggle detailBroker, стрелка ▼/▲
              * CRITERIA.map(c => ячейка значения: onClick → setDetailBroker + setDetailCriterion)
          )
      */}
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444' }}>
              {/* TODO: Заголовки */}
            </tr>
          </thead>
          <tbody>
            {/* TODO: Строки брокеров */}
          </tbody>
        </table>
      </div>

      {/* TODO: Детальный блок selectedBroker && (...).
          Рамка цветом selectedBroker.color.
          Если detailCriterion задан — показать полное описание selectedBroker.details[detailCriterion].
          Если нет — grid с 7 плашками критериев (превью 80 символов + клик для фокуса).
          Кнопка "Закрыть" → setDetailBroker(null), setDetailCriterion(null).
      */}

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
        {/* TODO: Имена брокеров и счётчик */}
      </div>
    </div>
  )
}
