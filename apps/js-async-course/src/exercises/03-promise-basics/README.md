# Promise: основы

## Что такое Promise

Представьте, что вы пришли в ресторан и сделали заказ. Официант не несёт вам еду мгновенно — он даёт вам **чек** (номерок). Этот чек — обещание: "когда блюдо будет готово, вы его получите". Пока вы ждёте, вы можете читать меню, разговаривать с друзьями — не нужно стоять у кассы.

**Promise** — это именно такой чек. Контейнер для значения, которое появится в будущем. Вместо того чтобы передавать колбэк в функцию, вы получаете объект, с которым можно работать.

```js
// Старый способ — колбэк
readFile('data.txt', function(err, data) {
  if (err) handleError(err)
  else process(data)
})

// Новый способ — Promise
readFile('data.txt')
  .then(data => process(data))
  .catch(err => handleError(err))
```

## Три состояния

Промис всегда находится в одном из трёх состояний:

```
pending → fulfilled
       ↘ rejected
```

- **pending** — ожидание. Начальное состояние, результат ещё неизвестен.
- **fulfilled** — выполнен успешно. Есть значение-результат.
- **rejected** — отклонён. Есть причина отказа (обычно объект Error).

Переход `pending → fulfilled` или `pending → rejected` необратим. Промис, который "решился" (settled), **никогда не изменит своё состояние**. Это как сданный экзамен — оценка уже поставлена, переписать нельзя.

## Конструктор new Promise

```js
const promise = new Promise((resolve, reject) => {
  // Эта функция называется executor
  // Она выполняется СИНХРОННО — прямо сейчас
  
  setTimeout(() => {
    const success = Math.random() > 0.5
    if (success) {
      resolve('Данные получены')  // → fulfilled
    } else {
      reject(new Error('Что-то пошло не так'))  // → rejected
    }
  }, 1000)
})
```

⚠️ Важно: **executor выполняется синхронно**. Весь код внутри executor (до первого асинхронного вызова) выполняется немедленно при создании промиса.

```js
console.log('до промиса')

const p = new Promise((resolve) => {
  console.log('внутри executor') // ← выполняется ЗДЕСЬ
  resolve(42)
})

console.log('после промиса')

p.then(v => console.log('then:', v)) // ← выполнится позже

// Порядок вывода:
// до промиса
// внутри executor
// после промиса
// then: 42
```

## Методы: then, catch, finally

Каждый из этих методов возвращает **новый промис**, что позволяет строить цепочки.

### .then(onFulfilled, onRejected)

```js
promise
  .then(value => {
    // вызывается при fulfilled
    return value * 2  // становится значением следующего промиса
  })
```

### .catch(onRejected)

Сокращение для `.then(null, onRejected)`. Ловит ошибки из предыдущих звеньев цепи:

```js
promise
  .then(v => doSomethingRisky(v))  // может выбросить ошибку
  .catch(err => {
    console.error(err)
    return 'значение по умолчанию'  // возобновляет "happy path"
  })
```

💡 После `.catch()` цепочка продолжается в нормальном режиме, если catch не выбросил новую ошибку.

### .finally(onFinally)

Выполняется всегда — и при fulfilled, и при rejected. Не получает значение и не может его изменить:

```js
promise
  .then(data => display(data))
  .catch(err => showError(err))
  .finally(() => {
    hideSpinner()  // всегда убираем индикатор загрузки
  })
```

## Иммутабельность settled-промиса

После перехода в settled состояние, повторные вызовы resolve/reject игнорируются:

```js
const p = new Promise((resolve, reject) => {
  resolve('первый')
  resolve('второй')   // игнорируется
  reject(new Error()) // тоже игнорируется
})

p.then(v => console.log(v)) // 'первый'
```

## Thenable-объекты

Promise распознаёт любой объект с методом `.then()` как "thenable" и обращается с ним как с промисом:

```js
const thenable = {
  then(resolve, reject) {
    resolve(42)
  }
}

Promise.resolve(thenable).then(v => console.log(v)) // 42
```

Это позволяет разным реализациям промисов работать вместе.

## Антипаттерны

### Promise Constructor Antipattern (Deferred antipattern)

```js
// Плохо — оборачиваем промис в промис без смысла
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch('/api/data')          // fetch уже возвращает промис!
      .then(r => r.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

// Хорошо — просто возвращаем промис
function fetchData() {
  return fetch('/api/data').then(r => r.json())
}
```

### Unhandled Rejection

```js
// Плохо — ошибка нигде не обрабатывается
fetch('/api/data')
  .then(r => r.json())
// Если запрос упадёт — ошибка "провалится в никуда"

// Хорошо — всегда добавляем .catch()
fetch('/api/data')
  .then(r => r.json())
  .catch(err => console.error('Ошибка:', err))
```

## Ключевые выводы

- Promise — контейнер для будущего значения с тремя состояниями: pending, fulfilled, rejected
- Переход из pending необратим — settled-промис не меняет состояние
- Executor выполняется синхронно, колбэки .then()/.catch() — асинхронно (микротаски)
- .then()/.catch()/.finally() возвращают новые промисы, позволяя строить цепочки
- .catch() возобновляет "happy path" — после него цепочка идёт через .then()
- .finally() не получает и не меняет значение — только для побочных эффектов
