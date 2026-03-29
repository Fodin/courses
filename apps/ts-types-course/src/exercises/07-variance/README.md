# 🔥 Уровень 7: Вариантность типов (Variance)

## 🎯 Введение

Вариантность (variance) — одно из самых фундаментальных и при этом недопонятых понятий в системе типов TypeScript. Она определяет, **как соотносятся generic-типы при наследовании их параметров**. Например, если `Dog extends Animal`, то можно ли использовать `Array<Dog>` там, где ожидается `Array<Animal>`?

Понимание вариантности критически важно для:
- Проектирования безопасных generic API
- Понимания ошибок TypeScript при передаче callback-ов
- Работы с коллекциями, Promise, и event-системами
- Осознанного выбора между method и property синтаксисом

## 🔥 Виды вариантности

Существует четыре вида вариантности:

| Вид | Значение | Пример |
|-----|----------|--------|
| **Ковариантность** (covariance) | Направление наследования сохраняется | `Producer<Dog>` -> `Producer<Animal>` |
| **Контравариантность** (contravariance) | Направление наследования инвертируется | `Consumer<Animal>` -> `Consumer<Dog>` |
| **Инвариантность** (invariance) | Присваивание запрещено в обе стороны | `Box<Dog>` != `Box<Animal>` |
| **Бивариантность** (bivariance) | Допустимо в обе стороны (unsound) | Методы в TS |

## 🔥 Ковариантность (Covariance)

### Output Position

Тип T находится в **ковариантной** (output) позиции, когда он используется как **возвращаемый тип**:

```typescript
interface Producer<T> {
  produce(): T  // T в output position
}
```

Если `Dog extends Animal`, то `Producer<Dog>` совместим с `Producer<Animal>`:

```typescript
interface Animal { name: string }
interface Dog extends Animal { breed: string }

const dogProducer: Producer<Dog> = {
  produce: () => ({ name: 'Rex', breed: 'Shepherd' })
}

// ✅ Безопасно: Dog — это Animal, значит Producer<Dog> — это Producer<Animal>
const animalProducer: Producer<Animal> = dogProducer
const animal = animalProducer.produce() // Animal
```

**Почему это безопасно?** `dogProducer.produce()` возвращает `Dog`, который всегда содержит все поля `Animal`. Мы просто «забываем» о дополнительных полях.

### Массивы — ковариантны (с оговоркой)

```typescript
const dogs: Dog[] = [{ name: 'Rex', breed: 'Shepherd' }]

// ✅ readonly массивы — безопасно ковариантны
const animals: readonly Animal[] = dogs

// ⚠️ Мутабельные массивы — НЕ безопасны (но TS это разрешает!)
const mutableAnimals: Animal[] = dogs
mutableAnimals.push({ name: 'Whiskers' }) // Кот попал в массив собак!
```

📌 **Важно**: TypeScript разрешает ковариантное присваивание мутабельных массивов ради удобства, хотя это unsound. Используйте `readonly` массивы для безопасности.

### Promise — ковариантный

```typescript
const dogPromise: Promise<Dog> = Promise.resolve({ name: 'Rex', breed: 'Shepherd' })

// ✅ Promise<Dog> -> Promise<Animal>
const animalPromise: Promise<Animal> = dogPromise
```

## 🔥 Контравариантность (Contravariance)

### Input Position

Тип T находится в **контравариантной** (input) позиции, когда он используется как **параметр функции**:

```typescript
interface Consumer<T> {
  consume: (value: T) => void  // T в input position
}
```

Если `Dog extends Animal`, то `Consumer<Animal>` совместим с `Consumer<Dog>`:

```typescript
const animalConsumer: Consumer<Animal> = {
  consume: (a: Animal) => console.log(a.name)
}

// ✅ Безопасно: функция, принимающая Animal, может принять и Dog
const dogConsumer: Consumer<Dog> = animalConsumer
dogConsumer.consume({ name: 'Rex', breed: 'Shepherd' })
```

**Почему это безопасно?** `animalConsumer.consume` использует только поля `Animal`. Если мы передаём `Dog` — он точно имеет все поля `Animal`.

**Почему обратное небезопасно?**

```typescript
const dogConsumer2: Consumer<Dog> = {
  consume: (d: Dog) => console.log(d.breed) // использует breed!
}

// ❌ Небезопасно: Animal не имеет breed
// const animalConsumer2: Consumer<Animal> = dogConsumer2 // Error
```

### Callback-и — контравариантны по параметрам

```typescript
type Handler<T> = (value: T) => void

const handleAnimal: Handler<Animal> = (a) => console.log(a.name)

// ✅ Handler<Animal> -> Handler<Dog>: контравариантность
const handleDog: Handler<Dog> = handleAnimal
```

Это объясняет, почему `addEventListener('click', handler)` работает — обработчик `MouseEvent` совместим с обработчиком более узкого типа события.

## 🔥 Инвариантность (Invariance)

Когда тип T используется **одновременно** в input и output позициях, generic тип становится **инвариантным**:

```typescript
interface Box<T> {
  get(): T           // output — covariant
  set(value: T): void  // input — contravariant
}

// ❌ Box<Dog> нельзя присвоить Box<Animal>
// Если бы можно было: box.set({ name: 'Cat' }) — вставили бы не-Dog
// const animalBox: Box<Animal> = dogBox // Error

// ❌ Box<Animal> нельзя присвоить Box<Dog>
// Если бы можно было: box.get() вернёт Animal без breed
// const dogBox: Box<Dog> = animalBox // Error
```

📌 **Инвариантные типы** — самые строгие и безопасные. Мутабельные коллекции должны быть инвариантными.

## 🔥 Бивариантность (Bivariance)

TypeScript (с `strictFunctionTypes: true`) различает два синтаксиса объявления функций в интерфейсах:

### Method syntax — бивариантный

```typescript
interface Handler {
  handle(event: Event): void  // method syntax
}
```

Методы в интерфейсах **бивариантны** — допускают присваивание и в ковариантном, и в контравариантном направлении. Это менее безопасно, но необходимо для совместимости с DOM API.

### Property (function) syntax — строго контравариантный

```typescript
interface Handler {
  handle: (event: Event) => void  // property syntax
}
```

Свойства-функции подчиняются строгой контравариантности при `strictFunctionTypes: true`.

### Сравнение

```typescript
interface Animal { name: string }
interface Dog extends Animal { breed: string }

// ❌ Method syntax — bivariant (allows unsound assignment)
interface BivariantEmitter {
  emit(handler: (data: Dog) => void): void
}

// ✅ Property syntax — contravariant (strict)
interface StrictEmitter {
  emit: (handler: (data: Dog) => void) => void
}
```

💡 **Рекомендация**: используйте property syntax для callback-ов и event handler-ов, чтобы получить строгую типизацию.

## 🔥 Explicit Variance Annotations (TypeScript 4.7+)

С TypeScript 4.7 можно явно указать вариантность generic параметра:

```typescript
// out = covariant (T только в output позициях)
interface Producer<out T> {
  produce(): T
}

// in = contravariant (T только в input позициях)
interface Consumer<in T> {
  consume(value: T): void
}

// in out = invariant (T в обеих позициях)
interface Box<in out T> {
  get(): T
  set(value: T): void
}
```

### Зачем нужны explicit annotations?

1. **Документация** — сразу видно, как тип ведёт себя при наследовании
2. **Ошибки при нарушении** — TypeScript проверит, что T используется только в указанных позициях
3. **Производительность** — компилятор может оптимизировать проверки совместимости

```typescript
// ❌ Ошибка: T используется в input позиции, но объявлен как out
interface Broken<out T> {
  produce(): T
  consume(value: T): void // Error: T is used in 'in' position
}
```

## 🔥 Практические паттерны

### Разделение Read/Write интерфейсов

```typescript
interface Readable<out T> {
  read(): T
}

interface Writable<in T> {
  write(value: T): void
}

interface ReadWrite<T> extends Readable<T>, Writable<T> {}
```

Это позволяет использовать ковариантность при чтении и контравариантность при записи.

### Variance-safe event emitter

```typescript
// ✅ Property syntax для строгости
interface TypedEmitter<T> {
  on: (handler: (data: T) => void) => void
  emit: (data: T) => void
}
```

### Функции высшего порядка

```typescript
type Mapper<A, B> = (a: A) => B
// A — contravariant (input position)
// B — covariant (output position)

// Mapper<Animal, string> совместим с Mapper<Dog, string>
// благодаря контравариантности A
const getName: Mapper<Animal, string> = (a) => a.name
const dogs: Dog[] = [{ name: 'Rex', breed: 'Shepherd' }]
const names: string[] = dogs.map(getName) // ✅
```

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Мутабельный массив в ковариантной позиции

```typescript
// ❌ Опасно: мутабельный массив
function addAnimal(animals: Animal[]) {
  animals.push({ name: 'Cat' })
}

const dogs: Dog[] = [{ name: 'Rex', breed: 'Shepherd' }]
addAnimal(dogs) // TS разрешает! Но Cat попал в Dog[]

// ✅ Безопасно: readonly массив
function countAnimals(animals: readonly Animal[]): number {
  return animals.length
}
```

### Ошибка 2: Путаница направления контравариантности

```typescript
// ❌ Неправильное ожидание
type DogHandler = (dog: Dog) => void
type AnimalHandler = (animal: Animal) => void

// Кажется, что DogHandler более специфичный...
// Но AnimalHandler присваивается к DogHandler, а не наоборот!
const h: DogHandler = ((a: Animal) => console.log(a.name)) // ✅
// const h2: AnimalHandler = ((d: Dog) => console.log(d.breed)) // ❌
```

💡 **Мнемоника**: параметры функций идут «против течения» наследования.

### Ошибка 3: Использование method syntax для callback-ов

```typescript
// ❌ Бивариантность позволяет unsound код
interface EventBus {
  on(event: string, handler: (data: Dog) => void): void  // method
}

// ✅ Строгая контравариантность
interface EventBus {
  on: (event: string, handler: (data: Dog) => void) => void  // property
}
```

### Ошибка 4: Игнорирование вариантности при дизайне API

```typescript
// ❌ Один интерфейс с read и write — инвариантный
interface Repository<T> {
  get(id: string): T
  save(item: T): void
}
// Repository<Dog> и Repository<Animal> несовместимы!

// ✅ Разделение на read и write
interface ReadRepo<out T> {
  get(id: string): T
}
interface WriteRepo<in T> {
  save(item: T): void
}
// ReadRepo<Dog> совместим с ReadRepo<Animal>
```

## 📌 Итоги

| Позиция | Вариантность | Пример | Направление |
|---------|-------------|--------|------------|
| Output (return) | Ковариантность | `Producer<T>` | Dog -> Animal |
| Input (parameter) | Контравариантность | `Consumer<T>` | Animal -> Dog |
| Both | Инвариантность | `Box<T>` | Ни туда, ни сюда |
| Method syntax | Бивариантность | `{ handle(e: T): void }` | Обе стороны |

💡 **Ключевой принцип**: если вы только **читаете** значение — ковариантность безопасна. Если вы только **записываете** — контравариантность безопасна. Если обе операции — только инвариантность гарантирует безопасность.
