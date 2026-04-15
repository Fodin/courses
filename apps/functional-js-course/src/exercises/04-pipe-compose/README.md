# Pipe и Compose

## Проблема: вложенные вызовы

Представьте что нужно применить несколько трансформаций к значению:

```js
// Вложенный вызов — читается изнутри наружу
const result = trim(toLower(addExclaim(input)))
//                            ^ сначала это
//                  ^ потом это
//             ^ потом это
```

Читать приходится справа налево. При пяти и более трансформациях код превращается в «пирамиду».

## pipe — слева направо

`pipe` применяет функции в том порядке, в котором они перечислены:

```js
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)

const process = pipe(trim, toLower, addExclaim)
process('  HELLO  ')
// trim('  HELLO  ')    => 'HELLO'
// toLower('HELLO')     => 'hello'
// addExclaim('hello')  => 'hello!'
```

```mermaid
flowchart LR
  X["'  HELLO  '"] --> F["trim"] --> G["toLower"] --> H["addExclaim"] --> R["'hello!'"]
```

Читается как предложение: «сначала trim, потом toLower, потом addExclaim».

## compose — справа налево

`compose` применяет функции в обратном порядке (математическая запись f ∘ g):

```js
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)

const process = compose(addExclaim, toLower, trim)
process('  HELLO  ')
// trim сначала, toLower потом, addExclaim в конце — порядок как в pipe(trim, toLower, addExclaim)
```

`compose(f, g, h)(x)` = `f(g(h(x)))` — первой выполняется `h`, последней — `f`.

## Разница в одной строке

```js
pipe(f, g, h)(x)    === h(g(f(x)))   // слева → вправо
compose(f, g, h)(x) === f(g(h(x)))   // справа → влево
```

## Когда что использовать

- **pipe** — почти всегда. Порядок чтения совпадает с порядком выполнения. Аналог Unix pipes: `cat file | grep x | sort`
- **compose** — когда нужна математическая запись или работаете с библиотекой где принято (например, Redux middleware)

## Связь с Unix

```bash
cat access.log | grep ERROR | sort | uniq -c
```

Это буквально `pipe(grep('ERROR'), sort, uniq('-c'))(readFile('access.log'))`.

## Типичные ошибки новичков

**1. Перепутать порядок в compose:**

```js
// Плохо — ожидаете что trim выполнится первым
const process = compose(trim, toLower, addExclaim)
process('  hello  ')
// addExclaim сначала: '  hello  !'
// toLower: '  hello  !'
// trim: 'hello  !'   — не то что ожидали

// Хорошо — используйте pipe когда думаете "слева направо"
const process = pipe(trim, toLower, addExclaim)
process('  hello  ')  // 'hello!'
```

**2. Передавать уже вызванную функцию:**

```js
// Плохо — add10 вызвана сразу, результат не является функцией
const pipeline = pipe(trim, add10(value), toUpper)

// Хорошо — передаём функцию, а не результат
const add10 = x => x + 10
const pipeline = pipe(trim, add10, toUpper)
```

**3. Смешивать типы внутри пайплайна:**

```js
// Плохо — getLength возвращает number, а toUpper ждёт string
const bad = pipe(trim, getLength, toUpper)

// Хорошо — все функции работают с одним типом
const good = pipe(trim, toLower, capitalize)
```
