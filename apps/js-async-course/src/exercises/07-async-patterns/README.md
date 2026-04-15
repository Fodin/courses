# Паттерны async/await

Async/await — это не просто синтаксический сахар. Вокруг него сложилась целая экосистема паттернов, которые решают типичные проблемы продакшн-кода: нестабильные сети, перегруженные API, гонки состояний, лавинообразные сбои.

## Retry с exponential backoff

Сеть ненадёжна. Сервер падает. Запрос иногда проваливается. Что делать? Повторить.

Но повторять с одинаковым интервалом — плохая идея: если 1000 клиентов одновременно получили ошибку и начали повторять каждые 500ms, сервер получит лавину и упадёт снова.

**Exponential backoff** — задержка растёт экспоненциально: 100ms → 200ms → 400ms → 800ms. Нагрузка на сервер размазывается по времени.

```js
async function retry(fn, maxRetries = 3, baseDelay = 300, factor = 2) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (e) {
      if (i === maxRetries) throw e
      const delay = baseDelay * Math.pow(factor, i)
      await new Promise(r => setTimeout(r, delay))
    }
  }
}
```

**Jitter** (случайная добавка ±30-50%) дополнительно рассредоточивает клиентов во времени. Netflix и AWS используют jitter по умолчанию.

> Повторяйте только **идемпотентные** операции — те, что можно безопасно выполнить несколько раз. GET всегда идемпотентен. POST с созданием заказа — нет.

## Async Pool: лимит конкурентности

Запустить 100 запросов параллельно — не всегда хорошая идея. Сервер упадёт. Браузер задушит вас лимитами на соединения. Нужен контроль конкурентности.

```js
async function asyncPool(concurrency, tasks) {
  const results = []
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const i = index++
      results[i] = await tasks[i]()
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker))
  return results
}
```

N воркеров берут задачи из очереди. Как только один освобождается — сразу берёт следующую. Аналогия: касса в супермаркете, N касс открыто, очередь общая.

## Debounce и Throttle

Поисковый инпут. Пользователь набирает "javascript" — это 10 нажатий, а нужен один запрос.

**Debounce** — ждёт паузы. Запрос уходит только через N миллисекунд после **последнего** действия. Пишете быстро — таймер сбрасывается. Остановились — запрос летит.

**Throttle** — пропускает не чаще одного раза в N миллисекунд. Прокрутка страницы с расчётом позиции — throttle на 16ms (60fps).

```js
// Debounce
function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// Throttle
function throttle(fn, delay) {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn(...args)
    }
  }
}
```

## Async Mutex: гонка состояний даже в однопоточном JS

JS однопоточный — казалось бы, race condition невозможен. Но await создаёт точки прерывания. Два `async`-процесса могут чередоваться:

```
A: read counter = 0
B: read counter = 0      <- тоже видит 0, не знает что A уже читал
A: await delay(25ms)
B: await delay(25ms)
A: write counter = 1     <- пишет 0+1 = 1
B: write counter = 1     <- пишет 0+1 = 1 (потеря обновления A!)
```

Mutex (mutual exclusion) решает это: только один код может удерживать блокировку одновременно.

```js
class AsyncMutex {
  #queue = []
  #locked = false

  async acquire() {
    if (!this.#locked) { this.#locked = true; return }
    return new Promise(resolve => this.#queue.push(resolve))
  }

  release() {
    const next = this.#queue.shift()
    if (next) next()
    else this.#locked = false
  }
}
```

## Circuit Breaker: автомат защиты

Аналогия: автоматический выключатель в щитке. Пока ток нормальный — контакты замкнуты. При перегрузке — выключатель срабатывает (размыкается). Через время — попытка снова включить.

```
CLOSED → (N ошибок подряд) → OPEN → (timeout) → HALF-OPEN → (успех) → CLOSED
                                                             → (ошибка) → OPEN
```

- **CLOSED** — всё нормально, запросы проходят
- **OPEN** — запросы отклоняются мгновенно (без ожидания таймаута сервиса)
- **HALF-OPEN** — пропускаем один пробный запрос, ждём результата

⚠️ Частые ошибки новичков

❌ Retry без лимита — бесконечный цикл при постоянных ошибках:
```js
while (true) {
  try { return await fn() } catch { await sleep(1000) }
}
```

✅ Всегда задавайте maxRetries.

❌ Параллельный запуск всего без ограничений:
```js
await Promise.all(hugeArray.map(fetchData)) // 1000 одновременных запросов
```

✅ Используйте asyncPool с разумным N (3-10).

❌ Debounce для throttle-ситуаций:
```js
// Для скролла — debounce не подходит, handler сработает только после остановки
window.addEventListener('scroll', debounce(handler, 300))
```

✅ Прокрутка → throttle. Поиск → debounce.
