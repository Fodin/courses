// ============================================
// Cheat.tsx — Подсказки для Level 3: Каррирование
// Hints for Level 3: Currying
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 3 — Каррирование</h2>

      {/* Задание 3.1 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 3.1: Ручное каррирование</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Реализация curry через рекурсию:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`function curry(fn) {
  const arity = fn.length
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args)
    }
    return (...more) => curried(...args, ...more)
  }
}`}
            </pre>
          </li>
          <li>
            Ключ: <code>fn.length</code> даёт количество явно объявленных параметров.
            Если передано меньше — накапливаем аргументы через замыкание.
          </li>
          <li>
            Создание add3:
            <code>{'const add3 = curry((a, b, c) => a + b + c)'}</code>
          </li>
          <li>
            Для лога используйте интерфейс:
            <code>{'interface LogEntry { call: string; result: string; isFunction: boolean }'}</code>
          </li>
          <li>
            Чтобы добавить разделитель между сессиями нажатий, вставляйте запись с пустым result:
            <code>{'{ call: "--- add3(1)(2)(3) ---", result: "", isFunction: false }'}</code>
          </li>
          <li>
            Кнопка demo1 (по одному):
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const entries = [
  { call: \`add3(\${a})\`,          result: 'function', isFunction: true },
  { call: \`add3(\${a})(\${b})\`,    result: 'function', isFunction: true },
  { call: \`add3(\${a})(\${b})(\${c})\`, result: String(a+b+c), isFunction: false },
]`}
            </pre>
          </li>
        </ul>
      </section>

      {/* Задание 3.2 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 3.2: Частичное применение</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Реализация partial:
            <code>{'function partial(fn, ...presetArgs) { return (...rest) => fn(...presetArgs, ...rest) }'}</code>
          </li>
          <li>
            Типизация без any:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`function partial<T extends unknown[], R>(
  fn: (...args: T) => R,
  ...presetArgs: Partial<T>
): (...remainingArgs: unknown[]) => R {
  return (...rest) => fn(...([...presetArgs, ...rest] as T))
}`}
            </pre>
          </li>
          <li>
            Создание частично применённых функций:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const double       = partial(multiply, 2)
const addTax       = partial(multiply, 1.2)
const greetUser    = partial(greet, 'Привет')
const formatRuDate = partial(formatDate, 'ru-RU')`}
            </pre>
          </li>
          <li>
            Для расчёта addTax с округлением:
            <code>{'Math.round((addTax(Number(input)) as number) * 100) / 100'}</code>
          </li>
          <li>
            Для карточек удобно хранить входные значения в одном объекте:
            <code>{'const [inputs, setInputs] = useState({ double: "5", tax: "1000", greet: "Иван", date: "2024-01-15" })'}</code>
          </li>
          <li>
            Переключатель режимов:
            <code>{'const [mode, setMode] = useState<"partial" | "curry">("partial")'}</code>
          </li>
        </ul>
      </section>

      {/* Задание 3.3 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 3.3: Point-free конвейер</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Реализации утилит:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const prop     = key => obj => obj[key]
const filterBy = pred => arr => arr.filter(pred)
const mapWith  = fn   => arr => arr.map(fn)
const pipe     = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)`}
            </pre>
          </li>
          <li>
            TypeScript типизация prop:
            <code>{'function prop<T, K extends keyof T>(key: K): (obj: T) => T[K] { return obj => obj[key] }'}</code>
          </li>
          <li>
            Verbose результат:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const verboseResult = USERS
  .filter(u => u.active)
  .map(u => u.name)
  .sort((a, b) => a.localeCompare(b, 'ru'))`}
            </pre>
          </li>
          <li>
            Point-free результат:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const pointFreeResult = pipe(
  filterBy(prop('active')),
  mapWith(prop('name')),
  (arr) => [...arr].sort((a, b) => a.localeCompare(b, 'ru')),
)(USERS)`}
            </pre>
          </li>
          <li>
            Для визуального различия активных/неактивных:
            <code>{'style={{ opacity: user.active ? 1 : 0.4 }}'}</code>
          </li>
          <li>
            Оба результата должны быть строго равны — можно проверить через
            <code>{'JSON.stringify(verboseResult) === JSON.stringify(pointFreeResult)'}</code>
          </li>
        </ul>
      </section>
    </div>
  )
}
