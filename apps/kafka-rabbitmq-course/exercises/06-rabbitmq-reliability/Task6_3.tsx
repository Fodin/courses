import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 6.3: Durable vs Transient
// Task 6.3: Durable vs Transient
// ============================================
//
// Цель: симулировать перезапуск брокера и наблюдать, какие очереди
// Goal: simulate a broker restart and observe which queues
// и сообщения выживают в зависимости от конфигурации.
// and messages survive depending on configuration.
//
// Правила выживания после перезапуска:
// Survival rules after restart:
// - Non-durable очередь: исчезает полностью вместе со всеми сообщениями
// - Non-durable queue: disappears completely along with all messages
// - Durable очередь + transient сообщение (deliveryMode=1): сообщение теряется
// - Durable queue + transient message (deliveryMode=1): message is lost
// - Durable очередь + persistent сообщение (deliveryMode=2): сообщение выживает
// - Durable queue + persistent message (deliveryMode=2): message survives

// TODO: Определи интерфейс QueueConfig:
//   Define the QueueConfig interface:
//   name: string
//   durable: boolean
//   exclusive: boolean
// interface QueueConfig { ... }

// TODO: Определи интерфейс BrokerMessage:
//   Define the BrokerMessage interface:
//   id: number
//   body: string
//   persistent: boolean        — true = deliveryMode=2, false = deliveryMode=1
//   queueName: string
//   survived: boolean | null   — null = ещё не перезапускали, true/false = результат
//   survived: boolean | null   — null = not yet restarted, true/false = result
// interface BrokerMessage { ... }

// TODO: Определи интерфейс BrokerQueue:
//   Define the BrokerQueue interface:
//   config: QueueConfig
//   messages: BrokerMessage[]
// interface BrokerQueue { ... }

// TODO: Вспомогательная функция delay(ms: number): Promise<void>
//   Helper function delay(ms: number): Promise<void>
// const delay = (ms: number) => ...

export function Task6_3() {
  const { t } = useLanguage()

  // TODO: Объяви состояния:
  //   Declare state variables:
  //   durableQueue       — boolean (true)  — настройка для объявления новой очереди
  //   durableQueue       — boolean (true)  — setting for declaring a new queue
  //   persistentMessages — boolean (true)  — настройка для публикации сообщений
  //   persistentMessages — boolean (true)  — setting for publishing messages
  //   queues             — BrokerQueue[] ([])
  //   brokerRestarted    — boolean (false)
  //   brokerOnline       — boolean (true)
  //   msgCounter         — number (0)
  //   restartLog         — string[] ([])
  const [durableQueue, setDurableQueue] = useState(true)
  const [persistentMessages, setPersistentMessages] = useState(true)
  const [queues, setQueues] = useState<string[]>([])
  const [brokerRestarted, setBrokerRestarted] = useState(false)
  const [brokerOnline, setBrokerOnline] = useState(true)
  const [msgCounter, setMsgCounter] = useState(0)
  const [restartLog, setRestartLog] = useState<string[]>([])

  // TODO: Реализуй функцию addQueue():
  //   Implement the addQueue() function:
  //   1. Определи name = durableQueue ? 'orders.durable' : 'orders.transient'
  //      Define name = durableQueue ? 'orders.durable' : 'orders.transient'
  //   2. Проверь: если queues.find(q => q.config.name === name) уже есть — return (не дублировать)
  //      Check: if queues.find(q => q.config.name === name) already exists — return (no duplicates)
  //   3. Создай config: QueueConfig { name, durable: durableQueue, exclusive: false }
  //      Create config: QueueConfig { name, durable: durableQueue, exclusive: false }
  //   4. Добавь в queues: { config, messages: [] }
  //      Add to queues: { config, messages: [] }
  //   5. Добавь в restartLog запись: `[declare] queue="${name}" durable=${durableQueue} exclusive=false`
  //      Add to restartLog: `[declare] queue="${name}" durable=${durableQueue} exclusive=false`
  const addQueue = () => {
    // TODO: реализовать
    // TODO: implement
    console.log('TODO: addQueue()')
  }

  // TODO: Реализуй функцию publishMessage(queueName: string):
  //   Implement the publishMessage(queueName: string) function:
  //   1. Если !brokerOnline — return
  //      If !brokerOnline — return
  //   2. newId = msgCounter + 1, setMsgCounter(newId)
  //   3. Создай msg: BrokerMessage {
  //      Create msg: BrokerMessage {
  //        id: newId,
  //        body: `msg-${String(newId).padStart(3, '0')}`,
  //        persistent: persistentMessages,
  //        queueName,
  //        survived: null
  //      }
  //   4. Добавь msg в messages нужной очереди через setQueues
  //      Add msg to messages of the appropriate queue via setQueues
  //   5. Добавь в restartLog: `[publish] "${msg.body}" → "${queueName}" deliveryMode=${persistentMessages ? 2 : 1} (${persistentMessages ? 'persistent' : 'transient'})`
  //      Add to restartLog: `[publish] "${msg.body}" → "${queueName}" deliveryMode=${persistentMessages ? 2 : 1} (${persistentMessages ? 'persistent' : 'transient'})`
  const publishMessage = (_queueName: string) => {
    // TODO: реализовать
    // TODO: implement
    console.log('TODO: publishMessage()')
  }

  // TODO: Реализуй async функцию restartBroker():
  //   Implement the async function restartBroker():
  //   1. Если !brokerOnline — return
  //      If !brokerOnline — return
  //   2. setBrokerOnline(false), setBrokerRestarted(false)
  //   3. Добавь в restartLog: '[broker] STOPPING...'
  //      Add to restartLog: '[broker] STOPPING...'
  //   4. await delay(800)
  //   5. Применяй правила выживания через setQueues:
  //      Apply survival rules via setQueues:
  //      - .filter(q => q.config.durable)                   — удаляем non-durable
  //      - .filter(q => q.config.durable)                   — remove non-durable
  //      - .map(q => ({ ...q, messages: q.messages
  //           .filter(m => m.persistent)                    — удаляем non-persistent
  //           .filter(m => m.persistent)                    — remove non-persistent
  //           .map(m => ({ ...m, survived: true })) }))     — помечаем выживших
  //           .map(m => ({ ...m, survived: true })) }))     — mark survivors
  //   6. await delay(400)
  //   7. setBrokerOnline(true), setBrokerRestarted(true)
  //   8. Добавь в restartLog три записи:
  //      Add three entries to restartLog:
  //      '[broker] STARTING...'
  //      '[broker] ONLINE — восстановлены только durable queues с persistent messages'
  //      '[broker] ONLINE — only durable queues with persistent messages restored'
  const restartBroker = async () => {
    // TODO: реализовать
    // TODO: implement
    console.log('TODO: restartBroker()')
  }

  // TODO: Реализуй функцию resetAll():
  //   Implement the resetAll() function:
  //   Сброси все состояния к начальным значениям
  //   Reset all state to initial values
  const resetAll = () => {
    // TODO: реализовать
    // TODO: implement
    console.log('TODO: resetAll()')
  }

  // TODO: Вычисли totalMessages — общее число сообщений во всех очередях
  //   Compute totalMessages — total number of messages across all queues
  const totalMessages = 0

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>

      {/* TODO: Статус брокера — badge вверху:
          Broker status — badge at top:
          - brokerOnline=true, brokerRestarted=false → зелёный 'ONLINE'
          - brokerOnline=true, brokerRestarted=false → green 'ONLINE'
          - brokerOnline=false → жёлтый/оранжевый 'RESTARTING...'
          - brokerOnline=false → yellow/orange 'RESTARTING...'
          - brokerOnline=true, brokerRestarted=true → синий 'ONLINE (после перезапуска)'
          - brokerOnline=true, brokerRestarted=true → blue 'ONLINE (after restart)'
      */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
        TODO: статус брокера (brokerOnline={String(brokerOnline)})
        {/* TODO: broker status (brokerOnline={String(brokerOnline)}) */}
      </div>

      {/* TODO: Панель настроек (2 колонки):
          Configuration panel (2 columns):
          Левая колонка — "Объявить очередь":
          Left column — "Declare queue":
          - Чекбокс "durable" (durableQueue)
          - Checkbox "durable" (durableQueue)
          - Псевдокод: channel.queueDeclare(name, durable, false, false, null)
          - Pseudocode: channel.queueDeclare(name, durable, false, false, null)
          - Кнопка "Объявить очередь" (onClick: addQueue)
          - Button "Declare queue" (onClick: addQueue)

          Правая колонка — "Публикация сообщений":
          Right column — "Publish messages":
          - Чекбокс "persistent (deliveryMode=2)" (persistentMessages)
          - Checkbox "persistent (deliveryMode=2)" (persistentMessages)
          - Псевдокод: channel.basicPublish("", queue, props, body)
          - Pseudocode: channel.basicPublish("", queue, props, body)
            где props.deliveryMode = persistentMessages ? 2 : 1
            where props.deliveryMode = persistentMessages ? 2 : 1
          - Для каждой очереди из queues: кнопка "→ queue.config.name"
          - For each queue from queues: button "→ queue.config.name"
            (disabled если !brokerOnline)
            (disabled if !brokerOnline)
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Объявить очередь</h3>
          {/* Declare queue */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={durableQueue}
              onChange={(e) => setDurableQueue(e.target.checked)}
            />
            durable
          </label>
          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#aaa', background: '#1e1e1e', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
            {/* TODO: показать псевдокод queueDeclare */}
            {/* TODO: show queueDeclare pseudocode */}
            TODO: channel.queueDeclare(name, {String(durableQueue)}, ...)
          </div>
          <button onClick={addQueue} style={{ padding: '0.4rem 0.9rem' }}>
            Объявить очередь
            {/* Declare queue */}
          </button>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Публикация сообщений</h3>
          {/* Publish messages */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={persistentMessages}
              onChange={(e) => setPersistentMessages(e.target.checked)}
            />
            persistent (deliveryMode={persistentMessages ? 2 : 1})
          </label>
          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#aaa', background: '#1e1e1e', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
            {/* TODO: показать псевдокод basicPublish с deliveryMode */}
            {/* TODO: show basicPublish pseudocode with deliveryMode */}
            TODO: channel.basicPublish("", queue, props, body)
          </div>
          {/* TODO: для каждой очереди — кнопка публикации */}
          {/* TODO: for each queue — publish button */}
          {queues.length === 0 ? (
            <div style={{ color: '#666', fontSize: '0.85rem' }}>Сначала объявите очередь</div>
            {/* First declare a queue */}
          ) : (
            <div style={{ color: '#666', fontSize: '0.85rem' }}>TODO: кнопки публикации для {queues.length} очередей</div>
            {/* TODO: publish buttons for {queues.length} queues */}
          )}
        </div>
      </div>

      {/* TODO: Кнопки управления (flex row):
          Control buttons (flex row):
          - "Перезапустить брокер" — disabled если !brokerOnline || totalMessages === 0
          - "Restart broker" — disabled if !brokerOnline || totalMessages === 0
            background '#d32f2f' (красный), onClick: restartBroker
            background '#d32f2f' (red), onClick: restartBroker
          - "Сброс" — onClick: resetAll
          - "Reset" — onClick: resetAll
      */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={restartBroker}
          disabled={!brokerOnline || totalMessages === 0}
          style={{ padding: '0.4rem 0.9rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Перезапустить брокер
          {/* Restart broker */}
        </button>
        <button onClick={resetAll} style={{ padding: '0.4rem 0.9rem' }}>
          Сброс
          {/* Reset */}
        </button>
      </div>

      {/* TODO: Визуализация очередей — для каждой BrokerQueue:
          Queue visualization — for each BrokerQueue:
          Блок с заголовком: имя очереди + бейдж "durable"/#2e7d32 или "transient"/#c62828
          Block with header: queue name + badge "durable"/#2e7d32 or "transient"/#c62828
          Для каждого сообщения — ячейка (min-width 60px):
          For each message — cell (min-width 60px):
          - survived === null && persistent → синяя (#42a5f5) + "P" + body
          - survived === null && persistent → blue (#42a5f5) + "P" + body
          - survived === null && !persistent → розовая (#ef9a9a) + "T" + body
          - survived === null && !persistent → pink (#ef9a9a) + "T" + body
          - survived === true → зелёная (#66bb6a) + "✓" + body
          - survived === true → green (#66bb6a) + "✓" + body
          Если очередь пуста → текст "очередь пуста"
          If queue is empty → text "queue empty"
      */}
      {queues.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Состояние брокера:</h3>
          {/* Broker state: */}
          <div style={{ color: '#666', fontSize: '0.85rem' }}>
            TODO: визуализация {queues.length} очередей с сообщениями
            {/* TODO: visualize {queues.length} queues with messages */}
          </div>
        </div>
      )}

      {/* TODO: Матрица выживания 2x2 — всегда показывать (образовательный элемент)
          Survival matrix 2x2 — always show (educational element)
          Таблица: строки = тип очереди (durable / non-durable),
          Table: rows = queue type (durable / non-durable),
                   столбцы = тип сообщения (persistent / transient)
                   columns = message type (persistent / transient)
          Ячейки:
          Cells:
          - durable + persistent → "#c8e6c9" (зелёный) + "ВЫЖИЛО"
          - durable + persistent → "#c8e6c9" (green) + "SURVIVED"
          - durable + transient  → "#fff9c4" (жёлтый) + "ПОТЕРЯНО"
          - durable + transient  → "#fff9c4" (yellow) + "LOST"
          - non-durable + любое  → "#ffcdd2" (красный) + "ПОТЕРЯНО"
          - non-durable + either → "#ffcdd2" (red) + "LOST"
      */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Матрица выживания:</h3>
        {/* Survival matrix: */}
        <div style={{ color: '#666', fontSize: '0.85rem' }}>
          TODO: таблица 2x2 (durable/non-durable × persistent/transient)
          {/* TODO: 2x2 table (durable/non-durable × persistent/transient) */}
        </div>
      </div>

      {/* TODO: Лог операций — тёмный блок, maxHeight 160px, overflowY auto
          Operations log — dark block, maxHeight 160px, overflowY auto
          fontFamily monospace, 0.75rem
          Цвет записей:
          Entry colors:
          - '[broker]' → '#ffb74d' (оранжевый)
          - '[broker]' → '#ffb74d' (orange)
          - '[declare]' → '#4fc3f7' (голубой)
          - '[declare]' → '#4fc3f7' (cyan)
          - '[publish]' → '#aaa' (серый)
          - '[publish]' → '#aaa' (gray)
          Если лог пуст → текст "Объявите очередь и опубликуйте сообщения"
          If log is empty → text "Declare a queue and publish messages"
      */}
      <div>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Лог операций:</h3>
        {/* Operations log: */}
        {restartLog.length === 0 ? (
          <div style={{ color: '#666', fontSize: '0.85rem', fontStyle: 'italic' }}>
            Объявите очередь и опубликуйте сообщения
            {/* Declare a queue and publish messages */}
          </div>
        ) : (
          <div style={{ color: '#666', fontSize: '0.8rem' }}>
            TODO: лог — {restartLog.length} записей
            {/* TODO: log — {restartLog.length} entries */}
          </div>
        )}
      </div>

      {/* Информация о brokerRestarted */}
      {/* Info about brokerRestarted */}
      {brokerRestarted && (
        <div style={{ marginTop: '1rem', background: '#1e1e1e', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#aaa' }}>
          TODO: показать итог перезапуска (сколько выжило / потеряно)
          {/* TODO: show restart summary (how many survived / lost) */}
        </div>
      )}
    </div>
  )
}
