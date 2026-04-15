# Система типов и дженерики

## Типы как контракты

Тип — это обещание. Когда функция принимает `number`, она обещает: "дай мне число, я знаю, что с ним делать". Система типов делает эти обещания проверяемыми автоматически.

```typescript
// Без типов — молчаливое соглашение, которое легко нарушить
function greet(name) {
  return 'Hello, ' + name.toUpperCase()
}
greet(42)  // Runtime: TypeError: name.toUpperCase is not a function

// С типами — компилятор ловит ошибку до запуска
function greet(name: string): string {
  return 'Hello, ' + name.toUpperCase()
}
greet(42)  // Compile-time: Argument of type 'number' is not assignable to 'string'
```

## Номинальная vs Структурная типизация

Это два разных ответа на вопрос: "когда два типа совместимы?"

**Номинальная** (Java, C#): типы совместимы, только если они явно связаны наследованием или интерфейсом. Имя класса — это его идентичность.

**Структурная** (TypeScript, Go): типы совместимы, если у них одинаковая структура. Неважно, как тип называется.

```typescript
// Структурная типизация TypeScript:
type Point2D = { x: number; y: number }
type Position = { x: number; y: number }  // другое имя, та же структура

const point: Point2D = { x: 1, y: 2 }
const pos: Position = point  // ✅ Работает! TypeScript смотрит на структуру
```

Это называется "duck typing на уровне компилятора": если объект имеет нужные поля — он подходит.

## Вариантность: когда тип A подходит вместо B?

Вариантность — это правила совместимости составных типов. Три сценария:

**Ковариантность**: `Dog extends Animal`, значит `Array<Dog>` можно использовать там, где ожидается `Array<Animal>` (только для чтения!).

**Контравариантность**: функция `(animal: Animal) => void` подходит там, где ожидается `(dog: Dog) => void` — параметры функций идут "против" направления.

**Инвариантность**: `Array<Dog>` не подходит вместо `Array<Animal>`, когда массив изменяемый.

```typescript
type Animal = { name: string }
type Dog = Animal & { breed: string }

// Ковариантность — возвращаемые типы
type Producer<T> = () => T
const dogProducer: Producer<Dog> = () => ({ name: 'Rex', breed: 'Lab' })
const animalProducer: Producer<Animal> = dogProducer  // ✅

// Контравариантность — параметры функций
type Consumer<T> = (value: T) => void
const animalConsumer: Consumer<Animal> = (a) => console.log(a.name)
const dogConsumer: Consumer<Dog> = animalConsumer  // ✅
```

## Дженерики: полиморфизм без потери типов

Дженерики — это "переменные для типов". Позволяют писать универсальный код, не теряя информацию о конкретных типах.

```typescript
// Без дженериков — теряем информацию о типе
function first(arr: any[]): any {
  return arr[0]
}
const n = first([1, 2, 3])  // n: any — TypeScript не знает, что это number

// С дженериками — сохраняем тип
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
const n = first([1, 2, 3])  // n: number — TypeScript знает!
const s = first(['a', 'b']) // s: string
```

Constraint (`extends`) позволяет требовать определённую структуру:

```typescript
function getLength<T extends { length: number }>(item: T): number {
  return item.length
}

getLength('hello')   // ✅ string имеет length
getLength([1, 2, 3]) // ✅ array имеет length
getLength(42)        // ❌ number не имеет length
```

## unknown vs any

```typescript
// any: "доверяй мне, я знаю что делаю" — отключает проверки
function processAny(value: any) {
  value.toUpperCase()  // Нет ошибки компилятора, но может быть RuntimeError
}

// unknown: "мне передали что-то, надо сначала разобраться"
function processUnknown(value: unknown) {
  value.toUpperCase()  // ❌ Ошибка — нужно сначала проверить тип

  if (typeof value === 'string') {
    value.toUpperCase()  // ✅ TypeScript знает, что это string
  }
}
```

`unknown` — это `any` с включённым мозгом. Используйте его когда тип действительно неизвестен.
