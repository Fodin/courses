import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 6.3: Durable vs Transient
// ============================================
//
// Цель: симулировать перезапуск брокера и наблюдать, какие очереди
// и сообщения выживают в зависимости от конфигурации.
//
// Правила выживания после перезапуска:
// - Non-durable очередь: исчезает полностью вместе со всеми сообщениями
// - Durable очередь + transient сообщение (deliveryMode=1): сообщение теряется
// - Durable очередь + persistent сообщение (deliveryMode=2): сообщение выживает

// TODO: Определи интерфейс QueueConfig:
//   name: string
//   durable: boolean
//   exclusive: boolean
// interface QueueConfig { ... }

// TODO: Определи интерфейс BrokerMessage:
//   id: number
//   body: string
//   persistent: boolean        — true = deliveryMode=2, false = deliveryMode=1
//   queueName: string
//   survived: boolean | null   — null = ещё не перезапускали, true/false = результат
// interface BrokerMessage { ... }

// TODO: Определи интерфейс BrokerQueue:
//   config: QueueConfig
//   messages: BrokerMessage[]
// interface BrokerQueue { ... }

// TODO: Вспомогательная функция delay(ms: number): Promise<void>
// const delay = (ms: number) => ...

export function Task6_3() {
  const { t } = useLanguage()

  // TODO: Объяви состояния:
  //   durableQueue       — boolean (true)  — настройка для объявления новой очереди
  //   persistentMessages — boolean (true)  — настройка для публикации сообщений
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
  //   1. Определи name = durableQueue ? 'orders.durable' : 'orders.transient'
  //   2. Проверь: если queues.find(q => q.config.name === name) уже есть — return (не дублировать)
  //   3. Создай config: QueueConfig { name, durable: durableQueue, exclusive: false }
  //   4. Добавь в queues: { config, messages: [] }
  //   5. Добавь в restartLog запись: `[declare] queue="${name}" durable=${durableQueue} exclusive=false`
  const addQueue = () => {
    // TODO: реализовать
    console.log('TODO: addQueue()')
  }

  // TODO: Реализуй функцию publishMessage(queueName: string):
  //   1. Если !brokerOnline — return
  //   2. newId = msgCounter + 1, setMsgCounter(newId)
  //   3. Создай msg: BrokerMessage {
  //        id: newId,
  //        body: `msg-${String(newId).padStart(3, '0')}`,
  //        persistent: persistentMessages,
  //        queueName,
  //        survived: null
  //      }
  //   4. Добавь msg в messages нужной очереди через setQueues
  //   5. Добавь в restartLog: `[publish] "${msg.body}" → "${queueName}" deliveryMode=${persistentMessages ? 2 : 1} (${persistentMessages ? 'persistent' : 'transient'})`
  const publishMessage = (_queueName: string) => {
    // TODO: реализовать
    console.log('TODO: publishMessage()')
  }

  // TODO: Реализуй async функцию restartBroker():
  //   1. Если !brokerOnline — return
  //   2. setBrokerOnline(false), setBrokerRestarted(false)
  //   3. Добавь в restartLog: '[broker] STOPPING...'
  //   4. await delay(800)
  //   5. Применяй правила выживания через setQueues:
  //      - .filter(q => q.config.durable)                   — удаляем non-durable
  //      - .map(q => ({ ...q, messages: q.messages
  //           .filter(m => m.persistent)                    — удаляем non-persistent
  //           .map(m => ({ ...m, survived: true })) }))     — помечаем выживших
  //   6. await delay(400)
  //   7. setBrokerOnline(true), setBrokerRestarted(true)
  //   8. Добавь в restartLog три записи:
  //      '[broker] STARTING...'
  //      '[broker] ONLINE — восстановлены только durable queues с persistent messages'
  const restartBroker = async () => {
    // TODO: реализовать
    console.log('TODO: restartBroker()')
  }

  // TODO: Реализуй функцию resetAll():
  //   Сброси все состояния к начальным значениям
  const resetAll = () => {
    // TODO: реализовать
    console.log('TODO: resetAll()')
  }

  // TODO: Вычисли totalMessages — общее число сообщений во всех очередях
  const totalMessages = 0

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>

      {/* TODO: Статус брокера — badge вверху:
          - brokerOnline=true, brokerRestarted=false → зелёный 'ONLINE'
          - brokerOnline=false → жёлтый/оранжевый 'RESTARTING...'
          - brokerOnline=true, brokerRestarted=true → синий 'ONLINE (после перезапуска)'
      */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
        TODO: статус брокера (brokerOnline={String(brokerOnline)})
      </div>

      {/* TODO: Панель настроек (2 колонки):
          Левая колонка — "Объявить очередь":
          - Чекбокс "durable" (durableQueue)
          - Псевдокод: channel.queueDeclare(name, durable, false, false, null)
          - Кнопка "Объявить очередь" (onClick: addQueue)

          Правая колонка — "Публикация сообщений":
          - Чекбокс "persistent (deliveryMode=2)" (persistentMessages)
          - Псевдокод: channel.basicPublish("", queue, props, body)
            где props.deliveryMode = persistentMessages ? 2 : 1
          - Для каждой очереди из queues: кнопка "→ queue.config.name"
            (disabled если !brokerOnline)
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Объявить очередь</h3>
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
            TODO: channel.queueDeclare(name, {String(durableQueue)}, ...)
          </div>
          <button onClick={addQueue} style={{ padding: '0.4rem 0.9rem' }}>
            Объявить очередь
          </button>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Публикация сообщений</h3>
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
            TODO: channel.basicPublish("", queue, props, body)
          </div>
          {/* TODO: для каждой очереди — кнопка публикации */}
          {queues.length === 0 ? (
            <div style={{ color: '#666', fontSize: '0.85rem' }}>Сначала объявите очередь</div>
          ) : (
            <div style={{ color: '#666', fontSize: '0.85rem' }}>TODO: кнопки публикации для {queues.length} очередей</div>
          )}
        </div>
      </div>

      {/* TODO: Кнопки управления (flex row):
          - "Перезапустить брокер" — disabled если !brokerOnline || totalMessages === 0
            background '#d32f2f' (красный), onClick: restartBroker
          - "Сброс" — onClick: resetAll
      */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={restartBroker}
          disabled={!brokerOnline || totalMessages === 0}
          style={{ padding: '0.4rem 0.9rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Перезапустить брокер
        </button>
        <button onClick={resetAll} style={{ padding: '0.4rem 0.9rem' }}>
          Сброс
        </button>
      </div>

      {/* TODO: Визуализация очередей — для каждой BrokerQueue:
          Блок с заголовком: имя очереди + бейдж "durable"/#2e7d32 или "transient"/#c62828
          Для каждого сообщения — ячейка (min-width 60px):
          - survived === null && persistent → синяя (#42a5f5) + "P" + body
          - survived === null && !persistent → розовая (#ef9a9a) + "T" + body
          - survived === true → зелёная (#66bb6a) + "✓" + body
          Если очередь пуста → текст "очередь пуста"
      */}
      {queues.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Состояние брокера:</h3>
          <div style={{ color: '#666', fontSize: '0.85rem' }}>
            TODO: визуализация {queues.length} очередей с сообщениями
          </div>
        </div>
      )}

      {/* TODO: Матрица выживания 2x2 — всегда показывать (образовательный элемент)
          Таблица: строки = тип очереди (durable / non-durable),
                   столбцы = тип сообщения (persistent / transient)
          Ячейки:
          - durable + persistent → "#c8e6c9" (зелёный) + "ВЫЖИЛО"
          - durable + transient  → "#fff9c4" (жёлтый) + "ПОТЕРЯНО"
          - non-durable + любое  → "#ffcdd2" (красный) + "ПОТЕРЯНО"
      */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Матрица выживания:</h3>
        <div style={{ color: '#666', fontSize: '0.85rem' }}>
          TODO: таблица 2x2 (durable/non-durable × persistent/transient)
        </div>
      </div>

      {/* TODO: Лог операций — тёмный блок, maxHeight 160px, overflowY auto
          fontFamily monospace, 0.75rem
          Цвет записей:
          - '[broker]' → '#ffb74d' (оранжевый)
          - '[declare]' → '#4fc3f7' (голубой)
          - '[publish]' → '#aaa' (серый)
          Если лог пуст → текст "Объявите очередь и опубликуйте сообщения"
      */}
      <div>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Лог операций:</h3>
        {restartLog.length === 0 ? (
          <div style={{ color: '#666', fontSize: '0.85rem', fontStyle: 'italic' }}>
            Объявите очередь и опубликуйте сообщения
          </div>
        ) : (
          <div style={{ color: '#666', fontSize: '0.8rem' }}>
            TODO: лог — {restartLog.length} записей
          </div>
        )}
      </div>

      {/* Информация о brokerRestarted */}
      {brokerRestarted && (
        <div style={{ marginTop: '1rem', background: '#1e1e1e', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#aaa' }}>
          TODO: показать итог перезапуска (сколько выжило / потеряно)
        </div>
      )}
    </div>
  )
}
