// ============================================
// Cheat.tsx — Подсказки для Level 0: Чистые функции
// Hints for Level 0: Pure Functions
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 0 — Чистые функции</h2>

      {/* Задание 0.1 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 0.1: Чистая vs нечистая функция</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Чистая функция: <code>{'items.reduce((sum, item) => sum + item.price * item.qty, 0)'}</code>
            — только аргументы, никакого внешнего состояния
          </li>
          <li>
            Нечистая: <em>перед</em> возвратом увеличьте <code>globalDiscount += 5</code>
            и верните <code>total - globalDiscount</code>
          </li>
          <li>
            Сброс перед запуском: <code>globalDiscount = 0</code> — иначе каждое нажатие кнопки продолжит с предыдущего значения
          </li>
          <li>
            Функция <code>allSame</code>: <code>{'arr.every((v) => v === arr[0])'}</code>
          </li>
          <li>
            Для отображения галочки/крестика используйте юникод: <code>&amp;#10003;</code> (&#10003;) и <code>&amp;#10007;</code> (&#10007;)
          </li>
        </ul>
      </section>

      {/* Задание 0.2 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 0.2: Детектор побочных эффектов</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Правильные ответы: Pure — карточки 1, 5, 7. Impure — карточки 2, 3, 4, 6, 8
          </li>
          <li>
            Дефолтное значение: <code>{'guesses[card.id] ?? true'}</code> — по умолчанию все Pure
          </li>
          <li>
            Toggle: <code>{'setGuesses(prev => ({ ...prev, [id]: !prev[id] ?? false }))'}</code>
            — инвертируйте текущее значение, учитывая дефолт <code>true</code>:
            <code>{'setGuesses(prev => ({ ...prev, [id]: !(prev[id] ?? true) }))'}</code>
          </li>
          <li>
            Блокировка после проверки: в обработчике <code>toggle</code> добавьте <code>{'if (checked) return'}</code>
          </li>
          <li>
            Счётчик: <code>{'CARDS.filter(c => (guesses[c.id] ?? true) === c.isPure).length'}</code>
          </li>
        </ul>
      </section>

      {/* Задание 0.3 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 0.3: Рефакторинг к чистоте</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Сигнатура чистой функции:
            <code>{'processOrderPure(order: Order, now: number, logger: (msg: string) => void): ProcessedOrder'}</code>
          </li>
          <li>
            Вычисление total: <code>{'order.items.reduce((s, i) => s + i.price, 0)'}</code>
          </li>
          <li>
            Вызов логгера: <code>{'logger(`[processOrderPure] processed order ${order.id}`)'}</code>
          </li>
          <li>
            Возврат нового объекта:
            <code>{'return { ...order, total, processedAt: now, status: \'processed\' }'}</code>
          </li>
          <li>
            Вызов в run(): <code>{'processOrderPure(orderForPure, 1712880000000, (msg) => pureLog.push(msg))'}</code>
          </li>
          <li>
            Чтобы проверить, мутирован ли оригинал нечистой версией:
            <code>impureOut === orderForImpure</code> вернёт <code>true</code> (один объект)
          </li>
          <li>
            Перехват console.log: сохраните оригинал, переопределите, выполните функцию, восстановите
          </li>
        </ul>
      </section>
    </div>
  )
}
