// ============================================
// Cheat Sheet — Level 10: AbortController и отмена операций
// ============================================
// Справочник по синтаксису и паттернам. Не является заданием.
// Syntax and patterns reference. Not a task.

// ---- Базовое использование / Basic usage ----

async function basicUsage() {
  const controller = new AbortController()
  const signal = controller.signal // AbortSignal

  // signal.aborted → false изначально / initially
  // signal.reason  → undefined изначально / initially

  controller.abort(new DOMException('Причина отмены', 'AbortError'))

  // signal.aborted → true
  // signal.reason  → DOMException { name: 'AbortError', message: 'Причина отмены' }
}

// ---- Отмена fetch / Cancelling fetch ----

async function cancelFetch() {
  const controller = new AbortController()

  fetch('/api/data', { signal: controller.signal })
    .then((r) => r.json())
    .then((data) => console.log(data))
    .catch((err) => {
      if (err.name === 'AbortError') {
        console.log('Запрос отменён')
      } else {
        throw err // Пробрасываем настоящие ошибки / Re-throw real errors
      }
    })

  // Отменяем запрос / Cancel the request:
  setTimeout(() => controller.abort(), 1000)
}

// ---- Отмена с причиной / Abort with reason ----

async function abortWithReason() {
  const controller = new AbortController()

  controller.signal.addEventListener('abort', () => {
    // signal.reason — то, что передали в abort() / what was passed to abort()
    console.log('Отменено по причине:', controller.signal.reason)
  })

  controller.abort('user-cancelled')        // строка / string
  // или / or:
  controller.abort(new Error('time out'))   // Error
  // или / or:
  controller.abort(new DOMException('Таймаут', 'TimeoutError'))
}

// ---- Delay с поддержкой AbortSignal / Delay with AbortSignal support ----

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true } // Автоматически снимает обработчик после первого срабатывания
    )
  })
}

// ---- AbortSignal.timeout() — встроенный таймаут ----

async function withTimeout() {
  try {
    // Без Promise.race! / No Promise.race needed!
    const response = await fetch('/api/slow', {
      signal: AbortSignal.timeout(3000), // 3 секунды / 3 seconds
    })
    return response.json()
  } catch (err) {
    const e = err as DOMException
    if (e.name === 'TimeoutError') {
      console.log('Таймаут — сервер не ответил за 3с')
    } else if (e.name === 'AbortError') {
      console.log('Отменено вручную')
    } else {
      throw err
    }
  }
}

// ---- AbortSignal.any() — составные сигналы ----

async function combinedSignals() {
  const userController = new AbortController()

  // Срабатывает при ПЕРВОМ abort из любого источника
  // Fires on FIRST abort from any source
  const combined = AbortSignal.any([
    userController.signal,
    AbortSignal.timeout(5000),
  ])

  fetch('/api/data', { signal: combined })
    .catch((err: DOMException) => {
      if (err.name === 'TimeoutError') console.log('Таймаут')
      if (err.name === 'AbortError') console.log('Ручная отмена')
    })

  // Ручная отмена / Manual cancel:
  // userController.abort()
}

// ---- addEventListener с автоудалением через signal ----

function autoRemoveListener() {
  const controller = new AbortController()

  // Обработчик удаляется автоматически при abort()
  // Handler removed automatically on abort()
  document.addEventListener('keydown', (e) => console.log(e.key), {
    signal: controller.signal,
  })

  // Вместо removeEventListener:
  controller.abort() // обработчик удалён / handler removed
}

// ---- Паттерн: передача signal через цепочку / Signal propagation ----

async function loadUserWithPosts(userId: number, signal: AbortSignal) {
  // signal передаётся во ВСЕ fetch / signal passed to ALL fetches
  const userRes = await fetch(`/api/users/${userId}`, { signal })
  const user = await userRes.json()

  // Проверяем aborted перед тяжёлой операцией / Check aborted before heavy ops
  if (signal.aborted) throw signal.reason

  const postsRes = await fetch(`/api/users/${userId}/posts`, { signal })
  const posts = await postsRes.json()

  return { user, posts }
}

// Использование / Usage:
// const ctrl = new AbortController()
// loadUserWithPosts(42, ctrl.signal).catch(err => {
//   if (err.name === 'AbortError') console.log('Отменено')
// })
// ctrl.abort()

// ---- React useEffect: правильный cleanup ----

// ПРАВИЛЬНО / CORRECT:
// useEffect(() => {
//   const controller = new AbortController()
//
//   fetch(`/search?q=${query}`, { signal: controller.signal })
//     .then(r => r.json())
//     .then(setResults)
//     .catch(err => {
//       if (err.name !== 'AbortError') setError(err)
//     })
//
//   return () => controller.abort() // cleanup!
// }, [query])

// НЕПРАВИЛЬНО / WRONG (race condition!):
// useEffect(() => {
//   fetch(`/search?q=${query}`)
//     .then(r => r.json())
//     .then(setResults) // старый ответ может перезаписать новый!
// }, [query])

// ---- Debounced search с AbortController / Debounced search ----

// useEffect(() => {
//   if (!query) { setResults([]); return }
//
//   const controller = new AbortController()
//
//   // Debounce: ждём 300мс после последнего изменения
//   const timerId = setTimeout(async () => {
//     try {
//       const res = await fetch(`/api/search?q=${query}`, {
//         signal: controller.signal,
//       })
//       setResults(await res.json())
//     } catch (err) {
//       if ((err as DOMException).name !== 'AbortError') setError(err)
//     }
//   }, 300)
//
//   return () => {
//     clearTimeout(timerId)    // отменяем debounce / cancel debounce
//     controller.abort()       // отменяем fetch / cancel fetch
//   }
// }, [query])

// ---- Паттерн: AbortController как lifetime менеджер ----

class DataService {
  private controller = new AbortController()

  async loadData(url: string) {
    return fetch(url, { signal: this.controller.signal })
  }

  subscribeToEvents(handler: EventListener) {
    // Автоудаление при dispose / Auto-remove on dispose
    window.addEventListener('resize', handler, {
      signal: this.controller.signal,
    })
  }

  dispose() {
    // Отменяет ВСЕ fetch и удаляет ВСЕ listeners
    // Cancels ALL fetches and removes ALL listeners
    this.controller.abort()
  }
}

// ---- Правила работы с AbortSignal ----

// 1. AbortSignal одноразовый — нельзя сбросить
//    AbortSignal is one-time — cannot be reset
// 2. Создавайте новый AbortController для каждой операции
//    Create new AbortController for each operation
// 3. Всегда обрабатывайте AbortError отдельно в catch
//    Always handle AbortError separately in catch
// 4. В React cleanup ВСЕГДА вызывайте controller.abort()
//    In React cleanup ALWAYS call controller.abort()
// 5. Передавайте signal вглубь цепочки — везде, где есть async-операции
//    Pass signal deep into the chain — everywhere async ops are
