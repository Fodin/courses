// ============================================
// Cheat Sheet — Real-world Async Patterns (Level 14)
// Шпаргалка: реальные паттерны асинхронного JS
// ============================================

// -----------------------------------------------
// 1. asyncPool — ограниченная конкурентность
// -----------------------------------------------

// async function asyncPool(limit, items, task) {
//   const executing = new Set()
//   for (const item of items) {
//     const p = task(item).finally(() => executing.delete(p))
//     executing.add(p)
//     if (executing.size >= limit) {
//       await Promise.race(executing)  // ждём пока освободится слот
//     }
//   }
//   await Promise.all(executing)  // ждём оставшиеся
// }

// -----------------------------------------------
// 2. Retry с exponential backoff
// -----------------------------------------------

// async function withRetry(fn, signal, maxRetries = 3) {
//   for (let attempt = 0; attempt <= maxRetries; attempt++) {
//     if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
//
//     if (attempt > 0) {
//       const delay = 500 * Math.pow(2, attempt - 1)  // 500, 1000, 2000 ms
//       await sleep(delay, signal)
//     }
//
//     try {
//       return await fn(signal)
//     } catch (err) {
//       if (err.name === 'AbortError') throw err
//       if (attempt === maxRetries) throw err
//       // иначе: следующая попытка
//     }
//   }
// }

// -----------------------------------------------
// 3. sleep с поддержкой AbortSignal
// -----------------------------------------------

// function sleep(ms, signal) {
//   return new Promise((resolve, reject) => {
//     const t = setTimeout(resolve, ms)
//     signal?.addEventListener('abort', () => {
//       clearTimeout(t)
//       reject(new DOMException('Cancelled', 'AbortError'))
//     }, { once: true })
//   })
// }

// -----------------------------------------------
// 4. AbortController иерархия
// -----------------------------------------------

// // Глобальный контроллер управляет всеми дочерними
// const globalCtrl = new AbortController()
//
// function createLinkedCtrl(parentSignal) {
//   const ctrl = new AbortController()
//   // Если parent отменён — отменить и дочерний
//   parentSignal.addEventListener('abort', () => ctrl.abort(), { once: true })
//   return ctrl
// }
//
// // Использование:
// const fileCtrl = createLinkedCtrl(globalCtrl.signal)
// globalCtrl.abort()  // отменяет и все fileCtrl

// -----------------------------------------------
// 5. Async State Machine
// -----------------------------------------------

// // Явные состояния исключают невозможные комбинации
// type OrderState = 'idle' | 'loading' | 'payment' | 'done' | 'error'
//
// const PIPELINE = ['loading', 'payment'] as const
//
// async function runMachine(setState, signal) {
//   for (const step of PIPELINE) {
//     let done = false
//     for (let attempt = 0; attempt < 3 && !done; attempt++) {
//       try {
//         setState(step)
//         await runStep(step, signal)
//         done = true
//       } catch (err) {
//         if (err.name === 'AbortError') return
//         if (attempt === 2) { setState('error'); return }
//       }
//     }
//   }
//   setState('done')
// }

// -----------------------------------------------
// 6. Async Generator как источник данных
// -----------------------------------------------

// async function* dataStream(signal) {
//   let value = 50
//   while (!signal.aborted) {
//     value = Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 10))
//     yield { value, timestamp: Date.now() }
//     await sleep(200, signal)
//   }
// }
//
// // Потребитель:
// for await (const point of dataStream(ctrl.signal)) {
//   updateChart(point)
// }
// // ctrl.abort() → цикл завершается чисто

// -----------------------------------------------
// 7. rAF + async generator — разделение ритмов
// -----------------------------------------------

// const pendingRef = { current: null }
//
// // Источник: каждые 200ms
// ;(async () => {
//   for await (const metric of metricStream(signal)) {
//     pendingRef.current = metric  // просто записываем
//   }
// })()
//
// // Отображение: каждый кадр (16ms)
// function rafLoop() {
//   if (pendingRef.current) {
//     renderMetric(pendingRef.current)
//     pendingRef.current = null
//   }
//   requestAnimationFrame(rafLoop)
// }
// requestAnimationFrame(rafLoop)

// -----------------------------------------------
// 8. Web Worker из Blob URL
// -----------------------------------------------

// const WORKER_CODE = `
//   self.onmessage = function(e) {
//     var data = e.data
//     var result = heavyCompute(data)
//     self.postMessage(result)
//   }
// `
//
// function createWorker() {
//   const blob = new Blob([WORKER_CODE], { type: 'application/javascript' })
//   const url = URL.createObjectURL(blob)
//   const worker = new Worker(url)
//   URL.revokeObjectURL(url)  // URL больше не нужен после создания Worker
//   return worker
// }

// -----------------------------------------------
// 9. FPS измерение в rAF
// -----------------------------------------------

// const fpsState = { frames: 0, lastTime: performance.now() }
//
// function rafWithFPS(onFrame, onFPS) {
//   function loop() {
//     fpsState.frames++
//     const now = performance.now()
//     if (now - fpsState.lastTime >= 1000) {
//       onFPS(fpsState.frames)
//       fpsState.frames = 0
//       fpsState.lastTime = now
//     }
//     onFrame()
//     requestAnimationFrame(loop)
//   }
//   return requestAnimationFrame(loop)
// }

// -----------------------------------------------
// 10. Cleanup паттерн в React
// -----------------------------------------------

// useEffect(() => {
//   const ctrl = new AbortController()
//   const worker = createWorker()
//   let rafId = 0
//
//   // Запустить всё
//   startPipeline(ctrl.signal, worker, (id) => { rafId = id })
//
//   // Cleanup при размонтировании или изменении deps
//   return () => {
//     ctrl.abort()           // остановить async generator
//     worker.terminate()     // убить Worker
//     cancelAnimationFrame(rafId)  // остановить rAF loop
//   }
// }, [])

export {}
