# Maybe и Either: подробная теория

## Null — "ошибка на миллиард долларов"

В 1965 году Тони Хоар изобрёл `null`, назвав это впоследствии "ошибкой на миллиард долларов". Проблема не в самом `null`, а в том, что система типов не отличает "значение есть" от "значения нет". В результате:

```ts
// TypeScript: тип string, но реально может быть undefined
function getCity(user: User): string {
  return user.address.city  // TypeError если address = undefined
}
```

Компилятор не предупреждает — мы узнаём об ошибке только в runtime.

---

## Optional chaining (?.) vs Maybe

ES2020 даёт `?.` — это удобно, но не решает задачу полностью:

```ts
// Optional chaining
const city = user.address?.city ?? 'N/A'
```

Плюсы `?.`: лаконично, встроено в язык.

Минусы `?.` по сравнению с Maybe:
- Нельзя передать как функцию в `map`/`pipe`
- Нельзя накапливать трансформации в пайплайне
- Нет явного типа "значение может отсутствовать"

Maybe явно **программирует** отсутствие значения:

```ts
// Maybe позволяет строить пайплайн
const getCity = (user: User): string =>
  pipe(
    fromNullable(user.address),
    flatMap(a => fromNullable(a.city)),
    getOrElse(() => 'N/A')
  )
```

На практике в JS-проектах `?.` достаточно для простых случаев. Maybe оправдывает себя в длинных цепочках с трансформациями и в библиотеках типа fp-ts.

---

## Исключения vs Either

Исключения нарушают принцип чистых функций: функция обещает вернуть `T`, но может "взорваться". Either делает возможность ошибки частью сигнатуры:

```ts
// Скрытый контракт — функция "может упасть", но тип этого не говорит
function parseAge(s: string): number {
  const n = parseInt(s)
  if (isNaN(n)) throw new Error('Not a number')
  return n
}

// Явный контракт — Either<string, number>
function parseAge(s: string): Either<string, number> {
  const n = parseInt(s)
  return isNaN(n) ? Left('Not a number') : Right(n)
}
```

Преимущества Either:
- Ошибка видна в сигнатуре, IDE подсказывает что делать
- Невозможно "забыть" обработать ошибку
- Тип ошибки `L` можно типизировать (не только `string`, но и `ValidationError`, `NetworkError` и т.д.)

---

## Railway-oriented programming (ROP)

Концепция Скотта Влашина. Представьте две железнодорожные линии:

```
Input ─── [fn1] ──► [fn2] ──► [fn3] ──► Success
                │           │           │
                ↓           ↓           ↓
         Failure track ─────────────────►
```

Когда функция возвращает `Left`, управление "переключается" на рельс ошибки, и все оставшиеся функции **не вызываются**. Это реализуется через `flatMap`:

```ts
// flatMap пропускает вызов fn если e уже Left
function flatMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => Either<L, R2>): Either<L, R2> {
  return e.tag === 'Right' ? fn(e.value) : e
}
```

Аналогия: посылка (Right = доставлена, Left = возврат с причиной). Если посылка уже оформлена как "возврат", все последующие операции доставки не выполняются.

---

## Монадические законы

Either и Maybe — монады. Монада должна удовлетворять трём законам:

**1. Left identity** (нейтральность конструктора слева):
```ts
flatMap(Right(a), f)  ===  f(a)
```

**2. Right identity** (нейтральность конструктора справа):
```ts
flatMap(m, Right)  ===  m
```

**3. Associativity** (ассоциативность вложенных flatMap):
```ts
flatMap(flatMap(m, f), g)  ===  flatMap(m, x => flatMap(f(x), g))
```

Практическое значение: закон ассоциативности означает, что последовательность flatMap можно разбить на части и соединить обратно — результат не изменится. Это гарантирует предсказуемость рефакторинга.

---

## Applicative-валидация (тизер: Level 13)

`flatMap` останавливается на первой ошибке. Но что если нужно **собрать все ошибки** (как в форме)?

Для этого используется Applicative-комбинатор `ap` и структура `Validated`:

```ts
// Гипотетически (Level 13):
const result = combine(
  validateName(name),    // Either<Error[], string>
  validateEmail(email),  // Either<Error[], string>
  validateAge(age),      // Either<Error[], number>
  (name, email, age) => ({ name, email, age })
)
// Если все три Left — ошибки объединяются в один массив
```

`Either` ("fail fast") и `Validated` ("collect all errors") — разные инструменты для разных задач.

---

## Конвертация Maybe ↔ Either

```ts
// Maybe → Either (теряем Just, добавляем описание ошибки)
const maybeToEither = <T>(m: Maybe<T>, err: string): Either<string, T> =>
  m.tag === 'Some' ? Right(m.value) : Left(err)

// Either → Maybe (теряем информацию об ошибке)
const eitherToMaybe = <L, R>(e: Either<L, R>): Maybe<R> =>
  e.tag === 'Right' ? Some(e.value) : None
```

Правило: используйте `Maybe` когда "нет значения" — нормальная ситуация без ошибки (поиск в коллекции). Используйте `Either` когда отсутствие значения — это **ошибка с причиной** (валидация, парсинг, HTTP-запрос).

---

## Ошибки начинающих

**1. map вместо flatMap при вложенных Maybe**

```ts
// Неправильно: Maybe<Maybe<string>>
const result = maybeMap(fromNullable(user.address), a => fromNullable(a.city))

// Правильно: Maybe<string>
const result = maybeFlatMap(fromNullable(user.address), a => fromNullable(a.city))
```

**2. Игнорирование Left**

```ts
// Неправильно: взрывается если Left
const value = (result as { tag: 'Right'; value: string }).value

// Правильно: явный match
const value = match(result, err => `Error: ${err}`, v => v)
```

**3. Чрезмерное использование Either**

Either не должен заменять все `if`. Он оправдан там, где ошибка является частью бизнес-логики (валидация, парсинг). Для программных ошибок (неверный аргумент типа `never`) уместнее `throw`.
