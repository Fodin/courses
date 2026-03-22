# Задание 6.2: UI Store

## 🎯 Цель

Научиться разделять состояние на доменный стор (бизнес-данные) и UI-стор (состояние интерфейса), связывая их через конструктор.

## 📋 Требования

1. Создайте класс `TodoDomainStore` с `makeAutoObservable`:
   - Observable: `todos[]`
   - Actions: `addTodo`, `removeTodo`, `toggleTodo`
   - Computed: `completedCount`, `activeCount`
2. Создайте класс `TodoUIStore` с `makeAutoObservable`:
   - Принимает `domainStore: TodoDomainStore` через конструктор
   - Observable поля:
     - `filter: 'all' | 'active' | 'completed'` (по умолчанию `'all'`)
     - `editingId: string | null` (по умолчанию `null`)
     - `isAddFormOpen: boolean` (по умолчанию `false`)
   - Actions: `setFilter(filter)`, `setEditingId(id)`, `toggleAddForm()`
   - Computed: `filteredTodos` — фильтрует `domainStore.todos` по текущему фильтру
3. Создайте оба стора на уровне модуля, передав `domainStore` в конструктор `UIStore`
4. В observer-компоненте:
   - Кнопка "+ Add Todo" / "Cancel" для переключения формы добавления (`isAddFormOpen`)
   - Кнопки фильтрации (all / active / completed) с выделением текущего фильтра
   - Список задач из `uiStore.filteredTodos`
   - Подсветка редактируемой задачи (`editingId`)
   - Статистика: отображение количества отфильтрованных / всего

```typescript
class TodoUIStore {
  filter: 'all' | 'active' | 'completed' = 'all'
  editingId: string | null = null
  isAddFormOpen = false

  constructor(private domainStore: TodoDomainStore)

  get filteredTodos(): Todo[]
}
```

## Чеклист

- [ ] `TodoDomainStore` содержит только бизнес-логику
- [ ] `TodoUIStore` содержит только UI-состояние
- [ ] `TodoUIStore` получает `domainStore` через конструктор
- [ ] `filteredTodos` в UIStore фильтрует данные из domainStore
- [ ] Кнопка `toggleAddForm` показывает/скрывает форму добавления
- [ ] Фильтры переключаются и влияют на отображаемый список
- [ ] `editingId` подсвечивает выбранную задачу

## 🔍 Как проверить себя

1. Нажмите "+ Add Todo" — появится форма ввода, кнопка сменится на "Cancel"
2. Добавьте задачу — форма закроется, задача появится в списке
3. Переключите фильтр — список обновится, внизу статистика покажет "Showing: X / Y"
4. Нажмите Edit у задачи — строка подсветится фоновым цветом
5. Убедитесь, что бизнес-операции (toggle, delete) идут через domainStore, а UI-операции (filter, editingId) — через uiStore
