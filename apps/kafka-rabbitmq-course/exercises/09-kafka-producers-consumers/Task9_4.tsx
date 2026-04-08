import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.4: Consumer Rebalancing
// ============================================
//
// Цель: визуализировать разницу между Eager и Cooperative Sticky
// стратегиями rebalancing в Kafka Consumer Groups.
// Симуляция показывает пошаговую временную шкалу событий.

// TODO: Определи тип RebalanceStrategy — union type:
// 'eager' | 'cooperative'
// type RebalanceStrategy = ...

// TODO: Определи интерфейс RebalanceEvent:
//   time: number          — временная метка события в мс
//   label: string         — описание события на русском
//   type: 'join' | 'leave' | 'stop' | 'resume' | 'assign' | 'revoke' | 'sync'
//   consumer?: string     — имя consumer (опционально)
// interface RebalanceEvent { ... }

// TODO: Реализуй функцию buildEagerTimeline(action, consumerName):
// Возвращает массив из 6 событий для Eager стратегии:
// t=0:   consumer join/leave (тип 'join' или 'leave')
// t=100: ВСЕ consumers останавливают потребление (тип 'stop')
// t=200: Coordinator: все партиции отозваны (тип 'revoke')
// t=400: Group Leader вычисляет новое распределение (тип 'sync')
// t=600: Все consumers получают новые партиции (тип 'assign')
// t=700: Все consumers возобновляют потребление (тип 'resume')
// function buildEagerTimeline(action: 'join' | 'leave', consumerName: string): RebalanceEvent[] { ... }

// TODO: Реализуй функцию buildCooperativeTimeline(action, consumerName):
// При action === 'join' возвращает 5 событий:
// t=0:   consumer подключается к группе (тип 'join')
// t=100: Round 1: только нужные партиции отзываются (тип 'revoke')
// t=200: Остальные consumers ПРОДОЛЖАЮТ работу (тип 'resume')
// t=350: Round 2: новые партиции назначаются новому consumer (тип 'assign')
// t=450: Полноценная работа всей группы восстановлена (тип 'resume')
//
// При action === 'leave' возвращает 5 событий:
// t=0:   consumer начинает graceful shutdown (тип 'leave')
// t=100: consumer добровольно отдаёт свои партиции (тип 'revoke')
// t=200: Round 1: партиции перераспределяются без остановки (тип 'assign')
// t=300: Остальные consumers не прерывали работу (тип 'resume')
// t=400: consumer завершил shutdown (тип 'leave')
// function buildCooperativeTimeline(action: 'join' | 'leave', consumerName: string): RebalanceEvent[] { ... }

// TODO: Определи словарь EVENT_COLORS — цвет для каждого типа события:
// join → '#a5d6a7', leave → '#f48fb1', stop → '#ff5252',
// resume → '#4fc3f7', assign → '#a5d6a7', revoke → '#ffb74d', sync → '#ce93d8'
// const EVENT_COLORS: Record<RebalanceEvent['type'], string> = { ... }

export function Task9_4() {
  const { t } = useLanguage()

  // TODO: Состояние strategy типа RebalanceStrategy, начально 'eager'
  const [strategy, setStrategy] = useState<string>('eager')

  // TODO: Состояние action: 'join' | 'leave', начально 'join'
  const [action, setAction] = useState<'join' | 'leave'>('join')

  // TODO: Состояние timeline — массив RebalanceEvent, начально []
  const [timeline, setTimeline] = useState<unknown[]>([])

  // TODO: Состояние playing — флаг активной анимации, начально false
  const [playing, setPlaying] = useState(false)

  // TODO: Состояние visibleCount — сколько событий показано сейчас, начально 0
  const [visibleCount, setVisibleCount] = useState(0)

  // TODO: Реализуй функцию runSimulation():
  // - Выбрать consumerName: action === 'join' → 'consumer-4', иначе → 'consumer-2'
  // - Построить events: strategy === 'eager' ? buildEagerTimeline(...) : buildCooperativeTimeline(...)
  // - setTimeline(events), setVisibleCount(0), setPlaying(true)
  // - Для каждого события с индексом idx: setTimeout(() => {
  //     setVisibleCount(idx + 1)
  //     если последнее: setPlaying(false)
  //   }, idx * 700)
  const runSimulation = () => {
    // TODO: реализовать
  }

  // Описания стратегий
  const eagerDesc = 'Все consumers останавливаются ("stop-the-world"), все партиции отзываются и назначаются заново. Простой в обработке 500ms–2s.'
  const cooperativeDesc = 'Только необходимые партиции перераспределяются. Остальные consumers продолжают работу. Два round trip, но без полного останова.'

  return (
    <div className="exercise-container">
      <h2>{t('task.9.4')}</h2>

      {/* TODO: Сетка 2 колонки — карточки выбора стратегии.
          Для 'eager' и 'cooperative':
          - border: выбранная → '#4fc3f7', остальная → '#333'
          - background: выбранная → '#0d2137', остальная → '#1a1a2e'
          - Заголовок: 'Eager Rebalancing' или 'Cooperative Sticky'
          - Описание из eagerDesc / cooperativeDesc
          - Пометка для eager: "Stop-the-world: все consumers ждут" (красный)
          - Пометка для cooperative: "Incremental: минимальное прерывание" (зелёный)
          - onClick: setStrategy(s), setTimeline([]), setVisibleCount(0) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* TODO: отрисовать карточки стратегий */}
      </div>

      {/* TODO: Кнопки выбора действия.
          "Consumer Join" — background '#1b5e20' когда активна
          "Consumer Leave" — background '#7b1f1f' когда активна
          fontWeight: bold у активной */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setAction('join')}>
          Consumer Join
        </button>
        <button onClick={() => setAction('leave')}>
          Consumer Leave
        </button>
      </div>

      {/* TODO: Кнопка запуска:
          - "Запустить симуляцию" / "Симуляция..." (disabled при playing)
          - Вызывает runSimulation() */}
      <button onClick={runSimulation} disabled={playing} style={{ marginBottom: '1.5rem' }}>
        {playing ? 'Симуляция...' : 'Запустить симуляцию'}
      </button>

      {/* TODO: Временная шкала событий (timeline.length > 0).
          Вертикальная линия слева (position absolute, 2px, background '#333').
          Для каждого события из timeline.slice(0, visibleCount):
          - Кружок-маркер (14x14px, цвет из EVENT_COLORS[event.type])
          - Карточка события:
            * Тип события заглавными: event.type.toUpperCase() (цвет EVENT_COLORS)
            * Время: "t+{event.time}ms" (серый)
            * Текст события: event.label */}
      {timeline.length > 0 && (
        <div style={{ position: 'relative', paddingLeft: '16px' }}>
          {/* TODO: вертикальная линия */}
          {/* TODO: события */}
        </div>
      )}

      {/* TODO: Итоговый блок — показывать когда:
          timeline.length > 0 && visibleCount === timeline.length
          - Eager: красный фон (#3d1a00), border '#ff5252',
            текст: "Итог: полная пауза потребления на ~{action==='join' ? 700 : 600}ms.
            При большом числе consumers и сообщений это ощутимо.
            Используется до Kafka 2.4 по умолчанию."
          - Cooperative: зелёный фон (#0d2a0d), border '#a5d6a7',
            текст: "Итог: incremental rebalancing — большинство consumers не прерывались.
            CooperativeStickyAssignor (Kafka 2.4+) — рекомендуемая стратегия для продакшена." */}
    </div>
  )
}
