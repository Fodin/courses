import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 9.4: Consumer Rebalancing
// ============================================
//
// Goal: visualize the difference between Eager and Cooperative Sticky
// rebalancing strategies in Kafka Consumer Groups.
// The simulation shows a step-by-step event timeline.

// TODO: Define RebalanceStrategy type — union type:
// Определи тип RebalanceStrategy — union type:
// 'eager' | 'cooperative'
// type RebalanceStrategy = ...

// TODO: Define RebalanceEvent interface:
// Определи интерфейс RebalanceEvent:
//   time: number          — event timestamp in ms / временная метка события в мс
//   label: string         — event description (Russian) / описание события на русском
//   type: 'join' | 'leave' | 'stop' | 'resume' | 'assign' | 'revoke' | 'sync'
//   consumer?: string     — consumer name (optional) / имя consumer (опционально)
// interface RebalanceEvent { ... }

// TODO: Implement buildEagerTimeline(action, consumerName):
// Реализуй функцию buildEagerTimeline(action, consumerName):
// Returns an array of 6 events for Eager strategy:
// Возвращает массив из 6 событий для Eager стратегии:
// t=0:   consumer join/leave (type 'join' or 'leave')
// t=0:   consumer join/leave (тип 'join' или 'leave')
// t=100: ALL consumers stop consuming (type 'stop')
// t=100: ВСЕ consumers останавливают потребление (тип 'stop')
// t=200: Coordinator: all partitions revoked (type 'revoke')
// t=200: Coordinator: все партиции отозваны (тип 'revoke')
// t=400: Group Leader computes new distribution (type 'sync')
// t=400: Group Leader вычисляет новое распределение (тип 'sync')
// t=600: All consumers receive new partitions (type 'assign')
// t=600: Все consumers получают новые партиции (тип 'assign')
// t=700: All consumers resume consuming (type 'resume')
// t=700: Все consumers возобновляют потребление (тип 'resume')
// function buildEagerTimeline(action: 'join' | 'leave', consumerName: string): RebalanceEvent[] { ... }

// TODO: Implement buildCooperativeTimeline(action, consumerName):
// Реализуй функцию buildCooperativeTimeline(action, consumerName):
// When action === 'join' returns 5 events:
// При action === 'join' возвращает 5 событий:
// t=0:   consumer joins the group (type 'join')
// t=0:   consumer подключается к группе (тип 'join')
// t=100: Round 1: only needed partitions are revoked (type 'revoke')
// t=100: Round 1: только нужные партиции отзываются (тип 'revoke')
// t=200: Other consumers CONTINUE working (type 'resume')
// t=200: Остальные consumers ПРОДОЛЖАЮТ работу (тип 'resume')
// t=350: Round 2: new partitions assigned to new consumer (type 'assign')
// t=350: Round 2: новые партиции назначаются новому consumer (тип 'assign')
// t=450: Full group operation restored (type 'resume')
// t=450: Полноценная работа всей группы восстановлена (тип 'resume')
//
// When action === 'leave' returns 5 events:
// При action === 'leave' возвращает 5 событий:
// t=0:   consumer begins graceful shutdown (type 'leave')
// t=0:   consumer начинает graceful shutdown (тип 'leave')
// t=100: consumer voluntarily gives up its partitions (type 'revoke')
// t=100: consumer добровольно отдаёт свои партиции (тип 'revoke')
// t=200: Round 1: partitions redistributed without stopping (type 'assign')
// t=200: Round 1: партиции перераспределяются без остановки (тип 'assign')
// t=300: Other consumers did not interrupt their work (type 'resume')
// t=300: Остальные consumers не прерывали работу (тип 'resume')
// t=400: consumer completed shutdown (type 'leave')
// t=400: consumer завершил shutdown (тип 'leave')
// function buildCooperativeTimeline(action: 'join' | 'leave', consumerName: string): RebalanceEvent[] { ... }

// TODO: Define EVENT_COLORS dictionary — color for each event type:
// Определи словарь EVENT_COLORS — цвет для каждого типа события:
// join → '#a5d6a7', leave → '#f48fb1', stop → '#ff5252',
// resume → '#4fc3f7', assign → '#a5d6a7', revoke → '#ffb74d', sync → '#ce93d8'
// const EVENT_COLORS: Record<RebalanceEvent['type'], string> = { ... }

export function Task9_4() {
  const { t } = useLanguage()

  // TODO: strategy state of type RebalanceStrategy, initial 'eager'
  // Состояние strategy типа RebalanceStrategy, начально 'eager'
  const [strategy, setStrategy] = useState<string>('eager')

  // TODO: action state: 'join' | 'leave', initial 'join'
  // Состояние action: 'join' | 'leave', начально 'join'
  const [action, setAction] = useState<'join' | 'leave'>('join')

  // TODO: timeline state — array of RebalanceEvent, initially []
  // Состояние timeline — массив RebalanceEvent, начально []
  const [timeline, setTimeline] = useState<unknown[]>([])

  // TODO: playing state — active animation flag, initially false
  // Состояние playing — флаг активной анимации, начально false
  const [playing, setPlaying] = useState(false)

  // TODO: visibleCount state — how many events are shown now, initially 0
  // Состояние visibleCount — сколько событий показано сейчас, начально 0
  const [visibleCount, setVisibleCount] = useState(0)

  // TODO: Implement runSimulation():
  // Реализуй функцию runSimulation():
  // - Pick consumerName: action === 'join' → 'consumer-4', else → 'consumer-2'
  // - Выбрать consumerName: action === 'join' → 'consumer-4', иначе → 'consumer-2'
  // - Build events: strategy === 'eager' ? buildEagerTimeline(...) : buildCooperativeTimeline(...)
  // - Построить events: strategy === 'eager' ? buildEagerTimeline(...) : buildCooperativeTimeline(...)
  // - setTimeline(events), setVisibleCount(0), setPlaying(true)
  // - For each event with index idx: setTimeout(() => {
  //     setVisibleCount(idx + 1)
  //     if last: setPlaying(false)
  //   }, idx * 700)
  // - Для каждого события с индексом idx: setTimeout(() => {
  //     setVisibleCount(idx + 1)
  //     если последнее: setPlaying(false)
  //   }, idx * 700)
  const runSimulation = () => {
    // TODO: реализовать / implement
  }

  // Strategy descriptions / Описания стратегий
  const eagerDesc = 'Все consumers останавливаются ("stop-the-world"), все партиции отзываются и назначаются заново. Простой в обработке 500ms–2s. / All consumers stop ("stop-the-world"), all partitions are revoked and reassigned. 500ms–2s downtime.'
  const cooperativeDesc = 'Только необходимые партиции перераспределяются. Остальные consumers продолжают работу. Два round trip, но без полного останова. / Only needed partitions are redistributed. Other consumers continue. Two round trips, but no full stop.'

  return (
    <div className="exercise-container">
      <h2>{t('task.9.4')}</h2>

      {/* TODO: 2-column grid — strategy selection cards.
          Сетка 2 колонки — карточки выбора стратегии.
          For 'eager' and 'cooperative':
          Для 'eager' и 'cooperative':
          - border: selected → '#4fc3f7', other → '#333'
          - border: выбранная → '#4fc3f7', остальная → '#333'
          - background: selected → '#0d2137', other → '#1a1a2e'
          - background: выбранная → '#0d2137', остальная → '#1a1a2e'
          - Header: 'Eager Rebalancing' or 'Cooperative Sticky'
          - Заголовок: 'Eager Rebalancing' или 'Cooperative Sticky'
          - Description from eagerDesc / cooperativeDesc
          - Описание из eagerDesc / cooperativeDesc
          - Note for eager: "Stop-the-world: all consumers wait" (red)
          - Пометка для eager: "Stop-the-world: все consumers ждут" (красный)
          - Note for cooperative: "Incremental: minimal disruption" (green)
          - Пометка для cooperative: "Incremental: минимальное прерывание" (зелёный)
          - onClick: setStrategy(s), setTimeline([]), setVisibleCount(0) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* TODO: render strategy cards / отрисовать карточки стратегий */}
      </div>

      {/* TODO: Action selection buttons.
          Кнопки выбора действия.
          "Consumer Join" — background '#1b5e20' when active
          "Consumer Join" — background '#1b5e20' когда активна
          "Consumer Leave" — background '#7b1f1f' when active
          "Consumer Leave" — background '#7b1f1f' когда активна
          fontWeight: bold on active button
          fontWeight: bold у активной */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setAction('join')}>
          Consumer Join
        </button>
        <button onClick={() => setAction('leave')}>
          Consumer Leave
        </button>
      </div>

      {/* TODO: Launch button:
          Кнопка запуска:
          - "Run simulation" / "Simulating..." (disabled when playing)
          - "Запустить симуляцию" / "Симуляция..." (disabled при playing)
          - Calls runSimulation()
          - Вызывает runSimulation() */}
      <button onClick={runSimulation} disabled={playing} style={{ marginBottom: '1.5rem' }}>
        {playing ? 'Симуляция...' : 'Запустить симуляцию'}
      </button>

      {/* TODO: Event timeline (timeline.length > 0).
          Временная шкала событий (timeline.length > 0).
          Vertical line on the left (position absolute, 2px, background '#333').
          Вертикальная линия слева (position absolute, 2px, background '#333').
          For each event from timeline.slice(0, visibleCount):
          Для каждого события из timeline.slice(0, visibleCount):
          - Circle marker (14x14px, color from EVENT_COLORS[event.type])
          - Кружок-маркер (14x14px, цвет из EVENT_COLORS[event.type])
          - Event card:
          - Карточка события:
            * Event type uppercase: event.type.toUpperCase() (color EVENT_COLORS)
            * Тип события заглавными: event.type.toUpperCase() (цвет EVENT_COLORS)
            * Time: "t+{event.time}ms" (gray)
            * Время: "t+{event.time}ms" (серый)
            * Event text: event.label
            * Текст события: event.label */}
      {timeline.length > 0 && (
        <div style={{ position: 'relative', paddingLeft: '16px' }}>
          {/* TODO: vertical line / вертикальная линия */}
          {/* TODO: events / события */}
        </div>
      )}

      {/* TODO: Summary block — show when:
          Итоговый блок — показывать когда:
          timeline.length > 0 && visibleCount === timeline.length
          - Eager: red background (#3d1a00), border '#ff5252',
          - Eager: красный фон (#3d1a00), border '#ff5252',
            text: "Result: full consumption pause for ~{action==='join' ? 700 : 600}ms.
            With many consumers and messages this is noticeable.
            Used by default before Kafka 2.4."
            текст: "Итог: полная пауза потребления на ~{action==='join' ? 700 : 600}ms.
            При большом числе consumers и сообщений это ощутимо.
            Используется до Kafka 2.4 по умолчанию."
          - Cooperative: green background (#0d2a0d), border '#a5d6a7',
          - Cooperative: зелёный фон (#0d2a0d), border '#a5d6a7',
            text: "Result: incremental rebalancing — most consumers were not interrupted.
            CooperativeStickyAssignor (Kafka 2.4+) — recommended strategy for production."
            текст: "Итог: incremental rebalancing — большинство consumers не прерывались.
            CooperativeStickyAssignor (Kafka 2.4+) — рекомендуемая стратегия для продакшена." */}
    </div>
  )
}
