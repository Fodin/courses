// ============================================
// Cheat Sheet — SharedArrayBuffer & Atomics (Level 13)
// Шпаргалка по SharedArrayBuffer и Atomics
// ============================================

// -----------------------------------------------
// 1. Создание и разделение SharedArrayBuffer
// -----------------------------------------------

// // Создать SAB на 32 байта (8 Int32 ячеек)
// const sab = new SharedArrayBuffer(8 * 4)
// const arr = new Int32Array(sab)

// // Передать в Worker — не копируется, а разделяется!
// worker.postMessage({ sab })

// // Внутри Worker:
// self.onmessage = function(e) {
//   const arr = new Int32Array(e.data.sab)
//   // arr смотрит на ту же память что и в главном потоке
// }

// -----------------------------------------------
// 2. Основные операции Atomics
// -----------------------------------------------

// // Атомарное чтение — гарантированно свежее значение
// const val = Atomics.load(arr, 0)

// // Атомарная запись
// Atomics.store(arr, 0, 42)

// // Атомарный инкремент — возвращает СТАРОЕ значение
// const old = Atomics.add(arr, 0, 1)   // old = arr[0], потом arr[0] += 1

// // Другие арифметические операции
// Atomics.sub(arr, 0, 5)   // arr[0] -= 5
// Atomics.and(arr, 0, 0xFF) // arr[0] &= 0xFF
// Atomics.or(arr, 0, 0x01)  // arr[0] |= 0x01
// Atomics.xor(arr, 0, 0x0F) // arr[0] ^= 0x0F

// -----------------------------------------------
// 3. compareExchange — основа Lock-free алгоритмов
// -----------------------------------------------

// // "Если arr[0] === expectedValue, записать newValue, вернуть старое"
// const UNLOCKED = 0, LOCKED = 1
// const result = Atomics.compareExchange(lock, 0, UNLOCKED, LOCKED)
// const acquired = result === UNLOCKED  // true — лок захвачен

// // Spinlock acquire:
// while (Atomics.compareExchange(lock, 0, UNLOCKED, LOCKED) !== UNLOCKED) {
//   // busy wait
// }

// // Spinlock release:
// Atomics.store(lock, 0, UNLOCKED)
// Atomics.notify(lock, 0, 1)  // разбудить одного ждущего

// -----------------------------------------------
// 4. wait / waitAsync / notify
// -----------------------------------------------

// // В Worker (блокирующий wait):
// const outcome = Atomics.wait(arr, 0, 0, 5000)  // ждём пока arr[0] !== 0, таймаут 5с
// // outcome: 'ok' | 'not-equal' | 'timed-out'

// // В главном потоке или Worker (неблокирующий):
// const result = Atomics.waitAsync(arr, 0, 0)
// if (!result.async) {
//   // result.value === 'not-equal' — значение уже изменилось
//   consumeData()
// } else {
//   result.value.then(outcome => {
//     if (outcome === 'ok') consumeData()
//   })
// }

// // Разбудить ждущих:
// Atomics.notify(arr, 0, 1)        // разбудить 1
// Atomics.notify(arr, 0, Infinity) // разбудить всех

// -----------------------------------------------
// 5. Producer-Consumer паттерн
// -----------------------------------------------

// // flagBuf: [ready_flag, iteration]
// const flagBuf = new SharedArrayBuffer(2 * 4)
// const flag = new Int32Array(flagBuf)

// // Producer Worker:
// function produce(data) {
//   // ... записать данные в sab ...
//   Atomics.store(flag, 0, 1)   // поднять флаг
//   Atomics.notify(flag, 0, 1)  // разбудить Consumer
// }

// // Consumer Worker:
// function waitForData() {
//   const result = Atomics.waitAsync(flag, 0, 0)  // ждём пока flag[0] !== 0
//   if (!result.async) {
//     consumeData()
//   } else {
//     result.value.then(outcome => {
//       if (outcome === 'ok') consumeData()
//     })
//   }
// }
// function consumeData() {
//   // ... читать данные ...
//   Atomics.store(flag, 0, 0)  // сбросить флаг
//   waitForData()              // ждать следующий
// }

// -----------------------------------------------
// 6. Создание Worker из строки кода (Blob)
// -----------------------------------------------

// const code = `
//   self.onmessage = function(e) {
//     var arr = new Int32Array(e.data.sab)
//     Atomics.add(arr, 0, 1)
//     self.postMessage('done')
//   }
// `
// const blob = new Blob([code], { type: 'application/javascript' })
// const url = URL.createObjectURL(blob)
// const worker = new Worker(url)
// URL.revokeObjectURL(url)

// -----------------------------------------------
// 7. Проверка доступности SAB
// -----------------------------------------------

// if (self.crossOriginIsolated) {
//   // COOP + COEP заголовки установлены — SAB доступен
//   const sab = new SharedArrayBuffer(4)
// } else {
//   // Нужно добавить заголовки:
//   // Cross-Origin-Opener-Policy: same-origin
//   // Cross-Origin-Embedder-Policy: require-corp
// }

// -----------------------------------------------
// 8. Типы массивов, поддерживающие Atomics.wait
// -----------------------------------------------

// ✅ Atomics.wait/waitAsync работают с:
//    Int32Array, BigInt64Array

// ✅ Остальные операции (load/store/add/sub/...) работают с:
//    Int8Array, Uint8Array, Int16Array, Uint16Array,
//    Int32Array, Uint32Array, BigInt64Array, BigUint64Array

// ❌ Float32Array, Float64Array — только load/store, не add/sub/...

// -----------------------------------------------
// 9. Cleanup в React
// -----------------------------------------------

// useEffect(() => {
//   const sab = new SharedArrayBuffer(32)
//   const worker = new Worker(url)
//   workerRef.current = worker
//   worker.postMessage({ sab })
//
//   return () => {
//     worker.postMessage('stop')  // сигнал для graceful shutdown
//     worker.terminate()           // принудительное завершение
//   }
// }, [])

export {}
