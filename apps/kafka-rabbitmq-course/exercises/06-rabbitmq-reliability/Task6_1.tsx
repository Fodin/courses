import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 6.1: Publisher Confirms
// ============================================
//
// Цель: реализовать интерактивную визуализацию механизма Publisher Confirms.
// Publisher Confirms позволяет убедиться, что брокер получил и сохранил сообщение.
// Брокер отправляет ACK (успех) или NACK (ошибка) для каждого сообщения или батча.
//
// Три режима подтверждений:
// - individual: каждое сообщение ждёт ACK прежде чем отправить следующее
// - batch:      несколько сообщений отправляются вместе, один ACK с multiple=true
// - async:      все сообщения отправляются без ожидания, ACK приходят в callback

// TODO: Определи тип ConfirmMode — union type из трёх строковых литералов:
//   'individual' | 'batch' | 'async'
// type ConfirmMode = ...

// TODO: Определи тип MessageStatus — union type из четырёх статусов:
//   'pending' | 'sent' | 'confirmed' | 'nacked'
// type MessageStatus = ...

// TODO: Определи интерфейс PublishMessage:
//   id: number
//   body: string
//   status: MessageStatus
//   deliveryTag: number
//   timestamp: number
// interface PublishMessage { ... }

// TODO: Определи интерфейс ConfirmEvent:
//   type: 'ack' | 'nack'
//   deliveryTag: number
//   multiple: boolean
//   time: number
// interface ConfirmEvent { ... }

// TODO: Вспомогательная функция delay(ms: number): Promise<void>
//   Использует setTimeout внутри Promise
// const delay = (ms: number) => ...

// TODO: Вспомогательная функция chunk<T>(arr: T[], size: number): T[][]
//   Разбивает массив на подмассивы длиной size
// const chunk = <T,>(arr: T[], size: number): T[][] => ...

export function Task6_1() {
  const { t } = useLanguage()

  // TODO: Объяви состояния:
  //   mode           — ConfirmMode (по умолчанию 'individual')
  //   messages       — PublishMessage[] (по умолчанию [])
  //   events         — ConfirmEvent[] (по умолчанию [])
  //   isRunning      — boolean (по умолчанию false)
  //   nackProbability — number (по умолчанию 10, диапазон 0-50%)
  //   batchSize      — number (по умолчанию 5, диапазон 2-10, только для режима batch)
  const [mode, setMode] = useState('individual')
  const [messages, setMessages] = useState<string[]>([])
  const [events, setEvents] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [nackProbability, setNackProbability] = useState(10)
  const [batchSize, setBatchSize] = useState(5)

  // TODO: Объяви counterRef через useRef<number>(0)
  //   Используется как монотонно возрастающий deliveryTag
  const counterRef = useRef(0)

  // TODO: Объяви timerRef через useRef<ReturnType<typeof setTimeout> | null>(null)
  //   Используется для отмены активных таймеров
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // TODO: Реализуй функцию reset():
  //   1. Если timerRef.current — вызови clearTimeout
  //   2. Сброси: messages в [], events в [], isRunning в false
  //   3. Сброси counterRef.current = 0
  const reset = () => {
    // TODO: реализовать
    console.log('TODO: reset()')
  }

  // TODO: Реализуй async функцию publishMessages(count: number):
  //   1. Установи isRunning = true
  //   2. Создай массив newMessages: PublishMessage[] длиной count
  //      Для каждого: counterRef.current++, id = deliveryTag = counterRef.current,
  //      body = `order-${String(counter).padStart(3, '0')}`, status = 'pending'
  //   3. Добавь newMessages в конец messages (setMessages)
  //
  //   Режим INDIVIDUAL:
  //   - Для каждого сообщения по очереди:
  //     * await delay(300 + Math.random() * 200)
  //     * Определи isNack = Math.random() * 100 < nackProbability
  //     * Обнови status у этого сообщения в messages: isNack → 'nacked', иначе 'confirmed'
  //     * Добавь ConfirmEvent с multiple=false
  //
  //   Режим BATCH:
  //   - Раздели newMessages на батчи с помощью chunk(newMessages, batchSize)
  //   - Для каждого батча:
  //     * await delay(400 + Math.random() * 300)
  //     * isNack = Math.random() * 100 < nackProbability
  //     * Обнови status у всех сообщений батча
  //     * Добавь ConfirmEvent с deliveryTag = последний тег батча, multiple=true
  //
  //   Режим ASYNC:
  //   - Перемешай newMessages: [...newMessages].sort(() => Math.random() - 0.5)
  //   - Сразу обнови все как 'sent' через setMessages
  //   - Для каждого сообщения из shuffled: setTimeout с waitTime = 100 + Math.random() * 800
  //     * isNack, обнови status, добавь ConfirmEvent с multiple=false
  //
  //   4. Установи isRunning = false
  const publishMessages = async (_count: number) => {
    // TODO: реализовать
    console.log('TODO: publishMessages()')
  }

  // TODO: Добавь useEffect для очистки timerRef при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // TODO: Реализуй функцию statusColor(status: MessageStatus): string
  //   pending → '#888', sent → '#4fc3f7', confirmed → '#66bb6a', nacked → '#ef5350'
  const statusColor = (_status: string) => '#888'

  // TODO: Реализуй функцию statusLabel(status: MessageStatus): string
  //   pending → 'pending', sent → 'sent', confirmed → 'ACK', nacked → 'NACK'
  const statusLabel = (_status: string) => 'pending'

  // TODO: Вычисли confirmed, nacked, pending из массива messages
  const confirmed = 0
  const nacked = 0
  const pending = 0

  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>

      {/* TODO: Панель управления (flexbox row):
          - Select "Режим подтверждений" с тремя опциями:
            individual / batch / async
            При изменении — вызывать reset() и setMode()
          - Range "NACK вероятность: N%" от 0 до 50
          - Range "Batch size: N" от 2 до 10 — только когда mode === 'batch'
          - Кнопка "Отправить 10 сообщений" (disabled если isRunning)
          - Кнопка "Сброс"
      */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
            Режим подтверждений:
          </label>
          {/* TODO: добавить select с тремя опциями */}
          <select
            value={mode}
            onChange={(e) => { reset(); setMode(e.target.value) }}
            style={{ padding: '0.3rem 0.5rem', background: '#2d2d2d', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          >
            <option value="individual">TODO: Individual</option>
            <option value="batch">TODO: Batch</option>
            <option value="async">TODO: Async</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
            NACK вероятность: {nackProbability}%
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
          - "ACK: N" зелёным (#66bb6a)
          - "NACK: N" красным (#ef5350)
          - "In flight: N" серым (#888)
      */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <span style={{ color: '#66bb6a' }}>ACK: {confirmed}</span>
        <span style={{ color: '#ef5350' }}>NACK: {nacked}</span>
        <span style={{ color: '#888' }}>In flight: {pending}</span>
      </div>

      {/* TODO: Sequence diagram — показывать только если messages.length > 0
          Три колонки: Producer | стрелки | Broker
          - Колонка Producer: заголовок (#1565c0), для каждого сообщения строка с deliveryTag и body
          - Стрелки: для confirmed → '⟺' цветом statusColor, для nacked → '✗', для остальных → '→' серым
          - Колонка Broker: заголовок (#6a1b9a), для каждого сообщения statusLabel цветом statusColor
          Каждая строка высотой 28px.

          Пример использования: statusColor(m.status), statusLabel(m.status)
      */}
      {messages.length > 0 && (
        <div style={{ marginBottom: '1rem', color: '#aaa', fontSize: '0.85rem' }}>
          TODO: Sequence diagram (Producer → Broker)
          <br />
          <small>Сообщений: {messages.length}</small>
        </div>
      )}

      {/* TODO: Лог событий подтверждений — показывать только если events.length > 0
          Заголовок: "Confirm events ({mode}):"
          Тёмный блок с прокруткой (maxHeight 150px), fontFamily monospace
          Для каждого ConfirmEvent:
          - ACK: зелёный текст: basicAck(deliveryTag=N, multiple=false/true)
          - NACK: красный текст: basicNack(deliveryTag=N, multiple=false/true)
      */}
      {events.length > 0 && (
        <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1rem' }}>
          TODO: Лог событий confirm — events: {events.length}
        </div>
      )}

      {/* TODO: Информационный блок о текущем режиме (тёмный фон, 0.8rem):
          - individual: объяснить "1 RTT на каждое сообщение, надёжно но медленно"
          - batch: объяснить "один ACK с multiple=true, если NACK — повторить весь batch"
          - async: объяснить "все сразу без ожидания, ACK в callback, максимальная пропускная способность"

          Используй {mode} для условного рендера:
          {mode === 'individual' && <> ... </>}
      */}
      <div style={{ marginTop: '1rem', background: '#1e1e1e', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#aaa' }}>
        TODO: добавить описание текущего режима: <strong style={{ color: '#fff' }}>{mode}</strong>
      </div>
    </div>
  )
}
