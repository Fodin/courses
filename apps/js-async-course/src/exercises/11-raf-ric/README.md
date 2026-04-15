# requestAnimationFrame и requestIdleCallback

## Проблема: когда setTimeout — плохой чертёжник

Представьте архитектора-чертёжника, который обещает сдавать чертежи "каждые 16 минут". Иногда он опаздывает на 17, 20, а то и 32 минуты — и строители теряют ритм, конструкция начинает дёргаться.

Именно это происходит с `setTimeout(fn, 16)` для анимаций: таймер срабатывает **приблизительно** через 16ms, но браузер рисует кадры строго по расписанию монитора (60 раз в секунду = каждые 16.6ms). Таймер и монитор работают не в такт.

## requestAnimationFrame: чертёжник по расписанию

`requestAnimationFrame(callback)` — это контракт: браузер сам позвонит вашей функции **прямо перед тем, как собирается нарисовать очередной кадр**. Не раньше, не позже.

```js
function animate(timestamp) {
  // timestamp — время начала кадра в миллисекундах (DOMHighResTimeStamp)
  ball.x = (ball.x + 2) % 400
  draw(ball)

  requestAnimationFrame(animate) // запрашиваем следующий кадр
}

requestAnimationFrame(animate) // запускаем цикл
```

### Что даёт rAF:

- **Синхронизация с монитором** — колбэк вызывается строго перед отрисовкой (~60fps на большинстве экранов, 120fps на современных)
- **Пауза при скрытой вкладке** — браузер не вызывает rAF для неактивных вкладок, экономя CPU и батарею
- **Точный timestamp** — аргумент содержит монотонное время начала кадра для точных вычислений

```js
// Вычисление delta для независимой от FPS анимации
let lastTime = 0

function animate(now) {
  const delta = now - lastTime // сколько ms прошло
  lastTime = now

  ball.x += speed * (delta / 1000) // скорость в px/сек, независимо от FPS
  requestAnimationFrame(animate)
}
```

## cancelAnimationFrame

Как и с таймерами, rAF можно отменить:

```js
const rafId = requestAnimationFrame(animate)

// Остановить анимацию:
cancelAnimationFrame(rafId)
```

📌 Сохраняйте id и отменяйте rAF при размонтировании компонента, иначе — утечка памяти.

```js
// В React:
useEffect(() => {
  const id = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(id) // cleanup
}, [])
```

## Где в Event Loop выполняется rAF

```
Один "тик" браузера (≈16.6ms при 60fps):

Макрозадача → микрозадачи → rAF колбэки → Style → Layout → Paint → Composite → Idle
```

💡 Ключевой факт: rAF выполняется **после** всех JS-задач текущего тика, но **до** рендеринга. Все rAF-колбэки, поставленные в очередь до начала кадра, выполнятся в этом же кадре перед отрисовкой.

⚠️ Если rAF-колбэк тяжёлый (>16ms), кадр "растягивается" — браузер не успевает уложиться в 16.6ms, FPS падает ниже 60.

## setTimeout vs rAF: сравнение

| Критерий | setTimeout(fn, 16) | requestAnimationFrame |
|---|---|---|
| Синхронизация с монитором | Нет | Да |
| Точность | ±несколько ms | Точно перед кадром |
| Пауза в фоне | Нет | Да |
| Подходит для анимаций | Плохо | Отлично |
| Подходит для таймеров | Да | Нет |

## requestIdleCallback: уборщик в перерывах

Если rAF — чертёжник по расписанию, то `requestIdleCallback` — уборщик офиса. Он приходит **только когда все ушли** (браузер завершил кадр и у него есть свободное время).

```js
requestIdleCallback((deadline) => {
  // deadline.timeRemaining() — сколько ms ещё есть до следующего кадра
  // deadline.didTimeout — true если задача слишком долго ждала

  while (deadline.timeRemaining() > 1 && workQueue.length > 0) {
    processNextItem(workQueue.shift())
  }

  if (workQueue.length > 0) {
    requestIdleCallback(handleWork) // продолжим в следующий idle-период
  }
})
```

### IdleDeadline API

```js
requestIdleCallback((deadline) => {
  console.log(deadline.timeRemaining()) // обычно 0–50ms
  console.log(deadline.didTimeout)      // true если сработал timeout
})
```

### Опция timeout

```js
// Принудительное выполнение через 2 секунды, даже если браузер не idle
requestIdleCallback(handleWork, { timeout: 2000 })
```

⚠️ При `didTimeout === true` `timeRemaining()` вернёт 0, но колбэк всё равно вызовется.

## Паттерн: разбиение тяжёлой задачи на чанки

```js
function processItems(items) {
  let cursor = 0

  function idleCallback(deadline) {
    // Работаем, пока есть время
    while (cursor < items.length && deadline.timeRemaining() > 1) {
      heavyProcess(items[cursor++])
    }

    if (cursor < items.length) {
      // Ещё есть работа — запрашиваем следующий idle-период
      requestIdleCallback(idleCallback, { timeout: 3000 })
    } else {
      onComplete()
    }
  }

  requestIdleCallback(idleCallback, { timeout: 3000 })
}
```

✅ Анимации остаются плавными — rIC не трогает кадры.
⚠️ rIC медленнее синхронного подхода — задача растягивается по времени.

## Где в Event Loop находится Idle

```
Макрозадача → микрозадачи → rAF → Style → Layout → Paint → [Idle время] → следующий кадр
```

Idle-время возникает когда браузер завершил всё необходимое и у него есть "сдача" до следующего кадра. На практике — от 0 до 50ms.

## cancelIdleCallback

```js
const ricId = requestIdleCallback(work)
cancelIdleCallback(ricId) // отменить, если задача уже не нужна
```

## Частые ошибки новичков

### ❌ Ошибка 1: setTimeout вместо rAF для анимации

```js
// Плохо — не синхронизировано с монитором
function animate() {
  ball.x += 2
  draw(ball)
  setTimeout(animate, 16) // может попасть не в такт с кадром
}

// Хорошо — всегда перед кадром
function animate() {
  ball.x += 2
  draw(ball)
  requestAnimationFrame(animate)
}
```

### ❌ Ошибка 2: Тяжёлый код внутри rAF

```js
// Плохо — 50ms работы в rAF = 3 пропущенных кадра
requestAnimationFrame(() => {
  processMillionItems() // заблокирует рендер
  draw()
})

// Хорошо — в rAF только рисование, тяжёлое — в rIC
requestIdleCallback(() => processMillionItems())
requestAnimationFrame(() => draw())
```

### ❌ Ошибка 3: Забыть отменить rAF при размонтировании

```js
// Плохо — анимация продолжается после удаления компонента
useEffect(() => {
  requestAnimationFrame(loop) // ← без cleanup
}, [])

// Хорошо — отменяем при cleanup
useEffect(() => {
  const id = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(id) // ← cleanup
}, [])
```

### ❌ Ошибка 4: rIC для срочных задач

```js
// Плохо — rIC может выполниться через секунды
requestIdleCallback(() => {
  updateCriticalUI() // пользователь ждёт!
})

// Хорошо — срочное → синхронно или через queueMicrotask
queueMicrotask(() => updateCriticalUI())
```

## Ключевые выводы

- `requestAnimationFrame` — для анимаций, синхронизирован с монитором, пауза в фоне
- `cancelAnimationFrame` — обязателен для очистки (особенно в React)
- `requestIdleCallback` — для фоновой работы в "пустое" время браузера
- `deadline.timeRemaining()` — сколько ms осталось до следующего кадра
- Порядок в кадре: макрозадача → микрозадачи → rAF → Style/Layout/Paint → Idle
- rIC медленнее, но не мешает UI — это осознанный компромисс
