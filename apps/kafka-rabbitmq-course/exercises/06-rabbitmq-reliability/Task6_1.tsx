import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 6.1: Publisher Confirms
// Task 6.1: Publisher Confirms
// ============================================
//
// Цель: реализовать интерактивную визуализацию механизма Publisher Confirms.
// Goal: implement an interactive visualization of the Publisher Confirms mechanism.
// Publisher Confirms позволяет убедиться, что брокер получил и сохранил сообщение.
// Publisher Confirms allows verifying that the broker received and stored the message.
// Брокер отправляет ACK (успех) или NACK (ошибка) для каждого сообщения или батча.
// The broker sends ACK (success) or NACK (error) for each message or batch.
//
// Три режима подтверждений:
// Three confirmation modes:
// - individual: каждое сообщение ждёт ACK прежде чем отправить следующее
// - individual: each message waits for ACK before sending the next one
// - batch:      несколько сообщений отправляются вместе, один ACK с multiple=true
// - batch:      multiple messages sent together, one ACK with multiple=true
// - async:      все сообщения отправляются без ожидания, ACK приходят в callback
// - async:      all messages sent without waiting, ACK arrives in callback

// TODO: Определи тип ConfirmMode — union type из трёх строковых литералов:
//   Define the ConfirmMode type — a union type of three string literals:
//   'individual' | 'batch' | 'async'
// type ConfirmMode = ...

// TODO: Определи тип MessageStatus — union type из четырёх статусов:
//   Define the MessageStatus type — a union type of four statuses:
//   'pending' | 'sent' | 'confirmed' | 'nacked'
// type MessageStatus = ...

// TODO: Определи интерфейс PublishMessage:
//   Define the PublishMessage interface:
//   id: number
//   body: string
//   status: MessageStatus
//   deliveryTag: number
//   timestamp: number
// interface PublishMessage { ... }

// TODO: Определи интерфейс ConfirmEvent:
//   Define the ConfirmEvent interface:
//   type: 'ack' | 'nack'
//   deliveryTag: number
//   multiple: boolean
//   time: number
// interface ConfirmEvent { ... }

// TODO: Вспомогательная функция delay(ms: number): Promise<void>
//   Helper function delay(ms: number): Promise<void>
//   Использует setTimeout внутри Promise / Uses setTimeout inside a Promise
// const delay = (ms: number) => ...

// TODO: Вспомогательная функция chunk<T>(arr: T[], size: number): T[][]
//   Helper function chunk<T>(arr: T[], size: number): T[][]
//   Разбивает массив на подмассивы длиной size / Splits array into subarrays of length size
// const chunk = <T,>(arr: T[], size: number): T[][] => ...

export function Task6_1() {
  const { t } = useLanguage()

  // TODO: Объяви состояния:
  //   Declare state variables:
  //   mode           — ConfirmMode (по умолчанию 'individual' / default 'individual')
  //   messages       — PublishMessage[] (по умолчанию [] / default [])
  //   events         — ConfirmEvent[] (по умолчанию [] / default [])
  //   isRunning      — boolean (по умолчанию false / default false)
  //   nackProbability — number (по умолчанию 10, диапазон 0-50% / default 10, range 0-50%)
  //   batchSize      — number (по умолчанию 5, диапазон 2-10, только для режима batch / default 5, range 2-10, batch mode only)
  const [mode, setMode] = useState('individual')
  const [messages, setMessages] = useState<string[]>([])
  const [events, setEvents] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [nackProbability, setNackProbability] = useState(10)
  const [batchSize, setBatchSize] = useState(5)

  // TODO: Объяви counterRef через useRef<number>(0)
  //   Declare counterRef via useRef<number>(0)
  //   Используется как монотонно возрастающий deliveryTag / Used as monotonically increasing deliveryTag
  const counterRef = useRef(0)

  // TODO: Объяви timerRef через useRef<ReturnType<typeof setTimeout> | null>(null)
  //   Declare timerRef via useRef<ReturnType<typeof setTimeout> | null>(null)
  //   Используется для отмены активных таймеров / Used to cancel active timers
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // TODO: Реализуй функцию reset():
  //   Implement the reset() function:
  //   1. Если timerRef.current — вызови clearTimeout / If timerRef.current — call clearTimeout
  //   2. Сброси: messages в [], events в [], isRunning в false / Reset: messages to [], events to [], isRunning to false
  //   3. Сброси counterRef.current = 0 / Reset counterRef.current = 0
  const reset = () => {
    // TODO: реализовать
    // TODO: implement
    console.log('TODO: reset()')
  }

  // TODO: Реализуй async функцию publishMessages(count: number):
  //   Implement the async function publishMessages(count: number):
  //   1. Установи isRunning = true / Set isRunning = true
  //   2. Создай массив newMessages: PublishMessage[] длиной count
  //      Create array newMessages: PublishMessage[] of length count
  //      Для каждого: counterRef.current++, id = deliveryTag = counterRef.current,
  //      For each: counterRef.current++, id = deliveryTag = counterRef.current,
  //      body = `order-${String(counter).padStart(3, '0')}`, status = 'pending'
  //   3. Добавь newMessages в конец messages (setMessages)
  //      Append newMessages to messages (setMessages)
  //
  //   Режим INDIVIDUAL:
  //   INDIVIDUAL mode:
  //   - Для каждого сообщения по очереди:
  //   - For each message in sequence:
  //     * await delay(300 + Math.random() * 200)
  //     * Определи isNack = Math.random() * 100 < nackProbability
  //     * Determine isNack = Math.random() * 100 < nackProbability
  //     * Обнови status у этого сообщения в messages: isNack → 'nacked', иначе 'confirmed'
  //     * Update status of this message in messages: isNack → 'nacked', otherwise 'confirmed'
  //     * Добавь ConfirmEvent с multiple=false
  //     * Add ConfirmEvent with multiple=false
  //
  //   Режим BATCH:
  //   BATCH mode:
  //   - Раздели newMessages на батчи с помощью chunk(newMessages, batchSize)
  //   - Split newMessages into batches using chunk(newMessages, batchSize)
  //   - Для каждого батча:
  //   - For each batch:
  //     * await delay(400 + Math.random() * 300)
  //     * isNack = Math.random() * 100 < nackProbability
  //     * Обнови status у всех сообщений батча
  //     * Update status of all messages in the batch
  //     * Добавь ConfirmEvent с deliveryTag = последний тег батча, multiple=true
  //     * Add ConfirmEvent with deliveryTag = last tag of batch, multiple=true
  //
  //   Режим ASYNC:
  //   ASYNC mode:
  //   - Перемешай newMessages: [...newMessages].sort(() => Math.random() - 0.5)
  //   - Shuffle newMessages: [...newMessages].sort(() => Math.random() - 0.5)
  //   - Сразу обнови все как 'sent' через setMessages
  //   - Immediately update all as 'sent' via setMessages
  //   - Для каждого сообщения из shuffled: setTimeout с waitTime = 100 + Math.random() * 800
  //   - For each message from shuffled: setTimeout with waitTime = 100 + Math.random() * 800
  //     * isNack, обнови status, добавь ConfirmEvent с multiple=false
  //     * isNack, update status, add ConfirmEvent with multiple=false
  //
  //   4. Установи isRunning = false / Set isRunning = false
  const publishMessages = async (_count: number) => {
    // TODO: реализовать
    // TODO: implement
    console.log('TODO: publishMessages()')
  }

  // TODO: Добавь useEffect для очистки timerRef при размонтировании
  //   Add useEffect to clean up timerRef on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // TODO: Реализуй функцию statusColor(status: MessageStatus): string
  //   Implement the statusColor(status: MessageStatus) function:
  //   pending → '#888', sent → '#4fc3f7', confirmed → '#66bb6a', nacked → '#ef5350'
  const statusColor = (_status: string) => '#888'

  // TODO: Реализуй функцию statusLabel(status: MessageStatus): string
  //   Implement the statusLabel(status: MessageStatus) function:
  //   pending → 'pending', sent → 'sent', confirmed → 'ACK', nacked → 'NACK'
  const statusLabel = (_status: string) => 'pending'

  // TODO: Вычисли confirmed, nacked, pending из массива messages
  //   Compute confirmed, nacked, pending from the messages array
  const confirmed = 0
  const nacked = 0
  const pending = 0

  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>

      {/* TODO: Панель управления (flexbox row):
          Control panel (flexbox row):
          - Select "Режим подтверждений" с тремя опциями:
          - Select "Confirmation mode" with three options:
            individual / batch / async
            При изменении — вызывать reset() и setMode()
            On change — call reset() and setMode()
          - Range "NACK вероятность: N%" от 0 до 50
          - Range "NACK probability: N%" from 0 to 50
          - Range "Batch size: N" от 2 до 10 — только когда mode === 'batch'
          - Range "Batch size: N" from 2 to 10 — only when mode === 'batch'
          - Кнопка "Отправить 10 сообщений" (disabled если isRunning)
          - Button "Send 10 messages" (disabled if isRunning)
          - Кнопка "Сброс"
          - Button "Reset"
      */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
            Режим подтверждений:
            {/* Confirmation mode: */}
          </label>
          {/* TODO: добавить select с тремя опциями */}
          {/* TODO: add select with three options */}
          <select
            value={mode}
            onChange={(e) => { reset(); setMode(e.target.value) }}
            style={{ padding: '0.3rem 0.5rem', background: '#2d2d2d', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          >
            <option value="individual">Individual</option>
            <option value="batch">Batch</option>
            <option value="async">Async</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
            NACK вероятность: {nackProbability}%
            {/* NACK probability: {nackProbability}% */}
          </label>
          <input
            type="range"
            min={0}
            max={50}
            value={nackProbability}
            onChange={(e) => setNackProbability(Number(e.target.value))}
            style={{ width: '120px' }}
          />
        </div>

        {/* TODO: показать блок с batchSize только когда mode === 'batch' */}
        {/* TODO: show batchSize block only when mode === 'batch' */}
        {/* Show batchSize block only when mode === 'batch' */}
        {mode === 'batch' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
              Batch size: {batchSize}
            </label>
            <input
              type="range"
              min={2}
              max={10}
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              style={{ width: '100px' }}
            />
          </div>
        )}

        <button
          onClick={() => publishMessages(10)}
          disabled={isRunning}
          style={{ padding: '0.4rem 0.9rem' }}
        >
          {isRunning ? 'Отправка...' : 'Отправить 10 сообщений'}
        </button>
        <button onClick={reset} style={{ padding: '0.4rem 0.9rem' }}>
          Сброс
        </button>
      </div>

      {/* TODO: Статистика — строка с тремя счётчиками:
          Statistics — row with three counters:
          - "ACK: N" зелёным (#66bb6a) / green (#66bb6a)
          - "NACK: N" красным (#ef5350) / red (#ef5350)
          - "In flight: N" серым (#888) / gray (#888)
      */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <span style={{ color: '#66bb6a' }}>ACK: {confirmed}</span>
        <span style={{ color: '#ef5350' }}>NACK: {nacked}</span>
        <span style={{ color: '#888' }}>In flight: {pending}</span>
      </div>

      {/* TODO: Sequence diagram — показывать только если messages.length > 0
          Sequence diagram — show only if messages.length > 0
          Три колонки: Producer | стрелки | Broker
          Three columns: Producer | arrows | Broker
          - Колонка Producer: заголовок (#1565c0), для каждого сообщения строка с deliveryTag и body
          - Producer column: header (#1565c0), for each message a row with deliveryTag and body
          - Стрелки: для confirmed → '⟺' цветом statusColor, для nacked → '✗', для остальных → '→' серым
          - Arrows: for confirmed → '⟺' with statusColor, for nacked → '✗', for rest → '→' gray
          - Колонка Broker: заголовок (#6a1b9a), для каждого сообщения statusLabel цветом statusColor
          - Broker column: header (#6a1b9a), for each message statusLabel with statusColor
          Каждая строка высотой 28px. / Each row 28px height.

          Пример использования: statusColor(m.status), statusLabel(m.status)
          Usage example: statusColor(m.status), statusLabel(m.status)
      */}
      {messages.length > 0 && (
        <div style={{ marginBottom: '1rem', color: '#aaa', fontSize: '0.85rem' }}>
          TODO: Sequence diagram (Producer → Broker)
          <br />
          <small>Сообщений: {messages.length}</small>
          {/* Messages: {messages.length} */}
        </div>
      )}

      {/* TODO: Лог событий подтверждений — показывать только если events.length > 0
          Confirmation events log — show only if events.length > 0
          Заголовок: "Confirm events ({mode}):" / Header: "Confirm events ({mode}):"
          Тёмный блок с прокруткой (maxHeight 150px), fontFamily monospace
          Dark block with scroll (maxHeight 150px), fontFamily monospace
          Для каждого ConfirmEvent:
          For each ConfirmEvent:
          - ACK: зелёный текст: basicAck(deliveryTag=N, multiple=false/true)
          - ACK: green text: basicAck(deliveryTag=N, multiple=false/true)
          - NACK: красный текст: basicNack(deliveryTag=N, multiple=false/true)
          - NACK: red text: basicNack(deliveryTag=N, multiple=false/true)
      */}
      {events.length > 0 && (
        <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1rem' }}>
          TODO: Лог событий confirm — events: {events.length}
          {/* TODO: Confirm events log — events: {events.length} */}
        </div>
      )}

      {/* TODO: Информационный блок о текущем режиме (тёмный фон, 0.8rem):
          Info block about current mode (dark background, 0.8rem):
          - individual: объяснить "1 RTT на каждое сообщение, надёжно но медленно"
          - individual: explain "1 RTT per message, reliable but slow"
          - batch: объяснить "один ACK с multiple=true, если NACK — повторить весь batch"
          - batch: explain "one ACK with multiple=true, if NACK — resend entire batch"
          - async: объяснить "все сразу без ожидания, ACK в callback, максимальная пропускная способность"
          - async: explain "all at once without waiting, ACK in callback, maximum throughput"

          Используй {mode} для условного рендера:
          Use {mode} for conditional rendering:
          {mode === 'individual' && <> ... </>}
      */}
      <div style={{ marginTop: '1rem', background: '#1e1e1e', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#aaa' }}>
        TODO: добавить описание текущего режима: <strong style={{ color: '#fff' }}>{mode}</strong>
        {/* TODO: add description of current mode: <strong style={{ color: '#fff' }}>{mode}</strong> */}
      </div>
    </div>
  )
}
