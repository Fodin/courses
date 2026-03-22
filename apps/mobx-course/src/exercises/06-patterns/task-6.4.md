# Задание 6.4: Store с моделями

## 🎯 Цель

Научиться создавать модели (классы-сущности) с собственными observable, computed и actions вместо использования простых объектов.

## 📋 Требования

1. Создайте класс-модель `Todo` с `makeAutoObservable(this)` в конструкторе:
   - Поля: `id: string`, `title: string`, `completed: boolean`, `createdAt: Date`, `deadline: Date | null`
   - Конструктор принимает `title` и опциональный `deadline`
   - Action: `toggle()` — переключает `completed`
   - Computed `isOverdue` — `true`, если `deadline` установлен, задача не завершена, и текущая дата позже дедлайна
   - Computed `status` — возвращает `'completed'`, `'overdue'` или `'active'`
2. Создайте класс `TodoModelStore` с `makeAutoObservable`:
   - Observable: `todos: Todo[]`
   - Action `addTodo(title, deadline?)` — создаёт экземпляр `new Todo(...)` и добавляет в массив
   - Action `removeTodo(id)` — удаляет задачу по `id`
   - Computed: `completedCount`, `overdueCount`
3. В observer-компоненте:
   - Поле ввода для заголовка и поле выбора даты (deadline)
   - Статистика: Total / Completed / Overdue
   - Список задач, где каждая задача — отдельный observer-компонент `TodoItem`
   - Цветовая индикация статуса: active (синий), overdue (красный), completed (зелёный)

```typescript
class Todo {
  id: string
  title: string
  completed = false
  createdAt: Date
  deadline: Date | null

  constructor(title: string, deadline?: Date)

  toggle(): void
  get isOverdue(): boolean
  get status(): 'completed' | 'overdue' | 'active'
}

class TodoModelStore {
  todos: Todo[] = []

  addTodo(title: string, deadline?: Date): void
  removeTodo(id: string): void
  get completedCount(): number
  get overdueCount(): number
}
```

## Чеклист

- [ ] `Todo` — класс с `makeAutoObservable` в конструкторе
- [ ] `Todo.toggle()` переключает `completed`
- [ ] `Todo.isOverdue` корректно определяет просрочку
- [ ] `Todo.status` возвращает одно из трёх значений: `completed`, `overdue`, `active`
- [ ] `TodoModelStore` работает с экземплярами `Todo` (не с простыми объектами)
- [ ] `TodoItem` — отдельный observer-компонент для каждой задачи
- [ ] Цветовая индикация статуса отображается корректно

## 🔍 Как проверить себя

1. Добавьте задачу без дедлайна — статус `active` (синий)
2. Добавьте задачу с дедлайном в прошлом — статус `overdue` (красный), счётчик Overdue увеличится
3. Отметьте просроченную задачу — статус сменится на `completed` (зелёный), Overdue уменьшится
4. Удалите задачу — она исчезнет из списка, счётчики обновятся
5. Убедитесь, что `toggle()` вызывается на самом объекте `todo`, а не через стор
