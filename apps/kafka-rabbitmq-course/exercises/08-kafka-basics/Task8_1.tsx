import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 8.1: Кластер Kafka — брокеры и контроллер
// ============================================
//
// Цель: реализовать интерактивную визуализацию кластера Kafka из 3 брокеров.
// Пользователь может кликать на брокеры, видеть их партиции (leader/follower, ISR),
// симулировать падение контроллера и переключаться между режимами KRaft и ZooKeeper.

// TODO: Определи интерфейс Partition:
//   id: number
//   topic: string
//   role: 'leader' | 'follower'
//   isr: boolean
// interface Partition { ... }

// TODO: Определи интерфейс Broker:
//   id: number
//   host: string
//   port: number
//   isController: boolean
//   rack: string
//   partitions: Partition[]
//   color: string
//   bgColor: string
// interface Broker { ... }

// TODO: Создай константу initialBrokers: Broker[] — массив из 3 брокеров:
//   Broker 1: kafka-1:9092, isController: true, rack: 'rack-a', color: '#1565C0', bgColor: '#E3F2FD'
//     partitions: orders[0] leader ISR, orders[1] follower ISR,
//                 payments[0] leader ISR, payments[1] follower NOT ISR
//   Broker 2: kafka-2:9092, isController: false, rack: 'rack-a', color: '#6A1B9A', bgColor: '#F3E5F5'
//     partitions: orders[1] leader ISR, orders[2] follower ISR,
//                 payments[1] leader ISR, payments[2] follower ISR
//   Broker 3: kafka-3:9092, isController: false, rack: 'rack-b', color: '#2E7D32', bgColor: '#E8F5E9'
//     partitions: orders[2] leader ISR, orders[0] follower ISR,
//                 payments[2] leader ISR, payments[0] follower ISR
// const initialBrokers: Broker[] = [...]

export function Task8_1() {
  const { t } = useLanguage()

  // TODO: Состояние selectedBroker: number | null — ID выбранного брокера
  const [selectedBroker, setSelectedBroker] = useState<number | null>(null)

  // TODO: Состояние brokers: Broker[] — инициализировать из initialBrokers
  const [brokers, setBrokers] = useState<unknown[]>([])

  // TODO: Состояние log: string[] — лог событий кластера
  const [log, setLog] = useState<string[]>([])

  // TODO: Состояние mode: 'zookeeper' | 'kraft' — режим управления кластером (по умолчанию 'kraft')
  const [mode, setMode] = useState<string>('kraft')

  // TODO: Реализуй вспомогательную функцию addLog(msg: string):
  //   - Добавляет строку `[HH:MM:SS] msg` в начало лога
  //   - Ограничивает лог 12 записями
  const addLog = (_msg: string) => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию simulateControllerFailover():
  //   1. Находит текущего контроллера (brokers.find(b => b.isController))
  //   2. Случайно выбирает нового контроллера из остальных (Math.random())
  //   3. Обновляет brokers: у нового isController: true, у остальных false
  //   4. Добавляет в лог:
  //      - `Broker-N упал. Начинается выбор нового контроллера...`
  //      - `Broker-M стал новым контроллером (KRaft Raft consensus / ZooKeeper election)`
  //   5. Если selectedBroker === упавший контроллер, переключает на нового
  const simulateControllerFailover = () => {
    // TODO: реализовать
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.8.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Кластер Apache Kafka из 3 брокеров. Кликни на брокер, чтобы увидеть его партиции.
      </p>

      {/* TODO: Кнопки переключения режима — 'kraft' | 'zookeeper'
          Активный режим: background '#1565C0', цвет '#fff', fontWeight 700
          Неактивный режим: background '#fff', цвет '#333', border '1px solid #ddd' */}

      {/* TODO: Блок кластера (background '#f8f9fa', borderRadius '12px', padding '1.25rem'):
          - Слева: блок KRaft Controller (иконка ⚙️, надпись 'KRaft Controller / built-in Raft')
            или ZooKeeper (иконка 🐘, надпись 'ZooKeeper / external cluster')
            border: '2px solid #E65100', background: '#FFF3E0'
          - Стрелка ⟷ между блоком управления и брокерами
          - Карточки брокеров: кликабельные, при клике setSelectedBroker(id)
            У контроллера: бейдж CONTROLLER в position absolute top-right,
            background '#E65100', цвет '#fff'
            Поля: иконка 🖥️, Broker-N (цвет broker.color), host:port, rack (серый), N партиций */}

      {/* TODO: Панель партиций выбранного брокера (если selectedBroker !== null):
          - Заголовок "Broker-N — партиции" цвета broker.color
          - Карточки партиций: topic[id], роль (★ Leader / ○ Follower), ISR статус (✅ ISR / ❌ Out of ISR)
          - Leader — border цвета брокера, background '#fff'
          - Follower — border '#ccc', background '#f5f5f5' */}

      {/* TODO: Кнопки действий:
          - "Симулировать падение контроллера" → simulateControllerFailover() (background '#C62828')
          - "Сбросить кластер" → setBrokers(initialBrokers) (background '#f5f5f5') */}

      {/* TODO: Информационная панель (background '#FFF8E1', border '1px solid #FFE082'):
          KRaft: 'Контроллер встроен в брокер. Используется Raft-консенсус...'
          ZooKeeper: 'ZooKeeper — внешний сервис для хранения метаданных. Устарел...' */}

      {/* TODO: Лог событий кластера (если log.length > 0):
          - Тёмный терминал (background '#0d1117', цвет '#58a6ff')
          - Кнопка "Очистить" → setLog([]) */}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: реализовать интерфейс задания
      </div>
    </div>
  )
}
