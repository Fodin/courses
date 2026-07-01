import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 4.2: Management UI — симулятор дашборда
// Task 4.2: Management UI — Dashboard Simulator
// ============================================
//
// Цель: воспроизвести упрощённый дашборд RabbitMQ Management UI.
// Goal: reproduce a simplified RabbitMQ Management UI dashboard.
// Включает: Overview, Queues, Connections — три вкладки.
// Includes: Overview, Queues, Connections — three tabs.
// Анимация: скорости publish/deliver обновляются каждые 1.5 секунды.
// Animation: publish/deliver rates update every 1.5 seconds.

// TODO: Определи интерфейс QueueStats:
// TODO: Define QueueStats interface:
//   name, vhost, type ('classic' | 'quorum' | 'stream')
//   state ('running' | 'idle' | 'flow')
//   messages, messagesReady, messagesUnacked: number
//   publishRate, deliverRate: number
//   consumers: number
//   memory: number (в KB / in KB)
// interface QueueStats { ... }

// TODO: Определи интерфейс ConnectionInfo:
// TODO: Define ConnectionInfo interface:
//   name, user, vhost, state, channels, sendRate, recvRate
// interface ConnectionInfo { ... }

// TODO: Создай массив INITIAL_QUEUES с 5 очередями (разные типы и состояния):
// TODO: Create INITIAL_QUEUES array with 5 queues (different types and states):
//   - orders.created (quorum, running, ~140 messages)
//   - payments.pending (quorum, running, ~7 messages)
//   - notifications.email (classic, idle, 0 messages)
//   - audit.events (stream, running, ~84000 messages)
//   - dead.letter (classic, idle, 23 messages, 0 consumers)
// const INITIAL_QUEUES: QueueStats[] = [...]

// TODO: Создай массив INITIAL_CONNECTIONS с 4 соединениями
// TODO: Create INITIAL_CONNECTIONS array with 4 connections
// const INITIAL_CONNECTIONS: ConnectionInfo[] = [...]

// TODO: Определи тип вкладки: type DashTab = 'overview' | 'queues' | 'connections'
// TODO: Define tab type: type DashTab = 'overview' | 'queues' | 'connections'

export function Task4_2() {
  const { t } = useLanguage()

  // TODO: Состояния:
  // TODO: States:
  //   queues: QueueStats[] — начальное INITIAL_QUEUES
  //   queues: QueueStats[] — initial value INITIAL_QUEUES
  //   connections: ConnectionInfo[] — начальное INITIAL_CONNECTIONS
  //   connections: ConnectionInfo[] — initial value INITIAL_CONNECTIONS
  //   activeTab: DashTab — начальная 'overview'
  //   activeTab: DashTab — initial 'overview'
  //   selectedQueue: string | null — выбранная очередь
  //   selectedQueue: string | null — selected queue
  //   tick: number — счётчик обновлений для отображения
  //   tick: number — update counter for display

  const [activeTab, setActiveTab] = useState<string>('overview')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // TODO: useEffect для анимации:
  // TODO: useEffect for animation:
  //   setInterval каждые 1500ms:
  //   setInterval every 1500ms:
  //   - Увеличь tick на 1
  //   - Increment tick by 1
  //   - Для каждой running-очереди случайно меняй publishRate и deliverRate (±4)
  //   - For each running queue, randomly change publishRate and deliverRate (±4)
  //   - Пересчитывай messages (разница publish - deliver * 0.1)
  //   - Recalculate messages (difference publish - deliver * 0.1)
  //   - idle очереди не трогай
  //   - Don't touch idle queues
  //   Не забудь clearInterval при cleanup!
  //   Don't forget clearInterval on cleanup!
  useEffect(() => {
    // TODO: реализовать анимацию / implement animation
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // TODO: Вспомогательные функции:
  // TODO: Helper functions:
  //   totalMessages = сумма всех messages
  //   totalMessages = sum of all messages
  //   totalPublish = сумма publishRate
  //   totalPublish = sum of publishRate
  //   totalDeliver = сумма deliverRate
  //   totalDeliver = sum of deliverRate

  // TODO: Компонент RateBar — горизонтальный прогресс-бар:
  // TODO: RateBar component — horizontal progress bar:
  //   props: value, max, color
  //   Отображает заполнение в % от max
  //   Displays fill as % of max
  //   Анимированный через CSS transition
  //   Animated via CSS transition

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '960px', border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>

      {/* TODO: Заголовок Management UI:
          - Оранжевый фон (#FF6600)
          - Текст: "RabbitMQ Management" + версия
          - Справа: текущее время (обновляется) */}
      {/* TODO: Management UI header:
          - Orange background (#FF6600)
          - Text: "RabbitMQ Management" + version
          - Right side: current time (updates) */}
      <div style={{ background: '#FF6600', padding: '0.6rem 1rem', color: '#fff', fontWeight: 700 }}>
        RabbitMQ Management — TODO: заголовок / header
      </div>

      {/* TODO: Вкладки — Overview, Queues, Connections:
          - Активная вкладка: оранжевая нижняя граница, жирный текст
          - Клик переключает activeTab */}
      {/* TODO: Tabs — Overview, Queues, Connections:
          - Active tab: orange bottom border, bold text
          - Click switches activeTab */}
      <div style={{ borderBottom: '1px solid #eee', padding: '0 1rem', background: '#fafafa', display: 'flex' }}>
        {['overview', 'queues', 'connections'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.4rem 1rem',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #FF6600' : '2px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 700 : 400,
              color: activeTab === tab ? '#FF6600' : '#555',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '1rem' }}>

        {/* TODO: Overview Tab:
            - 4 карточки: Queues count, Messages total, Publish/s, Deliver/s
            - Информация о ноде (disk free, memory, FD, uptime)
            - Список rate-баров для running-очередей (два бара: publish оранжевый, deliver зелёный)
        */}
        {/* TODO: Overview Tab:
            - 4 cards: Queues count, Messages total, Publish/s, Deliver/s
            - Node info (disk free, memory, FD, uptime)
            - List of rate bars for running queues (two bars: publish orange, deliver green)
        */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              {['Queues', 'Messages', 'Publish/s', 'Deliver/s'].map(label => (
                <div key={label} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ccc' }}>—</div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>{label} (TODO)</div>
                </div>
              ))}
            </div>
            <div style={{ color: '#aaa', textAlign: 'center', padding: '1rem', fontSize: '0.85rem' }}>
              TODO: node info и rate-бары / node info and rate bars
            </div>
          </div>
        )}

        {/* TODO: Queues Tab:
            - Таблица: Очередь, Тип (badge), Статус (emoji+цвет), Messages, Ready, Unacked, Publish/s, Deliver/s, Consumers
            - Клик по строке открывает панель деталей снизу
            - ⚠️ если consumers = 0
            - Тип quorum — синий badge, stream — фиолетовый, classic — серый
        */}
        {/* TODO: Queues Tab:
            - Table: Queue, Type (badge), Status (emoji+color), Messages, Ready, Unacked, Publish/s, Deliver/s, Consumers
            - Click on row opens detail panel below
            - ⚠️ if consumers = 0
            - Type quorum — blue badge, stream — purple, classic — gray
        */}
        {activeTab === 'queues' && (
          <div style={{ color: '#aaa', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
            TODO: таблица очередей с деталями / queue table with details
          </div>
        )}

        {/* TODO: Connections Tab:
            - Таблица: Соединение, Пользователь, VHost, Статус, Channels, Send/s, Recv/s
            - Итоговая строка: total connections + channels
        */}
        {/* TODO: Connections Tab:
            - Table: Connection, User, VHost, Status, Channels, Send/s, Recv/s
            - Summary row: total connections + channels
        */}
        {activeTab === 'connections' && (
          <div style={{ color: '#aaa', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
            TODO: таблица соединений / connections table
          </div>
        )}
      </div>

      {/* TODO: Footer: версия плагина + счётчик tick */}
      {/* TODO: Footer: plugin version + tick counter */}
      <div style={{ padding: '0.5rem 1rem', background: '#f9f9f9', borderTop: '1px solid #eee', fontSize: '0.75rem', color: '#aaa' }}>
        Management Plugin — TODO: footer
      </div>
    </div>
  )
}
