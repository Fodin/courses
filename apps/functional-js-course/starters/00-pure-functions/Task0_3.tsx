import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.3: Рефакторинг к чистоте
// Task 0.3: Refactoring to Purity
// ============================================
// Реализуйте чистую версию processOrderPure, вынеся эффекты в аргументы.
// Implement the pure version processOrderPure by moving effects to arguments.

// TODO: Опишите интерфейс Order
// TODO: Describe the Order interface
// interface Order {
//   id: string
//   items: Array<{ name: string; price: number }>
//   status: string
// }

// TODO: Опишите интерфейс ProcessedOrder (Order + total + processedAt)
// TODO: Describe the ProcessedOrder interface (Order + total + processedAt)
// interface ProcessedOrder extends Order {
//   total: number
//   processedAt: number
// }

// Нечистая версия — оставьте как есть, она нужна для сравнения
// Impure version — leave as is, needed for comparison
function processOrderImpure(order: Record<string, unknown>): Record<string, unknown> {
  const items = order['items'] as Array<{ price: number }>
  ;(order as Record<string, unknown>)['total'] = items.reduce((s, i) => s + i.price, 0)
  ;(order as Record<string, unknown>)['processedAt'] = Date.now()
  console.log(`[processOrderImpure] processed order ${order['id']}`)
  order['status'] = 'processed'
  return order
}

// TODO: Реализуйте чистую версию
// TODO: Implement the pure version
// Сигнатура / Signature:
// function processOrderPure(order: Order, now: number, logger: (msg: string) => void): ProcessedOrder
//
// Требования:
// Requirements:
// 1. Не мутируйте order — используйте spread: { ...order, total, processedAt: now, status: 'processed' }
//    Do not mutate order — use spread: { ...order, total, processedAt: now, status: 'processed' }
// 2. Вычисляйте total через reduce по order.items
//    Calculate total via reduce over order.items
// 3. Вызовите logger вместо console.log
//    Call logger instead of console.log
// 4. Используйте now вместо Date.now()
//    Use now instead of Date.now()
// function processOrderPure(...) { ... }

const SAMPLE_ORDER = {
  id: 'ORD-001',
  items: [
    { name: 'Книга по FP', price: 800 },
    { name: 'Курс TypeScript', price: 1200 },
  ],
  status: 'pending',
}

export function Task0_3() {
  const { t } = useLanguage()
  const [sideEffectLog, setSideEffectLog] = useState<string[]>([])
  const [impureResult, setImpureResult] = useState<Record<string, unknown> | null>(null)
  const [pureResult, setPureResult] = useState<Record<string, unknown> | null>(null)
  const [ran, setRan] = useState(false)

  const run = () => {
    // Запуск нечистой версии / Run impure version
    const orderForImpure: Record<string, unknown> = JSON.parse(JSON.stringify(SAMPLE_ORDER))
    const capturedLogs: string[] = []
    const originalLog = console.log
    console.log = (...args: unknown[]) => {
      capturedLogs.push(args.join(' '))
      originalLog(...args)
    }
    const impureOut = processOrderImpure(orderForImpure)
    console.log = originalLog
    setSideEffectLog(capturedLogs)
    setImpureResult(impureOut)

    // TODO: Запустите чистую версию
    // TODO: Run the pure version
    // Используйте: processOrderPure(orderForPure, 1712880000000, (msg) => pureLog.push(msg))
    // Use: processOrderPure(orderForPure, 1712880000000, (msg) => pureLog.push(msg))
    // const orderForPure = JSON.parse(JSON.stringify(SAMPLE_ORDER))
    // const pureOut = processOrderPure(orderForPure, 1712880000000, (msg) => ...)
    // setPureResult(pureOut)
    setPureResult(null) // заглушка / placeholder

    setRan(true)
  }

  const reset = () => {
    setSideEffectLog([])
    setImpureResult(null)
    setPureResult(null)
    setRan(false)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.0.3')}</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* Нечистая версия / Impure version */}
        <div style={{ flex: 1, minWidth: '220px', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <strong style={{ color: '#dc2626' }}>Нечистая версия</strong>
          <pre style={{ fontSize: '0.75rem', marginTop: '0.5rem', overflowX: 'auto' }}>
{`function processOrderImpure(order) {
  order.total = items.reduce(...) // мутация
  order.processedAt = Date.now()  // недетерм.
  console.log('processed ' + id) // эффект
  order.status = 'processed'
  return order
}`}
          </pre>
        </div>

        {/* Чистая версия — заглушка */}
        {/* Pure version — placeholder */}
        <div style={{ flex: 1, minWidth: '220px', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <strong style={{ color: '#15803d' }}>Чистая версия (реализуйте)</strong>
          <pre style={{ fontSize: '0.75rem', marginTop: '0.5rem', overflowX: 'auto' }}>
{`function processOrderPure(
  order,    // данные
  now,      // инъекция времени
  logger    // инъекция логгера
) {
  // TODO: вычислить total
  // TODO: вызвать logger
  // TODO: вернуть { ...order, ... }
}`}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={run}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.6rem 1.4rem', cursor: 'pointer', marginRight: '0.5rem' }}
        >
          Запустить
        </button>
        {ran && (
          <button
            onClick={reset}
            style={{ background: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.6rem 1.2rem', cursor: 'pointer' }}
          >
            Сброс
          </button>
        )}
      </div>

      {ran && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Анализ нечистой версии / Impure analysis */}
          <div style={{ flex: 1, minWidth: '220px', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
            <strong style={{ color: '#dc2626' }}>Нечистая: анализ</strong>
            {/* TODO: Добавьте индикаторы для трёх свойств */}
            {/* TODO: Add indicators for three properties */}
            {/* - Оригинал не мутирован? / Original not mutated? */}
            {/* - Результат детерминирован? / Result is deterministic? */}
            {/* - Нет побочных эффектов? / No side effects? */}
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {sideEffectLog.length > 0 && (
                <div>
                  <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Перехваченные логи:</div>
                  {sideEffectLog.map((line, i) => (
                    <code key={i} style={{ display: 'block', fontSize: '0.78rem', color: '#dc2626' }}>{line}</code>
                  ))}
                </div>
              )}
            </div>
            {impureResult && (
              <pre style={{ fontSize: '0.75rem', marginTop: '0.5rem', overflowX: 'auto' }}>
                {JSON.stringify(impureResult, null, 2)}
              </pre>
            )}
          </div>

          {/* Анализ чистой версии / Pure analysis */}
          <div style={{ flex: 1, minWidth: '220px', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <strong style={{ color: '#15803d' }}>Чистая: анализ</strong>
            {/* TODO: Добавьте индикаторы */}
            {/* TODO: Add indicators */}
            {pureResult ? (
              <pre style={{ fontSize: '0.75rem', marginTop: '0.5rem', overflowX: 'auto' }}>
                {JSON.stringify(pureResult, null, 2)}
              </pre>
            ) : (
              <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.85rem' }}>
                Реализуйте processOrderPure и вызовите её здесь
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
