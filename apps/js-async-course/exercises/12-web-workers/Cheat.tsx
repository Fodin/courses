// ============================================
// Cheat Sheet — Web Workers (Level 12)
// Шпаргалка по Web Workers
// ============================================

// -----------------------------------------------
// 1. Создание Worker через Blob URL (Inline Worker)
// -----------------------------------------------

// const workerCode = `
//   self.onmessage = function(e) {
//     var result = heavyCalc(e.data)
//     self.postMessage(result)
//   }
// `
// const blob = new Blob([workerCode], { type: 'application/javascript' })
// const url = URL.createObjectURL(blob)
// const worker = new Worker(url)
// URL.revokeObjectURL(url)  // Освободить сразу после создания Worker

// -----------------------------------------------
// 2. Коммуникация: postMessage / onmessage
// -----------------------------------------------

// // Главный поток → Worker
// worker.postMessage({ type: 'calculate', n: 42 })

// // Worker → Главный поток
// worker.onmessage = (event) => {
//   console.log('Результат:', event.data)
// }

// // Внутри worker.js
// self.onmessage = function(event) {
//   const result = doWork(event.data)
//   self.postMessage(result)
// }

// // Завершить Worker
// worker.terminate()

// -----------------------------------------------
// 3. Structured Clone — что клонируется
// -----------------------------------------------

// ✅ Клонируется:    Object, Array, Date, Map, Set, ArrayBuffer, Error
// ❌ DataCloneError: Function, DOM Node, Symbol

// // Deep clone — изменение в Worker не затрагивает оригинал
// const obj = { value: 42 }
// worker.postMessage(obj)
// // obj.value по-прежнему 42 — Worker работает с копией

// -----------------------------------------------
// 4. Transferable Objects — передача без копирования
// -----------------------------------------------

// const buffer = new ArrayBuffer(100 * 1024 * 1024) // 100 MB
// console.log(buffer.byteLength) // 104857600

// // Clone (медленно для больших данных):
// worker.postMessage({ buffer })
// console.log(buffer.byteLength) // 104857600 — оригинал цел

// // Transfer (мгновенно):
// worker.postMessage({ buffer }, [buffer])  // [buffer] — список transferables
// console.log(buffer.byteLength) // 0 — буфер передан Worker'у

// Типы, поддерживающие Transfer:
// - ArrayBuffer
// - MessagePort
// - OffscreenCanvas
// - ImageBitmap

// -----------------------------------------------
// 5. Worker Pool паттерн
// -----------------------------------------------

// class WorkerPool {
//   workers: Worker[]
//   queue: Array<{ data: unknown; resolve: (v: unknown) => void }>
//   idleWorkers: number[]
//
//   constructor(size: number, code: string) {
//     const blob = new Blob([code], { type: 'application/javascript' })
//     const url = URL.createObjectURL(blob)
//     this.workers = Array.from({ length: size }, () => new Worker(url))
//     URL.revokeObjectURL(url)
//     this.queue = []
//     this.idleWorkers = Array.from({ length: size }, (_, i) => i)
//   }
//
//   run(data: unknown): Promise<unknown> {
//     return new Promise((resolve) => {
//       const workerId = this.idleWorkers.pop()
//       if (workerId !== undefined) {
//         this.dispatch(workerId, data, resolve)
//       } else {
//         this.queue.push({ data, resolve })
//       }
//     })
//   }
//
//   dispatch(workerId: number, data: unknown, resolve: (v: unknown) => void) {
//     const worker = this.workers[workerId]
//     worker.onmessage = (e) => {
//       resolve(e.data)
//       const next = this.queue.shift()
//       if (next) {
//         this.dispatch(workerId, next.data, next.resolve)
//       } else {
//         this.idleWorkers.push(workerId)
//       }
//     }
//     worker.postMessage(data)
//   }
// }

// -----------------------------------------------
// 6. Обработка ошибок
// -----------------------------------------------

// worker.onerror = (event: ErrorEvent) => {
//   console.error('Worker error:', event.message, event.filename, event.lineno)
//   // Не прерывает Worker автоматически — нужно решать что делать
// }

// worker.onmessageerror = (event) => {
//   // Ошибка десериализации сообщения (редко)
//   console.error('Message error:', event)
// }

// -----------------------------------------------
// 7. Cleanup в React
// -----------------------------------------------

// useEffect(() => {
//   const worker = new Worker(url)
//   workerRef.current = worker
//
//   return () => {
//     worker.terminate()
//     workerRef.current = null
//   }
// }, [])

export {}
