# Задание 6.3: Root Store

## 🎯 Цель

Научиться создавать корневой стор (Root Store), который объединяет все дочерние сторы и служит единой точкой инициализации.

## 📋 Требования

1. Создайте класс `TodoDomainStore63` с `makeAutoObservable`:
   - Observable: `todos[]`
   - Actions: `addTodo`, `removeTodo`, `toggleTodo`
   - Computed: `completedCount`, `activeCount`
2. Создайте класс `TodoUIStore63` с `makeAutoObservable`:
   - Принимает `root: RootStore63` через конструктор (не отдельный domainStore, а весь root)
   - Observable: `filter: 'all' | 'active' | 'completed'`, `editingId: string | null`
   - Actions: `setFilter(filter)`
   - Computed: `filteredTodos` — фильтрует `this.root.todoStore.todos` по текущему фильтру
3. Создайте класс `RootStore63`:
   - Создаёт `todoStore: TodoDomainStore63` и `uiStore: TodoUIStore63` в конструкторе
   - Передаёт `this` (себя) в конструктор `TodoUIStore63`
4. Создайте единственный экземпляр `RootStore63` на уровне модуля
5. В observer-компоненте:
   - Деструктурируйте `rootStore` на `todoStore` и `uiStore`
   - Поле ввода + кнопка Add
   - Кнопки фильтрации с количеством в скобках (all, active, completed)
   - Список задач с чекбоксами и кнопкой Delete

```typescript
class RootStore63 {
  todoStore: TodoDomainStore63
  uiStore: TodoUIStore63

  constructor() {
    this.todoStore = new TodoDomainStore63()
    this.uiStore = new TodoUIStore63(this) // передаём root
  }
}
```

## Чеклист

- [ ] `RootStore63` создаёт оба стора в конструкторе
- [ ] `TodoUIStore63` получает `root` (а не отдельный domainStore)
- [ ] `TodoUIStore63` обращается к данным через `this.root.todoStore`
- [ ] Единственная точка инициализации — `new RootStore63()`
- [ ] Кнопки фильтрации показывают количество в скобках
- [ ] Фильтрация и CRUD-операции работают корректно

## 🔍 Как проверить себя

1. Добавьте несколько задач — они отображаются в списке
2. Нажмите active — отобразятся только незавершённые, в скобках видно количество
3. Отметьте задачу — она пропадёт из фильтра active, счётчики обновятся
4. Переключитесь на completed — отобразятся завершённые задачи
5. Убедитесь, что `TodoUIStore63` получает данные через `root.todoStore`, а не напрямую
