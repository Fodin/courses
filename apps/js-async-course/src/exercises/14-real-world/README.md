# Реальные паттерны — Capstone Level

## Добро пожаловать на финальный уровень

Это capstone-уровень курса. Здесь нет одной новой концепции — здесь всё, что вы изучили, работает вместе как единая система. Три задания этого уровня — это реальные задачи, с которыми разработчики встречаются каждый день.

```mermaid
graph LR
  A["Call Stack\n(Level 0)"] --> B["Event Loop\n(Level 1)"]
  B --> C["Callbacks\n(Level 2)"]
  C --> D["Promises\n(Level 3-5)"]
  D --> E["async/await\n(Level 6)"]
  E --> F["Patterns\n(Level 7)"]
  F --> G["Generators\n(Level 8-9)"]
  G --> H["AbortController\n(Level 10)"]
  H --> I["rAF/rIC\n(Level 11)"]
  I --> J["Workers\n(Level 12-13)"]
  J --> K["Real World\n(Level 14)"]
```

## Async State Management в UI

Каждый компонент с асинхронными данными проходит через три состояния:

```js
// Классический паттерн loading/error/data
const [state, setState] = useState({ status: 'idle', data: null, error: null })

async function fetchData() {
  setState({ status: 'loading', data: null, error: null })
  try {
    const data = await getData()
    setState({ status: 'success', data, error: null })
  } catch (err) {
    setState({ status: 'error', data: null, error: err.message })
  }
}
```

💡 Используйте дискриминированные union-типы для точного state:

```ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

Это исключает невозможные состояния: не может быть одновременно `loading: true` и `error: 'something'`.

## Composition of async primitives

Настоящая сила асинхронного JavaScript — в том, как примитивы комбинируются:

```js
// retry + abort + delay = надёжный загрузчик
async function robustFetch(url, signal, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')

    if (attempt > 0) {
      // exponential backoff: 500ms, 1000ms, 2000ms
      await delay(500 * Math.pow(2, attempt - 1), signal)
    }

    try {
      const res = await fetch(url, { signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (err.name === 'AbortError') throw err    // не retry при отмене
      if (attempt === maxRetries) throw err        // исчерпали попытки
    }
  }
}
```

```js
// async pool + retry + abort = параллельный загрузчик с контролем
async function uploadAll(files, { concurrency, signal }) {
  return asyncPool(concurrency, files, (file) =>
    robustFetch('/upload', signal)  // retry встроен
  )
}
```

## Structured Concurrency: концепция

В традиционном JavaScript каждая запущенная async-операция — это "огонь и забудь". Нет гарантий, что она завершится, нет явного владельца.

**Structured Concurrency** — идея о том, что каждая async-операция имеет явный *scope* и *lifetime*:

```js
// Без structured concurrency: утечки, неотменённые операции
async function bad() {
  fetch('/api/a')  // запущено, никто не ждёт
  fetch('/api/b')  // запущено, никто не ждёт
  // функция вернулась, но запросы висят в сети
}

// С явным управлением lifetime:
async function good(signal) {
  const [a, b] = await Promise.all([
    fetch('/api/a', { signal }),  // привязано к signal
    fetch('/api/b', { signal }),
  ])
  // при отмене signal — оба запроса прерываются
}
```

`AbortController` — это наш инструмент structured concurrency в браузере. Каждая операция должна принимать `signal` и реагировать на отмену.

## Async State Machine

Конечный автомат (State Machine) + async — мощная комбинация для сложных UI-процессов:

```js
// Каждый переход — async-операция
const transitions = {
  idle: { start: 'loading' },
  loading: { success: 'confirmation', error: 'error' },
  confirmation: { confirm: 'payment', cancel: 'idle' },
  payment: { success: 'processing', error: 'error' },
  processing: { done: 'done' },
}

async function runMachine(signal) {
  let state = 'idle'
  while (state !== 'done' && state !== 'error') {
    const nextState = await performTransition(state, signal)  // с retry, таймаутом
    state = nextState
  }
  return state
}
```

⚠️ Без state machine сложный UI-поток быстро превращается в "спагетти" из флагов: `isLoading`, `isConfirming`, `isPaying`, `hasError`... Все они могут быть в противоречивых комбинациях.

## Async Generators как источники данных

Для потоков данных (WebSocket, polling, сенсоры) async generator — идеальный интерфейс:

```js
async function* pollingStream(url, intervalMs, signal) {
  while (!signal.aborted) {
    const data = await fetch(url, { signal }).then(r => r.json())
    yield data
    await sleep(intervalMs, signal)
  }
}

// Потребитель прост как for-await-of
for await (const update of pollingStream('/metrics', 1000, ctrl.signal)) {
  renderChart(update)
}
// Когда ctrl.abort() — цикл завершается чисто
```

## Best practices чеклист

✅ **Всегда обрабатывай ошибки**
```js
// Каждый await — потенциальное исключение
try {
  const data = await fetchData()
} catch (err) {
  if (err.name === 'AbortError') return  // отмена — не ошибка!
  showError(err.message)
}
```

✅ **Всегда отменяй ненужные операции**
```js
useEffect(() => {
  const ctrl = new AbortController()
  fetchData(ctrl.signal)
  return () => ctrl.abort()  // cleanup при размонтировании
}, [])
```

✅ **Ограничивай конкурентность**
```js
// Не Promise.all(files.map(upload)) — это неограниченная конкурентность
// А asyncPool(3, files, upload) — максимум 3 одновременных
```

✅ **Используй AbortController для cleanup**
```js
// Передавай signal во все async-примитивы: fetch, setTimeout, генераторы
```

✅ **Предпочитай for-await-of для потоков**
```js
// Не: generator.next() вручную
// А: for await (const item of generator) { ... }
```

✅ **Разделяй источник данных и отображение**
```js
// Источник: async generator → data
// Отображение: requestAnimationFrame → DOM update
// Это гарантирует плавный UI даже при быстром потоке данных
```

## Частые ошибки в real-world коде

❌ **Race condition в UI**: два запроса в полёте, придёт поздний — затрёт ранний результат.

```js
// Плохо:
async function search(query) {
  const results = await fetch(`/search?q=${query}`)
  setResults(results)  // может прийти после более нового запроса!
}

// Хорошо: отменять предыдущий запрос
const ctrlRef = useRef(null)
async function search(query) {
  ctrlRef.current?.abort()
  ctrlRef.current = new AbortController()
  const results = await fetch(`/search?q=${query}`, { signal: ctrlRef.current.signal })
  setResults(results)
}
```

❌ **Утечка async операций**: запустил и не отменил при размонтировании.

❌ **Неограниченная конкурентность**: `Promise.all(hugeArray.map(...))` — 1000 одновременных запросов.

❌ **Retry без backoff**: мгновенный повтор под нагрузкой только усугубляет проблему сервера.

❌ **Игнорирование AbortError как обычной ошибки**: отмена — это не ошибка, не логируй её как баг.
