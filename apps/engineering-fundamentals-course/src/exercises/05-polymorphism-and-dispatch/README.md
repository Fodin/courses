# Уровень 5: Полиморфизм и диспетчеризация

## Зачем это важно?

Представьте электрическую розетку. В неё можно включить лампу, телефон, ноутбук, фен — всё разное, но все они знают «язык розетки»: 220 В, определённый штепсель. Розетка не знает и не должна знать, что именно подключено. Это и есть полиморфизм в реальном мире: один интерфейс — множество реализаций.

Полиморфизм — это способность кода работать с объектами разных типов через единый интерфейс. Диспетчеризация — механизм выбора конкретной реализации в момент вызова.

---

## Три вида полиморфизма

### Параметрический полиморфизм (Generics)

Одна реализация работает с любым типом. Тип — параметр:

```typescript
// Array<T> — один класс для чисел, строк, объектов
const numbers: Array<number> = [1, 2, 3]
const names: Array<string> = ['Alice', 'Bob']

function identity<T>(value: T): T {
  return value // работает с чем угодно
}
```

### Подтиповой полиморфизм (Subtype)

Код, написанный для базового типа, работает и с производными типами:

```typescript
abstract class Shape {
  abstract area(): number
}

class Circle extends Shape {
  constructor(private radius: number) { super() }
  area(): number { return Math.PI * this.radius ** 2 }
}

class Rectangle extends Shape {
  constructor(private w: number, private h: number) { super() }
  area(): number { return this.w * this.h }
}

function totalArea(shapes: Shape[]): number {
  return shapes.reduce((sum, s) => sum + s.area(), 0)
  // Не знает, Circle это или Rectangle — не важно
}
```

### Ad-hoc полиморфизм (перегрузка)

Разное поведение для разных типов при одном имени:

```typescript
// Перегрузки в TypeScript
function format(value: number): string
function format(value: Date): string
function format(value: number | Date): string {
  if (typeof value === 'number') return value.toFixed(2)
  return value.toISOString().slice(0, 10)
}
```

---

## Статическая vs динамическая диспетчеризация

**Статическая** — выбор реализации во время компиляции (перегрузки, дженерики).

**Динамическая** — выбор во время выполнения (виртуальные методы, `instanceof`):

```typescript
// Динамическая диспетчеризация: какой метод вызвать — решается в runtime
const shape: Shape = getShapeFromAPI() // Circle или Rectangle?
shape.area() // JS смотрит на реальный тип объекта и вызывает нужный метод
```

В TypeScript роль динамической диспетчеризации часто играют discriminated unions:

```typescript
type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'keydown'; key: string }

function handle(event: Event): void {
  switch (event.type) {
    case 'click': console.log(`Click at ${event.x}, ${event.y}`); break
    case 'keydown': console.log(`Key: ${event.key}`); break
  }
}
```

---

## Принцип подстановки Лисков (LSP)

Объект подкласса должен быть заменяем объектом базового класса без нарушения корректности программы:

```typescript
// LSP нарушен: Square ломает контракт Rectangle
class Rectangle {
  setWidth(w: number) { this.width = w }
  setHeight(h: number) { this.height = h }
  area(): number { return this.width * this.height }
}

class Square extends Rectangle {
  setWidth(w: number) { this.width = this.height = w } // ломает ожидания!
}

// Функция ожидает Rectangle, получает Square — результат неожиданный
function stretchWidth(r: Rectangle) {
  r.setWidth(r.width * 2)
  // Ожидаем: area удвоилась. Реальность с Square: area учетверилась
}
```

LSP — это не про наследование синтаксически, а про соответствие контракту семантически.

---

## Итог

- **Параметрический полиморфизм** — дженерики: одна реализация для любого типа
- **Подтиповой** — наследование и интерфейсы: код базового типа работает с производными
- **Ad-hoc** — перегрузки: одно имя, разное поведение для разных типов
- **LSP** — производный тип должен быть полноправной заменой базовому
- **Статическая диспетчеризация** — выбор во время компиляции; **динамическая** — во время выполнения
- **Discriminated unions** — идиоматическая альтернатива наследованию в TypeScript
