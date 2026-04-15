// ============================================
// Cheat.tsx — Подсказки для Level 4: Pipe и Compose
// Hints for Level 4: Pipe and Compose
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 4 — Pipe и Compose</h2>

      {/* Задание 4.1 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 4.1: Реализация pipe и compose</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Реализация pipe (слева направо):
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)`}
            </pre>
          </li>
          <li>
            Реализация compose (справа налево):
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)`}
            </pre>
          </li>
          <li>
            Разница: единственное отличие — <code>reduce</code> vs <code>reduceRight</code>.
          </li>
          <li>
            Палитра строковых функций:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const STRING_FNS = [
  { id: 'trim',       label: 'trim',         fn: s => s.trim() },
  { id: 'toLower',    label: 'toLower',       fn: s => s.toLowerCase() },
  { id: 'toUpper',    label: 'toUpper',       fn: s => s.toUpperCase() },
  { id: 'capitalize', label: 'capitalize',    fn: s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { id: 'addExclaim', label: 'addExclaim(!)', fn: s => s + '!' },
  { id: 'getLength',  label: 'getLength',     fn: s => String(s.length) },
]`}
            </pre>
          </li>
          <li>
            Пошаговое выполнение:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const orderedIds = mode === 'pipe' ? pipeline : [...pipeline].reverse()
const fns   = orderedIds.map(id => STRING_FNS.find(f => f.id === id).fn)
const labels = orderedIds.map(id => STRING_FNS.find(f => f.id === id).label)

const results = []
let current = input
fns.forEach((fn, i) => {
  current = fn(current)
  results.push({ fnLabel: labels[i], output: current })
})`}
            </pre>
          </li>
          <li>
            Для удаления шага из pipeline по индексу:
            <code>{'setPipeline(prev => prev.filter((_, i) => i !== index))'}</code>
          </li>
          <li>
            Порядок отображения в compose — функции идут в обратном порядке к порядку добавления:
            <code>{'const displayOrder = mode === "pipe" ? pipelineLabels : [...pipelineLabels].reverse()'}</code>
          </li>
        </ul>
      </section>

      {/* Задание 4.2 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 4.2: Асинхронный pipe</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Реализация asyncPipe через for...of:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`async function asyncPipe(...fns) {
  return async (value) => {
    let acc = value
    for (const fn of fns) {
      acc = await fn(acc)
    }
    return acc
  }
}`}
            </pre>
          </li>
          <li>
            Вспомогательная функция задержки:
            <code>{'const delay = ms => new Promise(resolve => setTimeout(resolve, ms))'}</code>
          </li>
          <li>
            Шаблон async-шага с задержкой:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`async function fetchUser(id) {
  await delay(500)
  const user = USERS[id]
  if (!user) throw new Error(\`Пользователь \${id} не найден\`)
  return user
}`}
            </pre>
          </li>
          <li>
            Для визуального таймлайна обновляйте состояние шагов по одному:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`// Перед шагом
setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s))
// Функция выполняется...
acc = await stepFns[i](acc)
// После шага
setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done', result: JSON.stringify(acc).slice(0, 50) } : s))`}
            </pre>
          </li>
          <li>
            Для предотвращения гонок при повторном нажатии используйте runId:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const runIdRef = useRef(0)
const runId = ++runIdRef.current
// В каждом шаге проверяйте:
if (runIdRef.current !== runId) return`}
            </pre>
          </li>
          <li>
            Шаг с ошибкой — найдите running шаг и поставьте ему 'error':
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`} catch (e) {
  setError(e.message)
  setSteps(prev => {
    const idx = prev.findIndex(s => s.status === 'running')
    return prev.map((s, i) => i === idx ? { ...s, status: 'error' } : s)
  })
}`}
            </pre>
          </li>
        </ul>
      </section>

      {/* Задание 4.3 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 4.3: Builder через pipe</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Тип ConfigStep:
            <code>{'type ConfigStep = (cfg: AppConfig) => AppConfig'}</code>
          </li>
          <li>
            Пример функции-шага с иммутабельным spread:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`function withDatabase(type) {
  return (cfg) => ({
    ...cfg,
    db: {
      type,
      host: type === 'sqlite' ? ':memory:' : 'localhost',
      port: type === 'postgres' ? 5432 : type === 'mysql' ? 3306 : 0,
    },
  })
}`}
            </pre>
          </li>
          <li>
            Вычисление промежуточных конфигов:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const intermediateConfigs = [{}]
let current = {}
for (const step of enabledSteps) {
  current = step.build(step.param)(current)
  intermediateConfigs.push({ ...current })
}
const finalConfig = current`}
            </pre>
          </li>
          <li>
            Для hover-визуализации промежуточного состояния:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const [highlightedStep, setHighlightedStep] = useState(null)

const displayedConfig = highlightedStep !== null
  ? intermediateConfigs[highlightedStep + 1]
  : finalConfig`}
            </pre>
          </li>
          <li>
            Генерация кода пайплайна:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const generatedCode = \`const config = pipe(
\${enabledSteps.map(s => \`  \${s.label}(\${JSON.stringify(s.param)}),\`).join('\\n')}
)({})\``}
            </pre>
          </li>
          <li>
            Секции добавленные шагом — сравниваем ключи до и после:
            <pre style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto' }}>
{`const added = Object.keys(intermediateConfigs[i + 1])
  .filter(k => !Object.keys(intermediateConfigs[i]).includes(k))`}
            </pre>
          </li>
        </ul>
      </section>
    </div>
  )
}
