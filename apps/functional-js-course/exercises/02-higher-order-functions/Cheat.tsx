// ============================================
// Cheat.tsx — Подсказки для Level 2: Функции высшего порядка
// Hints for Level 2: Higher-Order Functions
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 2 — Функции высшего порядка</h2>

      {/* Задание 2.1 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 2.1: Pipeline filter → map → reduce</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Стейт: <code>const [minPrice, setMinPrice] = useState(50)</code> и
            <code>const [discount, setDiscount] = useState(10)</code>.
          </li>
          <li>
            Stage 1 — filter:
            <code>{'const filtered = PRODUCTS.filter(p => p.price >= minPrice)'}</code>.
            Продукты не прошедшие фильтр показывать с <code>opacity: 0.5</code> и
            <code>textDecoration: 'line-through'</code>.
          </li>
          <li>
            Stage 2 — map:
            <code>{'const mapped = filtered.map(p => ({ ...p, originalPrice: p.price, price: Math.round(p.price * (1 - discount / 100)) }))'}</code>.
            Храните <code>originalPrice</code> рядом с новой ценой чтобы показать "было/стало".
          </li>
          <li>
            Stage 3 — reduce:
            <code>{'const total = mapped.reduce((acc, p) => acc + p.price, 0)'}</code>.
          </li>
          <li>
            Для ползунков используйте <code>{'<input type="range" min={0} max={1000} step={10} value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />'}</code>.
          </li>
          <li>
            В блоке кода подставляйте значения динамически:
            <code>{'.filter(p => p.price >= ' + '${minPrice})'}</code> — используйте template literal или конкатенацию.
          </li>
        </ul>
      </section>

      {/* Задание 2.2 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 2.2: createValidator HOF</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Тип Rule:
            <code>{'type Rule = { id: string; label: string; check: (v: string) => boolean; message: string }'}</code>.
          </li>
          <li>
            Реализация HOF:
            <code>{'function createValidator(rules) { return (value) => rules.filter(r => !r.check(value)).map(r => r.message) }'}</code>.
          </li>
          <li>
            Правило minLength:
            <code>{'{ id: "minLength", check: v => v.length >= 3, message: "Минимум 3 символа" }'}</code>.
          </li>
          <li>
            Для активных правил используйте <code>{'useState<Set<string>>(new Set(ALL_RULES.map(r => r.id)))'}</code>.
          </li>
          <li>
            Переключение правила:
            <code>{'setActiveRuleIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })'}</code>.
          </li>
          <li>
            Получение активных правил:
            <code>{'const activeRules = ALL_RULES.filter(r => activeRuleIds.has(r.id))'}</code>.
          </li>
          <li>
            Пересоздавайте валидатор при каждом изменении набора правил:
            вызывайте <code>createValidator(activeRules)</code> прямо при рендере или через
            <code>{'useMemo(() => createValidator(activeRules), [activeRuleIds])'}</code>.
          </li>
        </ul>
      </section>

      {/* Задание 2.3 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 2.3: Замыкания</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            createCounter — приватный count через let:
            <code>{'function createCounter(initial) { let count = initial; return { increment: () => { count++ }, decrement: () => { count-- }, reset: () => { count = initial }, getCount: () => count } }'}</code>
          </li>
          <li>
            Хранение экземпляров в React:
            <code>{'const [counterA] = useState(() => createCounter(0))'}</code> — обратите
            внимание на <code>() =&gt;</code> чтобы createCounter вызвался только один раз при инициализации.
          </li>
          <li>
            После вызова метода counter обновляйте React-стейт:
            <code>{'counterA.increment(); setCounterACount(counterA.getCount())'}</code>.
          </li>
          <li>
            createRateLimiter — внутренний массив calls хранит метки времени.
            Удаление устаревших: <code>{'while (calls.length > 0 && now - calls[0] > windowMs) { calls.shift() }'}</code>.
          </li>
          <li>
            При изменении настроек пересоздавайте лимитер:
            <code>{'setLimiter(createRateLimiter(newMax, newWindow)(() => "API response"))'}</code>.
          </li>
          <li>
            Таймстамп в читаемом виде:
            <code>{'new Date(entry.ts).toLocaleTimeString("ru-RU") + "." + String(entry.ts % 1000).padStart(3, "0")'}</code>.
          </li>
        </ul>
      </section>
    </div>
  )
}
