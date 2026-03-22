# Задание 6.1: Domain Store

## 🎯 Цель

Научиться проектировать доменный стор, который содержит только бизнес-логику и данные без примешивания UI-состояния.

## 📋 Требования

1. Создайте класс `TodoStore` с `makeAutoObservable`:
   - Observable: `todos: { id: string; title: string; completed: boolean }[]`
2. Добавьте action-методы (только бизнес-логика):
   - `addTodo(title)` — добавляет новую задачу с уникальным `id` и `completed: false`
   - `removeTodo(id)` — удаляет задачу по `id`
   - `toggleTodo(id)` — переключает `completed` у задачи
3. Добавьте computed геттеры:
   - `completedCount` — количество завершённых задач
   - `activeCount` — количество незавершённых задач
4. **Не добавляйте** в стор UI-состояние (фильтры, editingId, isFormOpen и т.п.)
5. Создайте экземпляр стора на уровне модуля
6. В observer-компоненте отобразите:
   - Поле ввода и кнопку для добавления задачи
   - Статистику: Active / Completed / Total
   - Список задач с чекбоксами и кнопкой Delete

```typescript
class TodoStore {
  todos: { id: string; title: string; completed: boolean }[] = []

  addTodo(title: string): void
  removeTodo(id: string): void
  toggleTodo(id: string): void

  get completedCount(): number
  get activeCount(): number
}
```

## Чеклист

- [ ] `TodoStore` содержит только бизнес-логику (данные и операции над ними)
- [ ] В сторе нет UI-состояния (нет filter, editingId, isOpen и подобного)
- [ ] `addTodo` генерирует уникальный `id` (например, `crypto.randomUUID()`)
- [ ] `completedCount` и `activeCount` — computed геттеры
- [ ] Компонент обёрнут в `observer`
- [ ] Статистика обновляется автоматически при изменении задач

## 🔍 Как проверить себя

1. Добавьте 3 задачи — Total показывает 3, Active показывает 3, Completed показывает 0
2. Отметьте 1 задачу — Active: 2, Completed: 1
3. Удалите завершённую задачу — Total: 2, Active: 2, Completed: 0
4. Убедитесь, что стор не содержит никаких полей, связанных с UI
