import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 15.1: Проблема двойной записи (Dual Write Problem)
// Assignment 15.1: Dual Write Problem
// ============================================================
//
// Goal: implement a Dual Write Problem visualizer.
// The service makes two independent writes: to the DB and to the broker.
// Enable "fail mode" to see what happens when the broker is unavailable
// after a successful DB write — resulting in data inconsistency.

// TODO: Define the WriteStep type. // Значения: 'idle' | 'db-writing' | 'db-success' | 'broker-writing'
//         | 'broker-success' | 'broker-fail' | 'done-ok' | 'done-fail'
// type WriteStep = ...

// TODO: Define the LogEntry interface. // Поля: id: number, text: string, type: 'info' | 'success' | 'error' | 'warn'
// interface LogEntry { ... }

export function Task15_1() {
  const { t } = useLanguage()

  // TODO: Declare state: // step: WriteStep — текущий шаг анимации (начально: 'idle')
  // logs: LogEntry[] — журнал событий (начально: [])
  // dbRecords: { id: string; status: string }[] — строки в PostgreSQL (начально: [])
  // brokerMessages: string[] — сообщения в Kafka (начально: [])
  // failMode: boolean — симулировать сбой брокера (начально: false)
  // logIdRef: React.MutableRefObject<number> via useRef(0)
  const [step, setStep] = useState<any>('idle')
  const [logs, setLogs] = useState<any[]>([])
  const [dbRecords, setDbRecords] = useState<any[]>([])
  const [brokerMessages, setBrokerMessages] = useState<string[]>([])
  const [failMode, setFailMode] = useState(false)
  const logIdRef = useRef(0)

  // TODO: Implement addLog(text, type): // добавляет LogEntry в logs, автоинкремент id через logIdRef
  // const addLog = (text: string, type: LogEntry['type'] = 'info') => { ... }

  // TODO: Implement delay(ms): // возвращает Promise, который разрешается через ms миллисекунд
  // const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  // TODO: Implement runScenario:
  // 1. Generate orderId = `order-${Date.now().toString().slice(-4)}`
  // 2. Reset logs, set step to 'db-writing'
  //    addLog('[Service] Получен запрос: создать заказ {orderId}')
  //    addLog('[DB] Начало записи в orders...')
  // 3. await delay(700), set step to 'db-success'
  //    add { id: orderId, status: 'created' } to dbRecords
  //    addLog('[DB] Запись {orderId} сохранена успешно', 'success')
  // 4. await delay(500)
  // 5. If failMode === true:
  //    - set step to 'broker-fail'
  //    - addLog('[Broker] Попытка опубликовать OrderCreated...', 'info')
  //    - await delay(600)
  //    - addLog('[Broker] ОШИБКА: Connection timeout! Сообщение не отправлено', 'error')
  //    - addLog('[!] Данные рассинхронизированы: в DB есть {orderId}, в broker — нет', 'error')
  //    - addLog('[!] Downstream сервисы (email, inventory) не узнают о заказе', 'warn')
  //    - set step to 'done-fail'
  // 6. If failMode === false:
  //    - set step to 'broker-writing'
  //    - addLog('[Broker] Публикация события OrderCreated...', 'info')
  //    - await delay(600), set step to 'broker-success'
  //    - add `OrderCreated: ${orderId}` to brokerMessages
  //    - addLog('[Broker] Событие опубликовано успешно', 'success')
  //    - addLog('[!] Всё хорошо, но атомарности нет — это два разных операции', 'warn')
  //    - set step to 'done-ok'
  const runScenario = async () => {
    // TODO: implement
  }

  // TODO: Implement reset: // setStep('idle'), setLogs([]), setDbRecords([]), setBrokerMessages([])
  const reset = () => {
    // TODO: implement
  }

  // TODO: Declare logColors: Record<LogEntry['type'], string>
  // info → '#555', success → '#276749', error → '#c53030', warn → '#744210'
  // const logColors = { ... }

  // TODO: Declare logBg: Record<LogEntry['type'], string>
  // info → 'transparent', success → '#f0fff4', error → '#fff5f5', warn → '#fffaf0'
  // const logBg = { ... }

  // TODO: Declare stepColors: Record<WriteStep, string>
  // idle → '#e2e8f0', db-writing → '#ebf8ff', db-success → '#f0fff4',
  // broker-writing → '#ebf8ff', broker-success → '#f0fff4',
  // broker-fail → '#fff5f5', done-ok → '#f0fff4', done-fail → '#fff5f5'
  // const stepColors = { ... }

  return (
    <div className="exercise-container">
      <h2>{t('task.15.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Dual Write Problem — сервис делает две независимые записи: в базу данных и в брокер.
        Включи режим ошибки, чтобы увидеть, что происходит при сбое брокера.
      </p>

      {/* TODO: Diagram block (background changes with step via stepColors[step]) */}
      {/* Блок диаграммы (фон меняется с шагом через stepColors[step]) */}
      {/* Show Order Service box, two Write arrows: */}
      {/*   Write 1 → PostgreSQL (color changes by step) */}
      {/*   Write 2 → Kafka (color changes by step) */}
      {/* Checkmark ✓ or ✗ next to each node depending on step */}
      {/* At step 'done-fail': show a red inconsistency warning block */}
      {/* На шаге 'done-fail': показать красное предупреждение о рассинхронизации */}
      <div style={{
        background: '#e2e8f0', // TODO: replace with stepColors[step]
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
        transition: 'background 0.4s ease',
      }}>
        {/* TODO: implement diagram */}
      </div>

      {/* TODO: Controls row */}
      {/* Строка управления */}
      {/* Checkbox "Симулировать сбой брокера" bound to failMode */}
      {/* Checkbox "Симулировать сбой брокера" привязан к failMode */}
      {/* Button "Создать заказ" — calls runScenario, disabled during execution */}
      {/* Button "Создать заказ" — вызывает runScenario, отключён во время выполнения */}
      {/* Button "Сбросить" — calls reset */}
      {/* Button "Сбросить" — вызывает reset */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* TODO: checkbox + buttons */}
      </div>

      {/* TODO: Two storage panels side by side */}
      {/* Две панели хранилищ рядом */}
      {/* Left: PostgreSQL (orders) — blue theme, shows dbRecords or placeholder */}
      {/* Лево: PostgreSQL (orders) — синяя тема, показывает dbRecords или заглушку */}
      {/* Right: Kafka (order-events) — purple theme, shows brokerMessages or placeholder */}
      {/* Право: Kafka (order-events) — фиолетовая тема, показывает brokerMessages или заглушку */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* TODO: panels */}
      </div>

      {/* TODO: Event log — dark block, monospace */}
      {/* Журнал событий — тёмный блок, моноширинный */}
      {/* Only render if logs.length > 0 */}
      {/* Отображать только если logs.length > 0 */}
      {/* Each entry: color via logColors[entry.type], background via logBg[entry.type] */}
      {/* Каждая запись: цвет через logColors[entry.type], фон через logBg[entry.type] */}
      {logs.length > 0 && (
        <div style={{
          background: '#1a202c',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {/* TODO: render logs */}
        </div>
      )}

      {/* TODO: Warning block when step === 'done-fail' */}
      {/* Блок предупреждения при step === 'done-fail' */}
      {/* Content: "Проблема: без атомарности между DB и broker мы получаем data inconsistency.
          Email-сервис не отправит подтверждение, inventory не обновится.
          Решение — Transactional Outbox (задание 15.2)." */}
    </div>
  )
}
