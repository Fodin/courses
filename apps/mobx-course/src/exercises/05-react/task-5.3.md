# Задание 5.3: Store через Context

## 🎯 Цель

Научиться передавать MobX-стор через React Context и использовать кастомный хук для доступа к нему из дочерних observer-компонентов.

## 📋 Требования

1. Создайте класс `TodoStore` с `makeAutoObservable`:
   - Observable: `todos: Todo[]`, `filter: 'all' | 'active' | 'completed'`
   - Actions: `addTodo(title)`, `removeTodo(id)`, `toggleTodo(id)`, `setFilter(filter)`
   - Computed: `filteredTodos` (список задач по текущему фильтру), `activeCount` (количество незавершённых)
2. Создайте `TodoContext` через `createContext<TodoStore | null>(null)`
3. Создайте кастомный хук `useTodoStore()`:
   - Достаёт стор из контекста
   - Бросает ошибку, если стор не предоставлен
4. Создайте **отдельный** observer-компонент `TodoList`:
   - Использует `useTodoStore()` для получения стора
   - Отображает `filteredTodos` с чекбоксами и кнопкой удаления
5. Создайте **отдельный** observer-компонент `TodoFilters`:
   - Использует `useTodoStore()` для получения стора
   - Отображает кнопки фильтрации (all, active, completed)
   - У кнопки active показывает `activeCount` в скобках
6. В корневом компоненте:
   - Создайте экземпляр стора через `useState(() => new TodoStore())`
   - Оберните дочерние компоненты в `TodoContext.Provider`
   - Добавьте поле ввода и кнопку для создания новых задач

```typescript
interface Todo {
  id: string
  title: string
  completed: boolean
}
```

## Чеклист

- [ ] `TodoStore` создан с `makeAutoObservable`
- [ ] `TodoContext` создан и используется `Provider` в корневом компоненте
- [ ] Кастомный хук `useTodoStore()` бросает ошибку при отсутствии провайдера
- [ ] `TodoList` — отдельный observer-компонент, использующий `useTodoStore()`
- [ ] `TodoFilters` — отдельный observer-компонент, использующий `useTodoStore()`
- [ ] Фильтрация работает: all/active/completed
- [ ] `activeCount` отображается рядом с кнопкой active

## 🔍 Как проверить себя

1. Добавьте несколько задач — они появляются в списке
2. Отметьте часть задач как выполненные — `activeCount` обновляется
3. Нажмите фильтр active — останутся только незавершённые задачи
4. Нажмите completed — останутся только завершённые
5. Нажмите all — отобразятся все задачи
6. Удалите задачу — она исчезает из списка
