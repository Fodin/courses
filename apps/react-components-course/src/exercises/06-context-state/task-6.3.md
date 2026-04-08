# Задание 6.3: Generic createStore

## Цель

Создать фабричную функцию `createStore<S, A>`, которая устраняет дублирование кода при создании Provider + Context-пар, и продемонстрировать работу селекторов на примере todo-листа.

## Требования

1. Реализуйте функцию `createStore<S, A>(reducer, initialState)` возвращающую объект с тремя элементами:
   - `Provider: React.FC<{ children: React.ReactNode }>` — компонент-провайдер с `useReducer` внутри
   - `useStore<R>(selector: (state: S) => R): R` — хук с селектором
   - `useDispatch(): React.Dispatch<A>` — хук для dispatch
2. Внутри `createStore` создаются два контекста: для state и для dispatch (как в задании 6.1)
3. Определите типы для todo-приложения:
   - `Todo { id, text, done }`
   - `TodoState { todos: Todo[], filter: 'all' | 'active' | 'done' }`
   - `TodoAction` — discriminated union с `ADD`, `TOGGLE`, `REMOVE`, `SET_FILTER`
4. Реализуйте `todoReducer` и начальное состояние с 2-3 тестовыми задачами
5. Создайте стор через фабрику: `const { Provider, useStore, useDispatch } = createStore(todoReducer, initialState)`
6. Реализуйте минимум 3 компонента, каждый подписан на свой срез через селектор:
   - `TodoList` — список с фильтрацией (селектор фильтрует на основе `state.filter`)
   - `TodoStats` — счётчики всего/выполнено/активных
   - `TodoFilters` — кнопки переключения фильтра
7. Компонент формы добавления задачи с `onSubmit`
8. Все компоненты обёрнуты в `Provider` в `Task6_3`

## Подсказки

- `createContext` можно вызывать внутри функции — каждый вызов `createStore` создаёт новую пару контекстов
- Возвращаемые типы TypeScript: `{ Provider: React.FC<{children: ReactNode}>, useStore: <R>(sel: (s: S) => R) => R, useDispatch: () => Dispatch<A> }`
- Селектор в `TodoList`: `useStore(s => s.filter === 'active' ? s.todos.filter(t => !t.done) : ...)`
- `TodoStats` можно реализовать с тремя отдельными вызовами `useStore` с разными селекторами

## Чеклист

- [ ] `createStore` типизирован с двумя generic-параметрами `<S, A>`
- [ ] `Provider` использует `useReducer` внутри
- [ ] `useStore` принимает типизированный селектор
- [ ] `TodoList` фильтрует через селектор, а не вне него
- [ ] `TodoStats` подписан только на счётчики (не на `filter`)
- [ ] `TodoFilters` подписан только на `filter`
- [ ] Добавление, переключение и удаление задач работают
- [ ] Переключение фильтра не вызывает ре-рендер `TodoStats` (один стор, разные подписки)

## Как проверить себя

Добавьте несколько задач. Отметьте часть как выполненные. Переключайте фильтры — список должен обновляться. Счётчики должны показывать актуальные числа при любом фильтре. Удалите задачу — счётчик "Всего" уменьшился. Попробуйте создать второй стор через `createStore` с другим reducer — убедитесь, что они независимы.
