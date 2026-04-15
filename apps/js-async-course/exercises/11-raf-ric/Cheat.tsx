// ============================================
// Шпаргалка: requestAnimationFrame и requestIdleCallback
// Cheat Sheet: requestAnimationFrame and requestIdleCallback
// ============================================
// Этот файл — только для чтения. Не импортируется в курс.
// This file is read-only. Not imported into the course.

// -----------------------------------------------
// 1. requestAnimationFrame — базовый цикл анимации
// 1. requestAnimationFrame — basic animation loop
// -----------------------------------------------

// Запустить анимацию:
// Start animation:
//
// let rafId: number
//
// function loop(timestamp: number) {
//   // timestamp — DOMHighResTimeStamp начала кадра
//   // timestamp — DOMHighResTimeStamp of frame start
//   updateAnimation(timestamp)
//   rafId = requestAnimationFrame(loop)
// }
//
// rafId = requestAnimationFrame(loop)
//
// Остановить:
// Stop:
// cancelAnimationFrame(rafId)

// -----------------------------------------------
// 2. Delta-based анимация (независимо от FPS)
// 2. Delta-based animation (FPS-independent)
// -----------------------------------------------

// let lastTime = 0
//
// function loop(now: number) {
//   const delta = now - lastTime  // ms с прошлого кадра
//   lastTime = now
//
//   position += SPEED_PX_PER_SEC * (delta / 1000)
//   draw(position)
//   requestAnimationFrame(loop)
// }

// -----------------------------------------------
// 3. Cleanup в React useEffect
// 3. Cleanup in React useEffect
// -----------------------------------------------

// useEffect(() => {
//   const rafId = requestAnimationFrame(loop)
//   return () => cancelAnimationFrame(rafId)
// }, [])

// -----------------------------------------------
// 4. requestIdleCallback — чанкование тяжёлой задачи
// 4. requestIdleCallback — chunking heavy work
// -----------------------------------------------

// let cursor = 0
//
// function idleWork(deadline: IdleDeadline) {
//   // Работаем пока есть свободное время (>1ms)
//   // Work while there's idle time (>1ms)
//   while (cursor < items.length && deadline.timeRemaining() > 1) {
//     processItem(items[cursor++])
//   }
//
//   if (cursor < items.length) {
//     // Ещё есть работа — планируем следующий idle
//     // More work — schedule next idle
//     requestIdleCallback(idleWork, { timeout: 2000 })
//   } else {
//     onComplete()
//   }
// }
//
// requestIdleCallback(idleWork, { timeout: 2000 })
//
// Отменить:
// Cancel:
// const ricId = requestIdleCallback(idleWork)
// cancelIdleCallback(ricId)

// -----------------------------------------------
// 5. Порядок фаз кадра / Frame phase order
// -----------------------------------------------
//
// [JS Tasks] → [rAF callbacks] → [Style] → [Layout] → [Paint] → [Composite] → [Idle]
//
// Макрозадачи (setTimeout, события)
// Macro tasks (setTimeout, events)
//   ↓
// Все rAF-колбэки (зарегистрированные до начала кадра)
// All rAF callbacks (registered before frame start)
//   ↓
// Вычисление CSS-стилей / CSS style recalculation
//   ↓
// Reflow (размеры и позиции) / Reflow (sizes and positions)
//   ↓
// Paint (пиксели) / Paint (pixels)
//   ↓
// Composite (GPU-слои) / Composite (GPU layers)
//   ↓
// Idle time → requestIdleCallback

// -----------------------------------------------
// 6. Типы IdleDeadline
// 6. IdleDeadline types
// -----------------------------------------------
//
// interface IdleDeadline {
//   timeRemaining(): number  // ms до следующего кадра (0–50)
//   readonly didTimeout: boolean  // true если запущен принудительно по timeout
// }

// -----------------------------------------------
// 7. FPS-счётчик / FPS counter
// -----------------------------------------------
//
// const frameTimes: number[] = []
// let lastFrame = 0
//
// function loop(now: number) {
//   if (lastFrame > 0) {
//     frameTimes.push(now - lastFrame)
//     if (frameTimes.length > 30) frameTimes.shift()
//   }
//   lastFrame = now
//   requestAnimationFrame(loop)
// }
//
// // Вычислить FPS: / Compute FPS:
// const avgInterval = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
// const fps = Math.round(1000 / avgInterval)

// -----------------------------------------------
// 8. Приоритет API / API priority order
// -----------------------------------------------
//
// Срочное (sync) → queueMicrotask → rAF → setTimeout/setInterval → rIC
// Urgent (sync) → queueMicrotask → rAF → setTimeout/setInterval → rIC
