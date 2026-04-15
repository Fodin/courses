# SharedArrayBuffer и Atomics

## Проблема: потоки не видят память друг друга

Обычные Web Workers работают в изоляции. Когда Worker A меняет свой массив, Worker B об этом не знает — у каждого своя копия данных. Данные передаются через `postMessage`, который клонирует их.

Это безопасно, но медленно для больших данных и неудобно для совместной работы.

```js
// Обычный ArrayBuffer — клонируется при передаче
const buf = new ArrayBuffer(1024)
worker.postMessage({ buf })          // Worker получает КОПИЮ
// buf здесь и buf в Worker — разные области памяти
```

## SharedArrayBuffer: общая доска в офисе

`SharedArrayBuffer` — это буфер памяти, который **видят несколько потоков одновременно**. Представьте офисную доску: любой сотрудник может подойти и написать или стереть запись. Все остальные видят актуальное состояние.

```js
// Создаём SharedArrayBuffer — 4 байта (один Int32)
const sab = new SharedArrayBuffer(4)
const arr = new Int32Array(sab)

// Передаём в Worker — не копируется, а разделяется!
worker.postMessage({ sab })

// Теперь главный поток и Worker видят ОДНУ и ту же память
arr[0] = 42
// Worker тоже видит 42 в своём Int32Array(sab)
```

## Проблема: Race Condition

Общая память — это опасно. Если два Worker'а одновременно читают и пишут одно значение, возникает **гонка данных** (race condition):

```js
// Worker A:            // Worker B (одновременно):
var val = arr[0]  // читает 5   var val = arr[0]  // тоже читает 5
// ... немного ждёт ... // ... немного ждёт ...
arr[0] = val + 1  // пишет 6   arr[0] = val + 1  // тоже пишет 6!
// Итог: 6, хотя должно быть 7!
```

Одно из двух прибавлений "потерялось" — оба Worker'а читали одно значение, не зная, что другой тоже его читает.

## Atomics: маркер с блокировкой

`Atomics` — объект со статическими методами для **атомарных операций** над SharedArrayBuffer. Атомарная операция — это действие, которое выполняется неделимо: никакой другой поток не может вклиниться между чтением и записью.

Аналогия: маркер у доски — пока один сотрудник пишет, другие видят, что маркер занят, и ждут.

### Основные операции

```js
const sab = new SharedArrayBuffer(32)
const arr = new Int32Array(sab)

// Атомарное чтение (гарантированно свежее значение)
const val = Atomics.load(arr, 0)

// Атомарная запись
Atomics.store(arr, 0, 42)

// Атомарные арифметические операции (возвращают старое значение)
const old = Atomics.add(arr, 0, 1)   // arr[0] += 1
const old2 = Atomics.sub(arr, 0, 5)  // arr[0] -= 5

// Битовые операции
Atomics.and(arr, 0, 0xFF)  // arr[0] &= 0xFF
Atomics.or(arr, 0, 0x01)   // arr[0] |= 0x01
Atomics.xor(arr, 0, 0x0F)  // arr[0] ^= 0x0F
```

### compareExchange: основа Lock-free алгоритмов

```js
// Атомарный CAS: Compare-And-Swap
// "Если arr[0] === expected, записать replacement и вернуть expected"
// "Иначе вернуть текущее значение без изменения"
const result = Atomics.compareExchange(arr, 0, expected, replacement)
const success = result === expected
```

Это строительный блок для mutex, spinlock и lock-free структур данных.

## wait / waitAsync и notify: синхронизация

### Atomics.wait — только в Worker!

```js
// Ждёт, пока arr[0] не перестанет быть 0 (или timeout мс)
// БЛОКИРУЕТ ПОТОК — нельзя вызывать в main thread!
const outcome = Atomics.wait(arr, 0, 0, 1000)
// outcome: 'ok' | 'not-equal' | 'timed-out'
```

### Atomics.waitAsync — для main thread и Worker'ов

```js
// Не блокирует — возвращает Promise
const result = Atomics.waitAsync(arr, 0, 0)
if (result.async) {
  result.value.then(outcome => {
    // 'ok' — получили уведомление
    // 'timed-out' — истекло время
  })
} else {
  // result.value === 'not-equal' — значение уже изменилось
}
```

### Atomics.notify — будим ждущих

```js
// Будим до N потоков, ожидающих по индексу 0
Atomics.notify(arr, 0, 1)   // разбудить 1 поток
Atomics.notify(arr, 0, Infinity)  // разбудить всех
```

## COOP/COEP: требования безопасности

После атак Spectre/Meltdown в 2018 году браузеры отключили SharedArrayBuffer. В 2020 году его вернули, но с требованием **изоляции от других источников**. Сайт должен отправлять заголовки:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Без них `new SharedArrayBuffer(...)` выбросит ошибку `SecurityError`.

## Когда использовать (и когда НЕ использовать)

**Используйте SharedArrayBuffer + Atomics, если:**
- Обрабатываете большие данные (изображения, аудио, видео) в нескольких Worker'ах
- Нужен разделяемый кеш между потоками
- Реализуете producer-consumer паттерн с низкой задержкой
- Портируете C/C++ код с разделяемой памятью (через WASM)

**НЕ используйте, если:**
- Достаточно обычного `postMessage` (большинство задач)
- Данные небольшие и передаются редко
- Команда не знакома с многопоточным программированием

⚠️ **Предупреждение:** Код с разделяемой памятью сложнее отлаживать. Гонки данных проявляются нерегулярно и могут не воспроизводиться в отладчике.

## Частые ошибки новичков

**Ошибка 1: Atomics.wait() в главном потоке**

```js
// Плохо — main thread заблокируется!
const result = Atomics.wait(arr, 0, 0)  // TypeError!

// Хорошо — waitAsync не блокирует
const result = Atomics.waitAsync(arr, 0, 0)
```

**Ошибка 2: Обычные операции вместо Atomics**

```js
// Плохо — race condition
arr[0] = arr[0] + 1

// Хорошо — атомарный инкремент
Atomics.add(arr, 0, 1)
```

**Ошибка 3: Забыть COOP/COEP заголовки**

```js
// SecurityError: SharedArrayBuffer cannot be used
// Без правильных HTTP-заголовков SAB недоступен
const sab = new SharedArrayBuffer(4)
```
